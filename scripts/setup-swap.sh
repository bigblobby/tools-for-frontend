#!/bin/bash

# Setup swap space on Digital Ocean droplet to prevent OOM during Docker builds
# Usage: sudo ./scripts/setup-swap.sh [size_in_gb]
# Default: 4GB swap (recommended for systems with 512MB-1GB RAM)

set -e

SWAP_SIZE=${1:-4}
SWAP_FILE="/swapfile"

# Check if swap already exists
if swapon --show | grep -q "$SWAP_FILE"; then
    echo "Swap file already exists and is active."
    swapon --show
    exit 0
fi

# Check if swap file exists but is not active
if [ -f "$SWAP_FILE" ]; then
    echo "Swap file exists but is not active. Activating..."
    sudo swapon "$SWAP_FILE"
    swapon --show
    exit 0
fi

echo "Creating ${SWAP_SIZE}GB swap file at $SWAP_FILE..."

# Create swap file
sudo fallocate -l ${SWAP_SIZE}G "$SWAP_FILE" || sudo dd if=/dev/zero of="$SWAP_FILE" bs=1G count=$SWAP_SIZE

# Set correct permissions
sudo chmod 600 "$SWAP_FILE"

# Format as swap
sudo mkswap "$SWAP_FILE"

# Enable swap
sudo swapon "$SWAP_FILE"

# Make it permanent
echo "$SWAP_FILE none swap sw 0 0" | sudo tee -a /etc/fstab

# Show swap status
echo "Swap file created and activated:"
swapon --show
free -h

echo ""
echo "Swap setup complete! ${SWAP_SIZE}GB swap space is now available."

