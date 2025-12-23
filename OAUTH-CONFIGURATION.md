# OAuth Proxy Configuration Quick Reference

This document provides the exact values and placeholders you need to configure the Decap CMS OAuth proxy for the ArtByJen website.

## Required Values Overview

| Component | Value/Placeholder |
|-----------|------------------|
| **Repository** | `Dime73/ArtByJen` |
| **Branch** | `main` |
| **Site URL** | `https://dime73.github.io/ArtByJen/` |
| **CMS Admin URL** | `https://dime73.github.io/ArtByJen/admin/` |
| **Base Path** | `/ArtByJen` |
| **OAuth Proxy URL** | `https://YOUR_OAUTH_PROXY_URL` ⚠️ **MUST REPLACE** |

## Step-by-Step Configuration

### Step 1: Deploy OAuth Proxy

**Choose a deployment option:**
- Heroku: https://www.heroku.com/
- Render: https://render.com/
- Railway: https://railway.app/
- Vercel/Netlify serverless functions

**Recommended OAuth Proxy:**
Repository: https://github.com/vencax/netlify-cms-github-oauth-provider

**After deployment, note your OAuth proxy URL:**
- Example: `https://your-app-name.herokuapp.com`
- Example: `https://your-app-name.onrender.com`
- ⚠️ **This will replace `https://YOUR_OAUTH_PROXY_URL`**

### Step 2: Create GitHub OAuth App

**Navigate to:** https://github.com/settings/developers

**Click:** "New OAuth App"

**Fill in these exact values:**

| Field | Value |
|-------|-------|
| **Application name** | `ArtByJen CMS` (or your preferred name) |
| **Homepage URL** | `https://dime73.github.io/ArtByJen/` |
| **Application description** | `CMS authentication for ArtByJen portfolio` (optional) |
| **Authorization callback URL** | `https://YOUR_OAUTH_PROXY_URL/callback` ⚠️ Replace with actual URL |

**Example callback URL (after replacement):**
- If OAuth proxy is `https://artbyjen-oauth.herokuapp.com`
- Then callback URL is `https://artbyjen-oauth.herokuapp.com/callback`

**After creation:**
- ✅ Save the **Client ID**
- ✅ Generate and save the **Client Secret**
- ⚠️ Keep these values secure!

### Step 3: Configure OAuth Proxy Environment Variables

Set these environment variables in your OAuth proxy deployment:

| Variable | Value |
|----------|-------|
| `OAUTH_CLIENT_ID` | Your GitHub OAuth App Client ID |
| `OAUTH_CLIENT_SECRET` | Your GitHub OAuth App Client Secret |
| `ORIGIN` | `https://dime73.github.io` |
| `GIT_HOSTNAME` | `github.com` |

**Example for Heroku:**
```bash
heroku config:set OAUTH_CLIENT_ID=your_client_id_here
heroku config:set OAUTH_CLIENT_SECRET=your_client_secret_here
heroku config:set ORIGIN=https://dime73.github.io
heroku config:set GIT_HOSTNAME=github.com
```

**Example for Render/Railway:**
Use the environment variables section in the web dashboard.

### Step 4: Update CMS Configuration

**Edit file:** `admin/config.yml`

**Find this line:**
```yaml
base_url: https://YOUR_OAUTH_PROXY_URL  # Replace with your OAuth proxy URL (e.g., https://decap-oauth.example.com)
```

**Replace with your actual OAuth proxy URL:**
```yaml
base_url: https://artbyjen-oauth.herokuapp.com  # Example - use your actual URL
```

**Full backend section should look like:**
```yaml
backend:
  name: github
  repo: Dime73/ArtByJen
  branch: main
  base_url: https://artbyjen-oauth.herokuapp.com  # Your actual OAuth proxy URL
  # GitHub OAuth authentication via external proxy
  # Users authenticate with their GitHub account
  # For repository collaborators only
```

**Commit and push the change:**
```bash
git add admin/config.yml
git commit -m "Configure OAuth proxy URL"
git push origin main
```

### Step 5: Add Content Editors

**Navigate to:** https://github.com/Dime73/ArtByJen/settings/access

**Click:** "Add people"

**For each content editor:**
1. Enter their GitHub username or email
2. Select access level: **Write** (or Maintain/Admin)
3. Send invitation
4. Wait for them to accept

### Step 6: Test the Configuration

**Use the verification checklist:** `VERIFICATION-CHECKLIST.md`

**Quick test:**
1. Go to: https://dime73.github.io/ArtByJen/admin/
2. Click "Login with GitHub"
3. Should redirect through OAuth proxy
4. Should authenticate with GitHub
5. Should return to CMS dashboard
6. Should see content collections

## Configuration Summary

### Before (with placeholders):
```yaml
backend:
  name: github
  repo: Dime73/ArtByJen
  branch: main
  base_url: https://YOUR_OAUTH_PROXY_URL  # ⚠️ Placeholder

site_url: https://dime73.github.io/ArtByJen
```

### After (with actual values):
```yaml
backend:
  name: github
  repo: Dime73/ArtByJen
  branch: main
  base_url: https://artbyjen-oauth.herokuapp.com  # ✅ Actual OAuth proxy URL

site_url: https://dime73.github.io/ArtByJen
```

## Troubleshooting Quick Reference

### Login fails or shows "Authentication error"
- ✅ Verify OAuth proxy is running and accessible
- ✅ Verify `base_url` in `admin/config.yml` matches your OAuth proxy URL exactly
- ✅ Verify GitHub OAuth App callback URL is `https://YOUR_OAUTH_PROXY_URL/callback`
- ✅ Verify OAuth proxy environment variables are set correctly

### "Access denied" or "Forbidden" errors
- ✅ Verify user is a repository collaborator
- ✅ Verify user has "Write" access or higher
- ✅ Verify user has accepted the collaboration invitation

### Changes don't appear on the site
- ✅ Wait 2-5 minutes for GitHub Pages to rebuild
- ✅ Check GitHub Actions for deployment status
- ✅ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- ✅ Verify commit was made to the repository

## URLs Reference Card

Save this for quick reference:

| Purpose | URL |
|---------|-----|
| **Live Site** | https://dime73.github.io/ArtByJen/ |
| **CMS Login** | https://dime73.github.io/ArtByJen/admin/ |
| **GitHub Repo** | https://github.com/Dime73/ArtByJen |
| **GitHub Commits** | https://github.com/Dime73/ArtByJen/commits/main |
| **GitHub Actions** | https://github.com/Dime73/ArtByJen/actions |
| **Collaborators** | https://github.com/Dime73/ArtByJen/settings/access |
| **GitHub OAuth Apps** | https://github.com/settings/developers |
| **OAuth Proxy** | `https://YOUR_OAUTH_PROXY_URL` (your deployment) |

## Security Notes

⚠️ **Keep these values SECRET:**
- GitHub OAuth App Client Secret
- OAuth proxy environment variables

✅ **Public/safe values:**
- Client ID (public)
- OAuth proxy URL (public)
- Repository name (public)
- Site URL (public)

## Need Help?

Refer to these documentation files:
- **README.md** - Quick overview
- **CMS-SETUP-GUIDE.md** - Comprehensive setup guide
- **VERIFICATION-CHECKLIST.md** - Testing and troubleshooting
- **REFACTOR-SUMMARY.md** - Technical change details
- **CMS-USER-GUIDE.md** - For content editors
