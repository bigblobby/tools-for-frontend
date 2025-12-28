# Deployment Guide for Digital Ocean

This guide explains how to deploy the dev-tools application to Digital Ocean using Docker and nginx.

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
git clone <your-repo-url> dev-tools
cd dev-tools
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

### 6. Set Up SSL with Let's Encrypt (Optional but Recommended)

If you have a domain name, set up SSL using Certbot:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Stop nginx container temporarily
docker compose stop nginx

# Obtain certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx configuration to use SSL
# You'll need to modify nginx/nginx.conf to include SSL configuration
```

Update `nginx/nginx.conf` to include SSL:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of your nginx config ...
}
```

Then mount the SSL certificates in `docker-compose.yml`:

```yaml
nginx:
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro
```

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
docker compose logs -f nginx
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

1. Check nginx logs: `docker compose logs nginx`
2. Verify nginx is running: `docker compose ps`
3. Check if frontend files exist in nginx container:
   ```bash
   docker exec dev-tools-nginx ls -la /usr/share/nginx/html
   ```

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

The setup includes health checks for backend and nginx. You can verify:

```bash
# Check health status
docker compose ps
```

Healthy containers will show as "healthy" in the status.

## Security Best Practices

1. Keep Docker and system packages updated
2. Use non-root users in containers (already configured for backend)
3. Regularly update application dependencies
4. Use SSL/TLS for all production deployments
5. Implement rate limiting in nginx (can be added to nginx.conf)
6. Regularly review and update security configurations
