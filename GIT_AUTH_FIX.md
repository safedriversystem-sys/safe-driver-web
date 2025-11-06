# Git Authentication Fix for University Cluster Repository

## Problem
Git was using cached credentials from your personal GitHub account (`pulindupixzarloop`) instead of your university cluster account credentials.

## Solution Applied
1. ✅ Removed cached GitHub credentials from Windows Credential Manager
2. ✅ Configured Git to use Windows Credential Manager Core for better credential handling

## Next Steps: Create and Use a Personal Access Token (PAT)

### Step 1: Create a Personal Access Token (PAT)

1. **Log in to GitHub with your university cluster account** (the one that has access to `safe-driver-cluster/safe-driver-web`)

2. Go to GitHub Settings:
   - Click your profile picture → **Settings**
   - Or go directly to: https://github.com/settings/tokens

3. Create a new token:
   - Click **Developer settings** (left sidebar)
   - Click **Personal access tokens** → **Tokens (classic)**
   - Click **Generate new token** → **Generate new token (classic)**

4. Configure the token:
   - **Note**: Give it a descriptive name like "University Cluster Repo Access"
   - **Expiration**: Choose an appropriate expiration (90 days, 1 year, or no expiration)
   - **Scopes**: Select at minimum:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (if you need to update GitHub Actions)

5. **Generate token** and **COPY IT IMMEDIATELY** (you won't see it again!)

### Step 2: Use the PAT to Push

When you push, Git will prompt for credentials:

```bash
git push origin dev_pulindu
```

**When prompted:**
- **Username**: Enter your university cluster GitHub username (NOT `pulindupixzarloop`)
- **Password**: Paste your Personal Access Token (NOT your GitHub password)

The credentials will be saved in Windows Credential Manager for future use.

### Alternative: Update Remote URL with Username

If you know your university cluster GitHub username, you can update the remote URL:

```bash
git remote set-url origin https://YOUR_UNIVERSITY_USERNAME@github.com/safe-driver-cluster/safe-driver-web.git
```

Then when you push, you'll only be prompted for the password (PAT).

### Alternative: Use SSH Instead of HTTPS

If you prefer SSH authentication:

1. **Generate SSH key** (if you don't have one for this account):
   ```bash
   ssh-keygen -t ed25519 -C "your-university-email@example.com" -f ~/.ssh/id_ed25519_university
   ```

2. **Add SSH key to GitHub**:
   - Copy the public key: `cat ~/.ssh/id_ed25519_university.pub`
   - Go to GitHub Settings → SSH and GPG keys → New SSH key
   - Paste the key and save

3. **Configure SSH** (create/edit `~/.ssh/config`):
   ```
   Host github-university
       HostName github.com
       User git
       IdentityFile ~/.ssh/id_ed25519_university
   ```

4. **Update remote URL**:
   ```bash
   git remote set-url origin git@github-university:safe-driver-cluster/safe-driver-web.git
   ```

## Verify the Fix

After setting up authentication, test it:

```bash
git push origin dev_pulindu
```

If successful, you should see your commits being pushed without any 403 errors.

## Troubleshooting

### Still getting 403 error?
1. Make sure you're using the correct GitHub account's PAT
2. Verify the PAT has `repo` scope enabled
3. Check if the PAT has expired
4. Clear credentials again: `cmdkey /delete:"LegacyGeneric:target=git:https://github.com"`

### Multiple GitHub Accounts?
Consider using Git Credential Manager or SSH with different keys for different accounts.

