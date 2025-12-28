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

### 6. Set Up SSL with Let's Encrypt (Automatic HTTPS)

The Docker setup includes automatic Let's Encrypt certificate management. To set it up:

**Prerequisites:**
- Your domain name must point to your server's IP address
- Ports 80 and 443 must be open in your firewall

**Initial Setup:**

1. Start the containers (without SSL first):
```bash
docker compose up -d --build
```

2. Run the initialization script to obtain certificates:
```bash
./scripts/init-letsencrypt.sh toolsforfrontend.com your@email.com
```

Replace:
- `your@email.com` with your email address (for certificate expiration notices)

Note: The domain `toolsforfrontend.com` is already configured. If you want to use a different domain, update `nginx/nginx-ssl.conf` first.

3. The script will:
   - Request a certificate from Let's Encrypt
   - Update the nginx configuration with SSL settings
   - Restart nginx to enable HTTPS

**Automatic Renewal:**

The `certbot` container automatically checks for certificate renewal every 12 hours. Certificates are valid for 90 days, so this ensures they're renewed before expiration.

**Optional: Set up automatic nginx reload after renewal**

For automatic nginx reload after certificate renewal, set up a cron job on your server:

```bash
# Edit crontab
crontab -e

# Add this line (adjust path to your project):
0 3 * * * cd /path/to/dev-tools && ./scripts/renew-certs.sh >> /var/log/certbot-renewal.log 2>&1
```

This runs the renewal check daily at 3 AM and reloads nginx if certificates were renewed.

**Manual Renewal (if needed):**

```bash
# Option 1: Use the renewal script
./scripts/renew-certs.sh

# Option 2: Manual renewal
docker compose run --rm certbot renew
docker compose restart nginx
```

**Verification:**

After setup, your site should be available at:
- `https://toolsforfrontend.com` (HTTPS - secure)
- `http://toolsforfrontend.com` (HTTP - automatically redirects to HTTPS)

**Troubleshooting:**

If certificate generation fails:
1. Ensure your domain DNS is pointing to the server IP
2. Check that ports 80 and 443 are open: `sudo ufw status`
3. Verify nginx is running: `docker compose ps`
4. Check certbot logs: `docker compose logs certbot`

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
