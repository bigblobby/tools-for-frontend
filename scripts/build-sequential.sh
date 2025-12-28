#!/bin/bash

# Build script that builds Docker services sequentially to avoid OOM errors
# Usage: ./scripts/build-sequential.sh

set -e

echo "Building Docker services sequentially to avoid memory issues..."

# Build backend first
echo "Building backend service..."
docker compose build backend

# Build nginx (which includes frontend)
echo "Building nginx service (includes frontend)..."
docker compose build nginx

# Start all services
echo "Starting all services..."
docker compose up -d

echo "Build and deployment complete!"

