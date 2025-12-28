#!/bin/bash

# Script to manually renew Let's Encrypt certificates
# This can be run as a cron job: 0 3 * * * /path/to/renew-certs.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "Renewing Let's Encrypt certificates..."

# Renew certificates
docker compose run --rm certbot renew

# Reload nginx if certificates were renewed
if [ $? -eq 0 ]; then
    echo "Reloading nginx..."
    docker compose exec nginx nginx -s reload
    echo "Certificate renewal complete!"
else
    echo "No certificates needed renewal or renewal failed"
fi

