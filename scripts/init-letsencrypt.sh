#!/bin/bash

# Script to initialize Let's Encrypt certificates
# Usage: ./scripts/init-letsencrypt.sh toolsforfrontend.com your@email.com

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <domain> <email>"
    echo "Example: $0 toolsforfrontend.com admin@example.com"
    echo ""
    echo "Note: This will request certificates for both the domain and www subdomain"
    exit 1
fi

DOMAIN=$1
EMAIL=$2

echo "Initializing Let's Encrypt for domain: $DOMAIN"
echo "Email: $EMAIL"

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Create necessary directories
mkdir -p certbot/conf certbot/www

# Check if containers need to be built
if ! docker compose ps --format json 2>/dev/null | grep -q "tools-for-frontend-backend"; then
    echo "Containers not found. Building containers first..."
    echo "This may take several minutes, especially on low-memory systems..."
    docker compose build
fi

# Ensure backend is running first (nginx depends on it)
echo "Starting backend (nginx depends on it)..."
docker compose up -d backend

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
BACKEND_MAX_WAIT=60
BACKEND_WAIT_COUNT=0
while [ $BACKEND_WAIT_COUNT -lt $BACKEND_MAX_WAIT ]; do
    if docker compose exec -T backend wget --quiet --tries=1 --spider http://localhost:3001/api/health 2>/dev/null; then
        echo "Backend is ready!"
        break
    fi
    echo "Waiting for backend... ($BACKEND_WAIT_COUNT/$BACKEND_MAX_WAIT seconds)"
    sleep 2
    BACKEND_WAIT_COUNT=$((BACKEND_WAIT_COUNT + 2))
done

if [ $BACKEND_WAIT_COUNT -ge $BACKEND_MAX_WAIT ]; then
    echo "⚠️  Warning: Backend may not be ready, but continuing..."
fi

# Ensure nginx is running with init config
echo "Starting nginx with initial configuration..."
docker compose up -d nginx

# Wait for nginx to be ready (actually check, don't just sleep)
echo "Waiting for nginx to be ready..."
NGINX_MAX_WAIT=60
NGINX_WAIT_COUNT=0
while [ $NGINX_WAIT_COUNT -lt $NGINX_MAX_WAIT ]; do
    # Check if nginx container is running
    if ! docker compose ps nginx | grep -q "Up"; then
        echo "Nginx container is not running. Checking logs..."
        docker compose logs --tail=20 nginx
        echo "❌ Nginx failed to start. Please check the logs above."
        exit 1
    fi
    
    # Check if nginx is responding
    if docker compose exec -T nginx wget --quiet --tries=1 --spider http://localhost/ 2>/dev/null; then
        echo "Nginx is ready!"
        break
    fi
    echo "Waiting for nginx... ($NGINX_WAIT_COUNT/$NGINX_MAX_WAIT seconds)"
    sleep 2
    NGINX_WAIT_COUNT=$((NGINX_WAIT_COUNT + 2))
done

if [ $NGINX_WAIT_COUNT -ge $NGINX_MAX_WAIT ]; then
    echo "❌ Nginx did not become ready within $NGINX_MAX_WAIT seconds."
    echo "Checking nginx logs..."
    docker compose logs --tail=30 nginx
    exit 1
fi

# Verify the certbot www directory is accessible from nginx
echo "Verifying certbot webroot is accessible..."
if [ ! -d "certbot/www" ]; then
    echo "Creating certbot/www directory..."
    mkdir -p certbot/www
fi

# Test that nginx can serve files from the webroot
echo "Testing nginx webroot access..."
docker compose exec -T nginx sh -c "echo 'test' > /var/www/certbot/test.txt && cat /var/www/certbot/test.txt" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Nginx webroot is accessible"
else
    echo "⚠️  Warning: Could not write to nginx webroot"
fi

# Check DNS resolution - CRITICAL for Let's Encrypt
echo "Checking DNS resolution for $DOMAIN..."
SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "unknown")

# Use external DNS servers (what Let's Encrypt uses) instead of local resolver
# Try multiple DNS servers in case one hasn't propagated yet
DOMAIN_IP=""
for dns_server in "8.8.8.8" "1.1.1.1" "8.8.4.4"; do
    DOMAIN_IP=$(dig @$dns_server +short $DOMAIN | tail -n1 | grep -E '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' || echo "")
    if [ -n "$DOMAIN_IP" ] && [ "$DOMAIN_IP" != "" ]; then
        echo "Resolved via $dns_server: $DOMAIN -> $DOMAIN_IP"
        break
    fi
done

# If still no result, try local resolver as fallback
if [ -z "$DOMAIN_IP" ] || [ "$DOMAIN_IP" = "" ]; then
    DOMAIN_IP=$(dig +short $DOMAIN | tail -n1 | grep -E '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' || echo "")
    if [ -n "$DOMAIN_IP" ]; then
        echo "Resolved via local DNS: $DOMAIN -> $DOMAIN_IP"
    fi
fi

DNS_OK=false
if [ -n "$DOMAIN_IP" ] && [ "$DOMAIN_IP" != "" ]; then
    echo "Domain $DOMAIN resolves to: $DOMAIN_IP"
    if [ "$SERVER_IP" != "unknown" ]; then
        echo "Server IP appears to be: $SERVER_IP"
        if [ "$DOMAIN_IP" = "$SERVER_IP" ]; then
            echo "✅ DNS is correctly pointing to this server"
            DNS_OK=true
        else
            echo "⚠️  Warning: Domain IP ($DOMAIN_IP) doesn't match server IP ($SERVER_IP)"
            echo "   This might be okay if you're using a load balancer or CDN"
        fi
    else
        echo "⚠️  Could not determine server IP, but domain resolves to: $DOMAIN_IP"
        DNS_OK=true  # Assume OK if we can't check
    fi
else
    echo "❌ Could not resolve $DOMAIN using external DNS servers"
    echo "   DNS may not be configured or hasn't propagated to public DNS yet"
fi

if [ "$DNS_OK" = false ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "⚠️  DNS CONFIGURATION REQUIRED"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "Let's Encrypt requires your domain to be properly configured"
    echo "before it can issue certificates."
    echo ""
    echo "You need to:"
    echo "  1. Point your domain $DOMAIN to this server's IP address"
    echo "  2. Point www.$DOMAIN to this server's IP address"
    echo ""
    if [ "$SERVER_IP" != "unknown" ]; then
        echo "Your server IP appears to be: $SERVER_IP"
        echo ""
        echo "Configure these DNS records:"
        echo "  Type: A"
        echo "  Name: @ (or $DOMAIN)"
        echo "  Value: $SERVER_IP"
        echo ""
        echo "  Type: A"
        echo "  Name: www"
        echo "  Value: $SERVER_IP"
    else
        echo "Run this command to find your server IP:"
        echo "  curl ifconfig.me"
    fi
    echo ""
    echo "After configuring DNS, wait for propagation (can take minutes to hours)"
    echo "Then verify with: dig $DOMAIN"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    read -p "Continue anyway? (This will likely fail) [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting. Please configure DNS first, then run this script again."
        exit 1
    fi
    echo "Continuing with certificate request (may hang or fail)..."
    echo ""
fi

# Check if certbot can reach Let's Encrypt servers
echo "Checking connectivity to Let's Encrypt servers..."
if docker compose run --rm --entrypoint="" certbot sh -c "wget --spider --timeout=5 https://acme-v02.api.letsencrypt.org/directory 2>&1" > /dev/null 2>&1; then
    echo "✅ Can reach Let's Encrypt servers"
else
    echo "⚠️  Warning: Cannot reach Let's Encrypt servers"
    echo "   This might be a network issue"
fi

# Request certificate for both main domain and www subdomain
echo ""
echo "Requesting certificate from Let's Encrypt..."
echo "This may take 30-60 seconds (or longer if DNS is still propagating)..."
echo ""
echo "⚠️  If this hangs for more than 2-3 minutes, it usually means:"
echo "  1. DNS hasn't propagated yet (can take up to 48 hours)"
echo "  2. Port 80 is not accessible from the internet"
echo "  3. Let's Encrypt servers cannot reach your domain"
echo ""
echo "You can check what's happening in another terminal with:"
echo "  docker compose logs -f"
echo ""
echo "Or check if the certbot container is running:"
echo "  docker compose ps"
echo ""

# Run certbot with verbose output
# Note: This may take a while if DNS hasn't propagated
# Using --dry-run first would be safer, but we'll do real request
echo "Starting certbot (this may take a minute)..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    --verbose \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

CERTBOT_EXIT_CODE=$?

echo ""
if [ $CERTBOT_EXIT_CODE -ne 0 ]; then
    echo "❌ Certbot exited with error code: $CERTBOT_EXIT_CODE"
    echo "Check the output above for details"
fi

if [ $CERTBOT_EXIT_CODE -eq 0 ]; then
    echo "Certificate obtained successfully!"
    
    # Copy SSL config to nginx.conf (domain is already set in nginx-ssl.conf)
    echo "Updating nginx configuration..."
    cp nginx/nginx-ssl.conf nginx/nginx.conf
    
    echo "Restarting nginx with SSL configuration..."
    docker compose restart nginx
    
    echo ""
    echo "✅ SSL setup complete!"
    echo "Your site should now be available at:"
    echo "  - https://$DOMAIN"
    echo "  - https://www.$DOMAIN"
    echo "HTTP traffic will automatically redirect to HTTPS"
else
    echo "❌ Certificate request failed. Please check:"
    echo "  1. Domain DNS is pointing to this server"
    echo "  2. Ports 80 and 443 are open"
    echo "  3. Nginx is running and accessible"
    exit 1
fi

