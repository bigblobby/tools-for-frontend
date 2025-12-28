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

# Request certificate for both main domain and www subdomain
echo "Requesting certificate from Let's Encrypt..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

if [ $? -eq 0 ]; then
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

