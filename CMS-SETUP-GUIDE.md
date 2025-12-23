# Content Management System (CMS) Setup Guide

This guide explains how to set up the content management system for your Art By Jen website.

## Overview

The website uses **Decap CMS** (formerly Netlify CMS) with **GitHub backend authentication via an external OAuth proxy**. This provides a user-friendly interface for managing website content without touching code.

## Authentication Method: GitHub OAuth via External Proxy

This site is configured to use **GitHub OAuth authentication through an external OAuth proxy server**. This is necessary because GitHub Pages is a static hosting platform and cannot handle OAuth callbacks directly.

### How It Works

1. **User visits CMS**: Goes to `https://dime73.github.io/ArtByJen/admin/`
2. **Clicks "Login with GitHub"**: Redirected to the OAuth proxy
3. **OAuth proxy handles authentication**: Manages the GitHub OAuth flow
4. **User authenticated**: Returns to CMS with access token
5. **CMS accesses GitHub API**: Makes commits on behalf of the user

### Required OAuth Proxy Setup

**Before the CMS will work**, you must deploy an external OAuth proxy and configure a GitHub OAuth App.

#### Option 1: Use a Hosted OAuth Proxy Service

Several services provide OAuth proxy functionality:
- [decap-oauth-proxy](https://github.com/vencax/netlify-cms-github-oauth-provider) - Popular open-source option
- Deploy to services like Heroku, Render, or Railway
- Or use serverless functions on Vercel/Netlify

#### Option 2: Deploy Your Own OAuth Proxy

See the [OAuth proxy deployment guide](#deploying-an-oauth-proxy) below.

#### Configuring the GitHub OAuth App

1. **Create a GitHub OAuth App**:
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Set:
     - **Application name**: `ArtByJen CMS`
     - **Homepage URL**: `https://dime73.github.io/ArtByJen/`
     - **Authorization callback URL**: `https://YOUR_OAUTH_PROXY_URL/callback`
       - Replace `YOUR_OAUTH_PROXY_URL` with your actual OAuth proxy URL
       - Example: `https://decap-oauth.example.com/callback`
   - Click "Register application"
   - Note the **Client ID** and generate a **Client Secret**

2. **Configure the OAuth Proxy**:
   - Provide the OAuth proxy with:
     - GitHub OAuth **Client ID**
     - GitHub OAuth **Client Secret**
     - Allowed **origin**: `https://dime73.github.io`
   - Each OAuth proxy has different configuration methods (environment variables, config file, etc.)

3. **Update CMS Configuration**:
   - Edit `/admin/config.yml`
   - Replace `https://YOUR_OAUTH_PROXY_URL` with your actual OAuth proxy base URL
   - Example:
     ```yaml
     backend:
       name: github
       repo: Dime73/ArtByJen
       branch: main
       base_url: https://decap-oauth.example.com  # Your OAuth proxy URL
     ```

4. **Commit and Deploy**:
   - Commit the updated `config.yml`
   - GitHub Actions will automatically deploy to GitHub Pages
   - The CMS will now be accessible at: `https://dime73.github.io/ArtByJen/admin/`

## What Can Be Managed?

Content editors can easily update:

✅ **Home Page Hero Section**
- Main title
- Subtitle

✅ **About Section**
- Section title
- All paragraph text

✅ **Contact Information**
- Section title
- Description
- Email address

✅ **Gallery Items**
- Add new artwork
- Edit existing artwork (title, description, medium)
- Upload and change images
- Delete artwork
- Reorder gallery items

## Prerequisites

Before content editors can use the CMS, you must:

1. ✅ **Deploy an OAuth proxy** (see above)
2. ✅ **Create a GitHub OAuth App** (see above)
3. ✅ **Update `admin/config.yml`** with the OAuth proxy URL
4. ✅ **Add users as repository collaborators** (see below)

## Access Control: Repository Collaborators Only

**Important**: Only GitHub users who are collaborators on this repository can use the CMS.

### Adding Content Editors as Collaborators

1. Go to https://github.com/Dime73/ArtByJen/settings/access
2. Click "Add people"
3. Enter the user's GitHub username or email
4. Select "Write" access (or "Maintain" for more permissions)
5. Send the invitation

Once they accept, they can access the CMS at: `https://dime73.github.io/ArtByJen/admin/`

## Deploying an OAuth Proxy

If you need to deploy your own OAuth proxy, here are the steps:

### Using netlify-cms-github-oauth-provider

This is a popular, lightweight OAuth proxy implementation.

**Deploy to Heroku (Example):**

```bash
# Clone the OAuth provider
git clone https://github.com/vencax/netlify-cms-github-oauth-provider
cd netlify-cms-github-oauth-provider

# Create Heroku app
heroku create your-decap-oauth-proxy

# Set environment variables
heroku config:set GIT_HOSTNAME=github.com
heroku config:set OAUTH_CLIENT_ID=your_github_client_id
heroku config:set OAUTH_CLIENT_SECRET=your_github_client_secret
heroku config:set ORIGIN=https://dime73.github.io

# Deploy
git push heroku master
```

Your OAuth proxy will be available at: `https://your-decap-oauth-proxy.herokuapp.com`

**Deploy to Render/Railway/Other:**
- Most platforms support deploying from GitHub
- Fork the `netlify-cms-github-oauth-provider` repository
- Connect it to your hosting platform
- Set the same environment variables as above

### Alternative: Serverless Function

You can also deploy a serverless function that handles OAuth. Examples:
- [Netlify Function](https://github.com/sw-yx/netlify-cms-github-oauth-provider-serverless)
- [Vercel Function](https://github.com/i40west/netlify-cms-github-auth)

Choose based on your preferred platform.

## How It Works (Technical Details)

## How It Works (Technical Details)

1. **Content Storage**: All content is stored in JSON files in the `/content` folder
2. **CMS Interface**: The CMS provides a visual editor at `/admin/`
3. **Authentication**: OAuth proxy handles GitHub authentication
4. **Version Control**: Changes are committed to GitHub automatically
5. **Deployment**: GitHub Pages automatically publishes changes within 1-2 minutes
6. **No Database**: Everything is stored in the repository itself

## GitHub Pages + Base Path

This site is deployed as a **GitHub Project Page**, which means it's accessible at:
- `https://dime73.github.io/ArtByJen/` (note the `/ArtByJen` base path)

The CMS is accessible at:
- `https://dime73.github.io/ArtByJen/admin/`

**Important Notes:**
- The `/admin` folder must be included in the root directory of the repository
- GitHub Actions automatically deploys from the root directory to Pages
- All media files are stored in `/images` with the public path set to `images` (relative paths)
- The base path is automatically handled by the static site structure

## Configuration Summary

Current configuration (`/admin/config.yml`):

```yaml
backend:
  name: github
  repo: Dime73/ArtByJen
  branch: main
  base_url: https://YOUR_OAUTH_PROXY_URL  # Must be configured

site_url: https://dime73.github.io/ArtByJen

media_folder: "images"
public_folder: "images"
```

**Required Changes:**
- Replace `https://YOUR_OAUTH_PROXY_URL` with your actual OAuth proxy URL
- Example: `https://decap-oauth.herokuapp.com`

## Authentication Options (Legacy Information)

### Previously Used: Direct GitHub Authentication

**Note**: This configuration previously used direct GitHub authentication without an OAuth proxy. This only works on platforms that can handle OAuth callbacks (like Netlify). Since we're using GitHub Pages (static hosting), an OAuth proxy is required.

### Option: Open Authoring (Not Recommended for This Setup)

**Open authoring** allows anyone to propose content changes via pull requests. This is NOT recommended when using an OAuth proxy on GitHub Pages because:
- Adds complexity to the authentication flow
- Requires editorial workflow and PR review process
- Better suited for community-driven content sites

To enable (if needed):
```yaml
backend:
  name: github
  repo: Dime73/ArtByJen
  branch: main
  base_url: https://YOUR_OAUTH_PROXY_URL
  open_authoring: true

publish_mode: editorial_workflow
```

**Current Setup**: Open authoring is **disabled** to restrict access to collaborators only.

## User Guide

A comprehensive user guide has been created for your client:
- File: `CMS-USER-GUIDE.md`
- This explains how to use the CMS without technical knowledge

Share this guide with your client after setting up their access.

## Testing the CMS

### Prerequisites Checklist

Before testing, ensure:
- ✅ OAuth proxy is deployed and running
- ✅ GitHub OAuth App is created and configured
- ✅ OAuth proxy has correct Client ID and Client Secret
- ✅ OAuth callback URL in GitHub matches: `https://YOUR_OAUTH_PROXY_URL/callback`
- ✅ `admin/config.yml` has correct `base_url` pointing to OAuth proxy
- ✅ Changes are committed and deployed to GitHub Pages
- ✅ You are a collaborator on the repository

### Testing Steps

1. **Access the CMS**:
   - Go to https://dime73.github.io/ArtByJen/admin/
   - You should see the Decap CMS login screen

2. **Login with GitHub**:
   - Click **"Login with GitHub"**
   - You'll be redirected to your OAuth proxy
   - The OAuth proxy will redirect you to GitHub for authorization
   - Authorize the application
   - You'll be redirected back to the CMS

3. **Verify Access**:
   - If login succeeds, you should see the CMS dashboard
   - You should see collections: "Site Settings" and "Gallery Items"

4. **Test Content Editing**:
   - Click on "Site Settings" → "Home Page Hero"
   - Make a small change to the title
   - Click **"Publish"**
   - Changes are saved and committed immediately

5. **Verify Changes**:
   - Wait 1-2 minutes for GitHub Pages to rebuild
   - Go to https://github.com/Dime73/ArtByJen/commits/main
   - You should see your commit
   - Go to https://dime73.github.io/ArtByJen/
   - You should see your changes reflected on the live site

6. **Test Gallery Management**:
   - Try adding a new gallery item
   - Upload an image
   - Publish the change
   - Verify it appears on the website

## File Structure

```
ArtByJen/
├── admin/
│   ├── index.html          # CMS interface
│   └── config.yml          # CMS configuration
├── content/
│   ├── hero.json           # Home page hero content
│   ├── about.json          # About section content
│   ├── contact.json        # Contact information
│   ├── gallery-index.json  # Index of all gallery items (must be updated when adding/removing items)
│   └── gallery/            # Gallery items
│       ├── abstract-dreams.json
│       ├── mountain-serenity.json
│       └── ...
├── content-loader.js       # Loads JSON content into the website
├── index.html              # Main website (now dynamic)
└── CMS-USER-GUIDE.md       # User guide for your client
```

## Gallery Index Management

**Important**: The gallery uses an index file (`content/gallery-index.json`) to discover which gallery items to display. This is a two-step process:

1. **Adding a Gallery Item**:
   - Create the gallery item in the CMS (Gallery Items → New Gallery Item)
   - Update the Gallery Index (Site Settings → Gallery Index) to include the new filename
   - Both must be published for the item to appear on the website

2. **Removing a Gallery Item**:
   - Delete the gallery item in the CMS
   - Update the Gallery Index to remove the filename
   - Both must be published for the item to disappear from the website

This approach ensures:
- No hardcoded filenames in the JavaScript
- All gallery items with any filename can be discovered
- The website only displays items explicitly listed in the index
- No unnecessary 404 requests for non-existent files

## Troubleshooting

### "Login Failed" or Authentication Issues

**Symptom**: Cannot login to CMS, stuck at login screen, or "Authentication error"

**Possible Causes & Solutions**:

1. **OAuth Proxy Not Configured**:
   - Verify the OAuth proxy is running and accessible
   - Test by visiting `https://YOUR_OAUTH_PROXY_URL` in browser
   - Check OAuth proxy logs for errors

2. **Incorrect `base_url` in config.yml**:
   - Verify `admin/config.yml` has the correct OAuth proxy URL
   - Should be: `base_url: https://YOUR_OAUTH_PROXY_URL` (no trailing slash)
   - Commit and redeploy if changed

3. **GitHub OAuth App Misconfigured**:
   - Verify callback URL is: `https://YOUR_OAUTH_PROXY_URL/callback`
   - Verify homepage URL is: `https://dime73.github.io/ArtByJen/`
   - Verify Client ID and Secret are correctly set in OAuth proxy

4. **CORS Issues**:
   - Verify OAuth proxy allows origin: `https://dime73.github.io`
   - Check browser console for CORS errors
   - OAuth proxy must include proper CORS headers

5. **User Not a Collaborator**:
   - Verify user is added as a repository collaborator
   - User must have accepted the collaboration invitation
   - User must have "Write" or higher access level

6. **Browser Issues**:
   - Try logging out of GitHub and back in
   - Clear browser cache and cookies
   - Try incognito/private browsing mode
   - Try a different browser

### OAuth Proxy Returning Errors

**Check OAuth Proxy Logs**: Most OAuth proxies log authentication attempts. Common errors:

- **"Invalid client"**: Client ID doesn't match GitHub OAuth App
- **"Invalid secret"**: Client Secret is incorrect
- **"Redirect URI mismatch"**: Callback URL doesn't match GitHub OAuth App settings

### Changes Not Appearing on Website

1. **Check GitHub Actions**:
   - Go to https://github.com/Dime73/ArtByJen/actions
   - Ensure deployment workflow succeeded
   - If failed, check error logs

2. **Wait for Pages to Rebuild**:
   - GitHub Pages can take 2-5 minutes to rebuild
   - Check deployment status in repository Settings → Pages

3. **Hard Refresh Browser**:
   - Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - This clears cached resources

4. **Verify Commit**:
   - Go to https://github.com/Dime73/ArtByJen/commits/main
   - Ensure your change was committed
   - Click on the commit to see the diff

### Images Not Loading

1. Verify images are in the `/images` folder
2. Check that file paths in JSON are correct
3. Ensure images are web-friendly formats (JPG, PNG, SVG)
4. Check file sizes aren't too large (keep under 2MB)

## Maintenance

### Backup

All content is automatically backed up in Git. To create a manual backup:

```bash
git clone https://github.com/Dime73/ArtByJen.git backup-$(date +%Y%m%d)
```

### Restore Previous Version

All changes are tracked in Git history:

1. Go to https://github.com/Dime73/ArtByJen/commits/main
2. Find the commit before the unwanted change
3. Click on the file that was changed
4. Click "History" → find the good version
5. Copy the content or revert the commit

## Future Enhancements

Possible additions for later:

- **Image Optimization**: Automatically compress uploaded images
- **Preview Mode**: Preview changes before publishing
- **Draft System**: Save drafts without publishing
- **Multiple Users**: Editorial workflow with approval process
- **Custom Collections**: Add blog posts, exhibitions, or testimonials

## Support

For technical issues with the CMS:
- Decap CMS Documentation: https://decapcms.org/docs/
- GitHub Issues: https://github.com/decaporg/decap-cms/issues

For website-specific issues:
- Contact the developer who set this up
- Check the repository's Issues tab
