# Deployment Guide for Digital Ocean

This guide explains how to deploy the tools-for-frontend application to Digital Ocean using Docker and Caddy (with automatic SSL/TLS).

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

### 4. Build and Start Containers

From the project root directory:

```bash
# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### 5. Configure Firewall

If you're using UFW (Ubuntu Firewall):

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS (if using SSL)
sudo ufw enable
```

### 6. Set Up SSL with Caddy (Automatic)

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

To update your application:

```bash
# Pull latest changes
git pull

# Rebuild and restart containers
docker compose up -d --build

# If you only changed code (not dependencies), you can use:
docker compose restart
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
