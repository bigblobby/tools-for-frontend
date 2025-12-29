#!/bin/bash

# Build script that builds Docker services sequentially to avoid OOM errors
# Optimized for low-memory systems (512MB-1GB RAM)
# Usage: ./scripts/build-sequential.sh

set -e

echo "Building Docker services sequentially to avoid memory issues..."
echo "This script is optimized for low-memory systems."

# Clean up any existing containers and unused resources
echo "Cleaning up unused Docker resources..."
docker compose down 2>/dev/null || true
docker system prune -f --volumes 2>/dev/null || true

# Build backend first
echo "Building backend service..."
docker compose build --no-cache backend || docker compose build backend

# Clean up intermediate build layers to free memory
echo "Cleaning up build cache..."
docker builder prune -f

# Build nginx (which includes frontend)
echo "Building nginx service (includes frontend)..."
docker compose build --no-cache nginx || docker compose build nginx

# Final cleanup
echo "Final cleanup..."
docker builder prune -f

# Start all services
echo "Starting all services..."
docker compose up -d

echo ""
echo "Build and deployment complete!"
echo "Check status with: docker compose ps"
echo "View logs with: docker compose logs -f"

