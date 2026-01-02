#!/bin/bash
# Run this once on your server to set up the environment

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Caddy (if not already installed)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# Create deployment directory
sudo mkdir -p /var/www/tools-for-frontend
sudo chown -R $USER:$USER /var/www/tools-for-frontend

# Create PM2 ecosystem file (optional)
cat > /var/www/tools-for-frontend/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'tools-for-frontend-server',
    script: './server/dist/index.js',
    cwd: '/var/www/tools-for-frontend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF