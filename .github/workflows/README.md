# GitHub Actions Workflows

This directory contains CI/CD workflows for building and deploying the application.

## Workflows

### build-and-push.yml

Builds Docker images for both `backend` and `caddy` services and pushes them to GitHub Container Registry (ghcr.io).

**Triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master`
- Manual trigger via workflow_dispatch

**What it does:**
- Builds backend image from `./server/Dockerfile`
- Builds caddy image from `./caddy/Dockerfile`
- Pushes images to `ghcr.io/<repo>/backend` and `ghcr.io/<repo>/caddy`
- Tags images with branch name, SHA, and `latest` (for default branch)

### deploy.yml

Deploys the built images to your Digital Ocean droplet.

**Triggers:**
- Automatically after successful `build-and-push` workflow completes
- Manual trigger via workflow_dispatch (allows specifying image tag)

**Required Secrets:**
- `DROPLET_HOST`: Your Digital Ocean droplet IP or hostname
- `DROPLET_USER`: SSH username (usually `root`)
- `DROPLET_SSH_KEY`: Private SSH key for accessing the droplet

**What it does:**
- SSH into your droplet
- Logs into GitHub Container Registry
- Pulls latest images
- Restarts containers using docker-compose

## Setup Instructions

1. **Add GitHub Secrets:**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add `DROPLET_HOST` (e.g., `123.45.67.89` or `yourdomain.com`)
   - Add `DROPLET_USER` (e.g., `root`)
   - Add `DROPLET_SSH_KEY` (your private SSH key content)

2. **Configure Image Registry on Server:**
   - Create `.env` file in project root on your server:
     ```env
     IMAGE_REPO=your-username/dev-tools
     ```
   - Replace `your-username/dev-tools` with your actual GitHub username and repository name (e.g., `tomdempster/dev-tools`)

3. **First Deployment:**
   - Push to `main` branch or manually trigger `build-and-push` workflow
   - After build completes, `deploy` workflow will run automatically
   - Or manually trigger `deploy` workflow

## Troubleshooting

**Build fails:**
- Check GitHub Actions logs for specific errors
- Ensure Dockerfile syntax is correct
- Check if dependencies are properly specified

**Deployment fails:**
- Verify SSH key is correct and has access to the droplet
- Check that Docker is installed on the server
- Ensure project directory exists on the server
- Verify IMAGE_REPO matches your GitHub repository path

**Images not found:**
- Ensure images were successfully built and pushed
- Check that IMAGE_REPO in `.env` matches the repository name
- Verify you're logged into ghcr.io on the server

