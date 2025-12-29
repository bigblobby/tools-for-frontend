# Setting Up SSH Key for GitHub Actions Deployment

## Option 1: Use Your Existing SSH Key

If you already SSH into your Digital Ocean droplet, you can use your existing private key:

1. **Find your private key** (usually one of these):
   ```bash
   # Check if you have an SSH key
   ls -la ~/.ssh/
   
   # Common key files:
   # - id_rsa (RSA key)
   # - id_ed25519 (Ed25519 key - recommended)
   # - id_ecdsa (ECDSA key)
   ```

2. **Copy the private key content**:
   ```bash
   # For RSA key:
   cat ~/.ssh/id_rsa
   
   # For Ed25519 key (recommended):
   cat ~/.ssh/id_ed25519
   ```

3. **Copy the entire output** (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

4. **Add to GitHub Secrets**:
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `DROPLET_SSH_KEY`
   - Value: Paste the entire private key content
   - Click "Add secret"

5. **Ensure your public key is on the droplet**:
   ```bash
   # Check if your public key is in authorized_keys on the server
   ssh user@your-droplet "cat ~/.ssh/authorized_keys"
   
   # If not, add it:
   ssh-copy-id user@your-droplet
   # Or manually:
   cat ~/.ssh/id_rsa.pub | ssh user@your-droplet "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
   ```

## Option 2: Generate a New SSH Key (Recommended for CI/CD)

It's best practice to use a dedicated SSH key for CI/CD:

1. **Generate a new SSH key pair**:
   ```bash
   # Generate Ed25519 key (recommended, more secure and faster)
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
   
   # Or if Ed25519 is not available, use RSA:
   ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
   ```

2. **Add the public key to your droplet**:
   ```bash
   # Copy public key to droplet
   ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-droplet
   
   # Or manually:
   cat ~/.ssh/github_actions_deploy.pub | ssh user@your-droplet "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
   ```

3. **Test the connection**:
   ```bash
   ssh -i ~/.ssh/github_actions_deploy user@your-droplet
   ```

4. **Copy the private key content**:
   ```bash
   cat ~/.ssh/github_actions_deploy
   ```

5. **Add to GitHub Secrets**:
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `DROPLET_SSH_KEY`
   - Value: Paste the entire private key content (including BEGIN/END lines)
   - Click "Add secret"

## Important Notes

- **Never share your private key** - it should only be in:
  - Your local `~/.ssh/` directory (with permissions 600)
  - GitHub Secrets (encrypted)
  
- **The private key should start with**:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  ```
  or
  ```
  -----BEGIN RSA PRIVATE KEY-----
  ```

- **The private key should end with**:
  ```
  -----END OPENSSH PRIVATE KEY-----
  ```
  or
  ```
  -----END RSA PRIVATE KEY-----
  ```

- **Set correct permissions** on your local key file:
  ```bash
  chmod 600 ~/.ssh/github_actions_deploy
  ```

## Troubleshooting

**Connection refused or permission denied:**
- Verify the public key is in `~/.ssh/authorized_keys` on the droplet
- Check file permissions: `chmod 600 ~/.ssh/authorized_keys` on the droplet
- Ensure SSH is enabled on the droplet (port 22 open)

**Key format issues:**
- Make sure you're copying the **private key** (not the public key with `.pub` extension)
- Include the BEGIN and END lines
- No extra spaces or line breaks

**Test SSH connection manually:**
```bash
ssh -i ~/.ssh/github_actions_deploy user@your-droplet
```

