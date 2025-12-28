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

# Ensure nginx is using init config (needed for certbot)
echo "Ensuring nginx uses initial configuration for certbot..."
if [ ! -f "nginx/nginx-init.conf" ]; then
    echo "❌ nginx/nginx-init.conf not found!"
    exit 1
fi

# Copy init config to nginx.conf so docker-compose uses it
cp nginx/nginx-init.conf nginx/nginx.conf
echo "✅ Using nginx-init.conf for certbot setup"

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
    chmod 755 certbot/www
fi

# Create a test file to verify webroot is accessible via HTTP
echo "Creating test file in webroot..."
TEST_FILE="certbot/www/test-$(date +%s).txt"
echo "test" > "$TEST_FILE"
chmod 644 "$TEST_FILE"

# Test that nginx can serve files from the webroot via HTTP
echo "Testing nginx webroot HTTP access..."
sleep 2  # Give nginx a moment to pick up the file
TEST_URL="http://$DOMAIN/.well-known/acme-challenge/$(basename $TEST_FILE)"
HTTP_TEST=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$TEST_URL" 2>/dev/null || echo "000")

if [ "$HTTP_TEST" = "200" ]; then
    echo "✅ Nginx webroot is accessible via HTTP"
    rm -f "$TEST_FILE"  # Clean up test file
else
    echo "⚠️  Warning: Could not access webroot via HTTP (got status: $HTTP_TEST)"
    echo "   Testing with IP address instead..."
    IP_TEST=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://$SERVER_IP/.well-known/acme-challenge/$(basename $TEST_FILE)" 2>/dev/null || echo "000")
    if [ "$IP_TEST" = "200" ]; then
        echo "✅ Webroot accessible via IP, but domain may not be accessible from internet"
        echo "   This could cause Let's Encrypt verification to fail"
    else
        echo "❌ Webroot not accessible. Check nginx configuration and firewall."
    fi
    rm -f "$TEST_FILE"  # Clean up test file
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

# Test domain accessibility from outside before running certbot
echo ""
echo "Testing if domain is accessible from the internet..."
EXTERNAL_TEST=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://$DOMAIN" 2>/dev/null || echo "000")
if [ "$EXTERNAL_TEST" != "000" ] && [ "$EXTERNAL_TEST" != "" ]; then
    echo "✅ Domain is accessible from internet (HTTP status: $EXTERNAL_TEST)"
else
    echo "⚠️  Warning: Domain may not be accessible from internet"
    echo "   This will cause Let's Encrypt verification to fail"
    echo "   Check firewall: sudo ufw status"
    echo "   Test from outside: curl -I http://$DOMAIN"
fi

# Run certbot with timeout and better error handling
echo ""
echo "Starting certbot (with 5 minute timeout)..."
echo "If this hangs, certbot is likely waiting for Let's Encrypt to verify your domain"
echo ""

# Use timeout command if available, otherwise run in background with kill after timeout
if command -v timeout >/dev/null 2>&1; then
    timeout 300 docker compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        --verbose \
        --non-interactive \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" 2>&1 | tee /tmp/certbot-output.log
    
    CERTBOT_EXIT_CODE=${PIPESTATUS[0]}
else
    # Fallback: run in background and kill after timeout
    docker compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        --verbose \
        --non-interactive \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" > /tmp/certbot-output.log 2>&1 &
    
    CERTBOT_PID=$!
    
    # Wait up to 5 minutes
    for i in {1..300}; do
        if ! kill -0 $CERTBOT_PID 2>/dev/null; then
            wait $CERTBOT_PID
            CERTBOT_EXIT_CODE=$?
            break
        fi
        sleep 1
        if [ $i -eq 300 ]; then
            echo "⏱️  Timeout after 5 minutes. Killing certbot..."
            kill $CERTBOT_PID 2>/dev/null
            CERTBOT_EXIT_CODE=124
        fi
    done
    
    cat /tmp/certbot-output.log
fi

echo ""
if [ $CERTBOT_EXIT_CODE -eq 124 ]; then
    echo "⏱️  Certbot timed out after 5 minutes"
    echo "This usually means Let's Encrypt cannot verify your domain"
    echo ""
    echo "Common causes:"
    echo "  1. Port 80 is blocked by firewall"
    echo "  2. Domain is not accessible from internet"
    echo "  3. Nginx is not serving /.well-known/acme-challenge/ correctly"
    echo ""
    echo "Check certbot logs:"
    if [ -f /tmp/certbot-output.log ]; then
        tail -50 /tmp/certbot-output.log
    fi
    echo ""
    echo "Test manually:"
    echo "  curl -I http://$DOMAIN/.well-known/acme-challenge/test"
    exit 1
elif [ $CERTBOT_EXIT_CODE -ne 0 ]; then
    echo "❌ Certbot exited with error code: $CERTBOT_EXIT_CODE"
    echo "Check the output above for details"
    if [ -f /tmp/certbot-output.log ]; then
        echo ""
        echo "Last 50 lines of certbot output:"
        tail -50 /tmp/certbot-output.log
    fi
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

