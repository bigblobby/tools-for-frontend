# Deployment Guide for Digital Ocean

This guide explains how to deploy the tools-for-frontend application to Digital Ocean using Docker and Caddy (with automatic SSL/TLS).

## CI/CD Deployment (Recommended)

The project uses GitHub Actions to build Docker images and deploy them automatically. This avoids memory issues when building on small Digital Ocean droplets.

### Setup CI/CD

1. **Configure GitHub Secrets**:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `DROPLET_HOST`: Your Digital Ocean droplet IP address or hostname
     - `DROPLET_USER`: SSH username (usually `root` or your user)
     - `DROPLET_SSH_KEY`: Your private SSH key for accessing the droplet

2. **Configure Image Registry**:
   - The workflow automatically builds and pushes images to GitHub Container Registry (ghcr.io)
   - Images are tagged with: `ghcr.io/<your-username>/<repo-name>/backend:latest` and `ghcr.io/<your-username>/<repo-name>/caddy:latest`

3. **Configure docker-compose.yml**:
   - Set environment variable on your server:
     ```bash
     export IMAGE_REPO=your-username/dev-tools
     ```
   - Or create a `.env` file in the project root:
     ```env
     IMAGE_REPO=your-username/dev-tools
     ```

4. **Initial Server Setup**:
   - Follow steps 1-3 in "Server Setup" below (install Docker, clone repo, configure .env)
   - Make sure Docker is installed and your user can run docker commands

5. **Deployment**:
   - Push to `main` or `master` branch → Images are built automatically
   - After build completes → Deployment workflow runs automatically
   - Or trigger manually: Actions → Deploy to Digital Ocean → Run workflow

### Manual Deployment (Alternative)

If you prefer to deploy manually after images are built:

```bash
# SSH into your server
ssh user@your-droplet

# Navigate to project directory
cd /opt/tools-for-frontend  # or wherever you cloned the repo

# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Set environment variables
export IMAGE_REGISTRY=ghcr.io
export IMAGE_REPO=your-username/dev-tools

# Pull and start containers
docker compose pull
docker compose up -d
```

## Manual Build and Deploy (Legacy)

If you need to build on the server (not recommended for small droplets):

## Quick Start (Local Testing)

Before deploying to production, you can test the Docker setup locally:

```bash
# From the project root directory
docker compose up -d --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost/api
# Backend direct: http://localhost:3001/api

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

## Prerequisites

- A Digital Ocean droplet (Ubuntu 22.04 or later recommended)
- Docker and Docker Compose installed on the server
- Domain name pointed to your droplet's IP address (optional but recommended)
- SSH access to your droplet

## Server Setup

### 1. Install Docker and Docker Compose

SSH into your Digital Ocean droplet and run:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 2. Clone Your Repository

```bash
# Navigate to a suitable directory
cd /opt

# Clone your repository (replace with your actual repo URL)
git clone <your-repo-url> tools-for-frontend
cd tools-for-frontend
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
nano .env
```

Add the following:

```env
NODE_ENV=production
PORT=3001
```

### 4. Configure Image Registry (for CI/CD deployment)

If using CI/CD, create a `.env` file in the project root:

```bash
cd /opt/tools-for-frontend  # or your project directory
nano .env
```

Add:
```env
IMAGE_REPO=your-username/dev-tools
```

Replace `your-username/dev-tools` with your actual GitHub username and repository name (e.g., `tomdempster/dev-tools`).

### 5. Build and Start Containers

**Option A: Using pre-built images (Recommended - CI/CD)**

```bash
# Login to GitHub Container Registry (first time only)
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Pull and start containers
docker compose pull
docker compose up -d
```

**Option B: Build locally (if you have enough memory)**

```bash
# Uncomment build sections in docker-compose.yml first
docker compose up -d --build
```

**Check status**:
```bash
docker compose ps
docker compose logs -f
```

### 6. Configure Firewall

If you're using UFW (Ubuntu Firewall):

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS (if using SSL)
sudo ufw enable
```

### 7. Set Up SSL with Caddy (Automatic)

Caddy automatically obtains and renews SSL certificates from Let's Encrypt. To enable automatic HTTPS:

1. **Update the Caddyfile** with your domain name:

Edit `Caddyfile` and replace `:80` with your domain:

```caddy
yourdomain.com {
    # Enable automatic HTTPS (Let's Encrypt)
    tls yourdomain.com

    # ... rest of configuration ...
}
```

Or for multiple domains:

```caddy
yourdomain.com, www.yourdomain.com {
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
    # ... rest of configuration ...
}
```

2. **For DNS challenge** (recommended for production), you can use environment variables in docker-compose.yml:

```yaml
caddy:
  environment:
    - CLOUDFLARE_API_TOKEN=your_token_here
```

3. **Restart the Caddy container**:

```bash
docker compose up -d --build caddy
```

Caddy will automatically:
- Obtain SSL certificates from Let's Encrypt
- Renew certificates before they expire
- Redirect HTTP to HTTPS
- Handle all SSL/TLS configuration

**Note**: For local development, the default `:80` configuration works without SSL. For production, always use your domain name in the Caddyfile.

## Updating the Application

### Using CI/CD (Recommended)

Simply push your changes to the `main` or `master` branch:
- Images are built automatically in GitHub Actions
- Deployment happens automatically after successful build
- No need to SSH into the server

### Manual Update

If you need to update manually:

```bash
# SSH into server
ssh user@your-droplet

# Navigate to project directory
cd /opt/tools-for-frontend

# Pull latest code (optional, if you want latest docker-compose.yml)
git pull

# Pull latest images and restart
docker compose pull
docker compose up -d

# Or if you need to rebuild locally (not recommended on small droplets):
docker compose up -d --build
```

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f caddy
```

### Check Container Status

```bash
docker compose ps
```

### Restart Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
```

### Stop Services

```bash
docker compose down
```

### Clean Up (if needed)

```bash
# Stop and remove containers, networks
docker compose down

# Remove volumes (WARNING: This deletes data)
docker compose down -v

# Remove unused images
docker image prune -a
```

## Troubleshooting

### Backend not responding

1. Check backend logs: `docker compose logs backend`
2. Verify backend is running: `docker compose ps`
3. Test backend directly: `curl http://localhost:3001/api/health`

### Frontend not loading

1. Check Caddy logs: `docker compose logs caddy`
2. Verify Caddy is running: `docker compose ps`
3. Check if frontend files exist in Caddy container:
   ```bash
   docker exec tools-for-frontend-caddy ls -la /usr/share/caddy
   ```
4. Verify Caddyfile syntax: `docker exec tools-for-frontend-caddy caddy validate --config /etc/caddy/Caddyfile`

### Port conflicts

If ports 80 or 3001 are already in use:

1. Find what's using the port: `sudo lsof -i :80`
2. Either stop the conflicting service or change ports in `docker-compose.yml`

## Production Considerations

1. **Environment Variables**: Use Docker secrets or environment files for sensitive data
2. **Backups**: Set up regular backups of your database (if you add one)
3. **Monitoring**: Consider adding monitoring tools like Prometheus or Grafana
4. **Logging**: Set up centralized logging (e.g., ELK stack or CloudWatch)
5. **Auto-restart**: Docker Compose `restart: unless-stopped` ensures containers restart on server reboot
6. **Resource Limits**: Add resource limits to containers in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

## Health Checks

The setup includes health checks for backend and Caddy. You can verify:

```bash
# Check health status
docker compose ps
```

Healthy containers will show as "healthy" in the status.

## Security Best Practices

1. Keep Docker and system packages updated
2. Use non-root users in containers (already configured for backend)
3. Regularly update application dependencies
4. Use SSL/TLS for all production deployments (automatically handled by Caddy)
5. Implement rate limiting in Caddy (can be added to Caddyfile using `rate_limit` directive)
6. Regularly review and update security configurations
7. Caddy automatically renews SSL certificates, but ensure ports 80 and 443 are open for Let's Encrypt validation
