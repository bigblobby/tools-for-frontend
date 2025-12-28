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

# Ensure nginx is running with init config
echo "Starting nginx with initial configuration..."
docker compose up -d nginx

# Wait for nginx to be ready
echo "Waiting for nginx to be ready..."
sleep 5

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

