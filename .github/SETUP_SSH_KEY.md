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

### Error: "Error loading key (stdin): error in libcrypto"

This error occurs when the SSH private key format is invalid. Common causes:

1. **Missing BEGIN/END markers**: The key must include the header and footer lines:
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   [key content]
   -----END OPENSSH PRIVATE KEY-----
   ```

2. **Extra whitespace**: When pasting into GitHub Secrets:
   - Don't add extra spaces at the beginning or end
   - Don't add extra line breaks
   - Copy the key exactly as it appears when you run `cat ~/.ssh/your_key`

3. **Wrong key type**: Make sure you're using the **private key** (not the `.pub` public key file)

4. **Encoding issues**: If copying from a terminal:
   - Use `cat` command directly, don't copy from terminal output that might have formatting
   - Avoid copying from text editors that might add hidden characters

**How to fix:**
1. On your local machine, display the key:
   ```bash
   cat ~/.ssh/your_private_key
   ```
2. Copy the **entire output** including BEGIN and END lines
3. In GitHub: Repository → Settings → Secrets and variables → Actions
4. Edit the `DROPLET_SSH_KEY` secret
5. Delete all existing content
6. Paste the key exactly as shown (no modifications)
7. Save the secret
8. Re-run the workflow

**Verify key format locally:**
```bash
# Test if your key is valid
ssh-keygen -l -f ~/.ssh/your_private_key
# Should output: "your_key_name ED25519 ..." or similar (not an error)
```

### Error: "Permission denied (publickey)"

This error means the SSH key is loading correctly, but the **public key is not authorized** on the server. The private key works, but the server doesn't recognize it.

**How to fix:**

1. **Extract the public key from your private key** (on your local machine):
   ```bash
   # If you know which key file you used:
   ssh-keygen -y -f ~/.ssh/your_private_key
   
   # Or if you're not sure, try common key names:
   ssh-keygen -y -f ~/.ssh/id_ed25519
   ssh-keygen -y -f ~/.ssh/id_rsa
   ssh-keygen -y -f ~/.ssh/github_actions_deploy
   ```
   
   This will output something like:
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIyk1l+XAUfnvsEzbPDhFWGbG1SbiHmEnNgi5co6tflZ tom_dempster@hotmail.co.uk
   ```
   
   **Copy this entire line** - you'll paste it in the next step.

2. **Copy the entire public key output** (it should start with `ssh-ed25519` or `ssh-rsa` and be one long line)

3. **Add the public key to your server**. You have a few options:

   **Option A: If you can SSH into the server with password or another key:**
   ```bash
   # SSH into your server
   ssh user@your-droplet
   
   # Once connected to the server, run these commands:
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   
   # Now paste the public key you copied in step 2
   # Replace "YOUR_PUBLIC_KEY_HERE" with the actual key you copied
   # Example: echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIyk1l+XAUfnvsEzbPDhFWGbG1SbiHmEnNgi5co6tflZ tom_dempster@hotmail.co.uk" >> ~/.ssh/authorized_keys
   echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
   
   chmod 600 ~/.ssh/authorized_keys
   exit
   ```
   
   **Example:** If your public key is `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIyk1l+XAUfnvsEzbPDhFWGbG1SbiHmEnNgi5co6tflZ email@example.com`, you would run:
   ```bash
   echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIyk1l+XAUfnvsEzbPDhFWGbG1SbiHmEnNgi5co6tflZ email@example.com" >> ~/.ssh/authorized_keys
   ```
   
   **Option B: If you have the public key file (.pub) on your local machine:**
   ```bash
   # Use ssh-copy-id to automatically add it (you'll need to authenticate with password or another key)
   ssh-copy-id -i ~/.ssh/your_private_key.pub user@your-droplet
   ```
   
   **Option C: Use Digital Ocean web console:**
   - Log into Digital Ocean dashboard
   - Go to your droplet
   - Click "Access" → "Launch Droplet Console"
   - Once in the console, run the commands from Option A above

4. **Verify the public key is on the server**:
   ```bash
   ssh user@your-droplet "cat ~/.ssh/authorized_keys"
   # You should see your public key in the output
   ```

5. **Test the connection**:
   ```bash
   ssh -i ~/.ssh/your_private_key user@your-droplet
   # Should connect without password
   ```

6. **Re-run the GitHub Actions workflow**

**Important:** The public key must match the private key you added to GitHub Secrets. If you used a different private key, you need to add its corresponding public key to the server.

### Connection refused or permission denied (general):
- Verify the public key is in `~/.ssh/authorized_keys` on the droplet
- Check file permissions on the server:
  ```bash
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  ```
- Ensure SSH is enabled on the droplet (port 22 open)
- Verify `DROPLET_USER` and `DROPLET_HOST` secrets are correct

### Key format issues:
- Make sure you're copying the **private key** (not the public key with `.pub` extension)
- Include the BEGIN and END lines
- No extra spaces or line breaks
- When pasting into GitHub Secrets, paste exactly as shown from `cat` command

### Test SSH connection manually:
```bash
ssh -i ~/.ssh/github_actions_deploy user@your-droplet
```

