# Content Management System (CMS) Setup Guide

This guide explains how to set up the content management system for your Art By Jen website.

## Overview

The website now includes **Decap CMS** (formerly Netlify CMS), which provides a user-friendly interface for managing website content without touching code.

## What Can Be Managed?

Your client can now easily update:

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

## Quick Start (For Repository Collaborators)

The CMS is already configured and ready to use! Your client just needs:

1. **GitHub Account**: They need a GitHub account
2. **Repository Access**: You need to add them as a collaborator to this repository
3. **Access the CMS**: Go to https://dime73.github.io/ArtByJen/admin/

### Adding Your Client as a Collaborator

1. Go to https://github.com/Dime73/ArtByJen/settings/access
2. Click "Add people"
3. Enter your client's GitHub username or email
4. Select "Write" access (or "Maintain" for more permissions)
5. Send the invitation

Once they accept, they can immediately start using the CMS!

## How It Works

1. **Content Storage**: All content is stored in JSON files in the `/content` folder
2. **CMS Interface**: The CMS provides a visual editor at `/admin/`
3. **Version Control**: Changes are committed to GitHub automatically
4. **Deployment**: GitHub Pages automatically publishes changes within 1-2 minutes
5. **No Database**: Everything is stored in the repository itself

## Authentication Options

### Option 1: GitHub Collaborator Access (Current Setup - Recommended)

**Pros:**
- ✅ No additional setup required
- ✅ Works immediately
- ✅ Free
- ✅ Simple for repository collaborators

**Cons:**
- ❌ Client needs a GitHub account
- ❌ You need to add them as a repository collaborator

**Current Status:** This configuration restricts CMS access to repository collaborators only. 
- Only users added as collaborators can use the CMS
- Changes are published immediately (no draft workflow)
- Collaborators must have write access to the repository

### Option 2: Open Authoring (Allow Anyone to Contribute)

**Note:** This option was previously enabled but has been disabled to restrict access to collaborators only.

If you want to allow **anyone** (not just collaborators) to propose content changes via pull requests:

**Configuration:**
```yaml
backend:
  name: github
  repo: Dime73/ArtByJen
  branch: main
  open_authoring: true

publish_mode: editorial_workflow
```

**How it works:**
- Any GitHub user can fork the repository and propose changes
- Non-collaborators' changes go through a draft/PR workflow
- Only maintainers can merge PRs and publish changes
- Useful for community-driven content or accepting guest contributions

**Trade-offs:**
- ✅ Allows broader contributions without granting repository access
- ❌ Requires reviewing all external contributions
- ❌ More complex workflow for content updates

### Option 3: GitHub OAuth App (Advanced)

For a more professional setup that doesn't require repository access:

**Pros:**
- ✅ Can grant CMS access without repository access
- ✅ More granular permissions
- ✅ Professional authentication flow

**Cons:**
- ❌ Requires OAuth app setup
- ❌ More complex configuration

**Setup Instructions (if needed later):**

1. **Create a GitHub OAuth App**:
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Set:
     - Application name: "ArtByJen CMS"
     - Homepage URL: `https://dime73.github.io/ArtByJen/`
     - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Note the Client ID and Client Secret

2. **Use a Backend Service**:
   - Deploy an authentication backend (e.g., using Netlify, Vercel, or a simple serverless function)
   - Or use a service like https://github.com/vencax/netlify-cms-github-oauth-provider

3. **Update CMS Config**:
   ```yaml
   backend:
     name: github
     repo: Dime73/ArtByJen
     branch: main
     base_url: https://your-auth-backend.com
   ```

## User Guide

A comprehensive user guide has been created for your client:
- File: `CMS-USER-GUIDE.md`
- This explains how to use the CMS without technical knowledge

Share this guide with your client after setting up their access.

## Testing the CMS

1. Go to https://dime73.github.io/ArtByJen/admin/
2. Login with your GitHub account (must be a repository collaborator)
3. Try editing the "Home Page Hero" section
4. Make a small change
5. Click **"Publish"** - changes are saved and committed immediately
6. Wait 1-2 minutes for GitHub Pages to rebuild
7. Check https://dime73.github.io/ArtByJen/ to see your changes

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

1. Verify the user is added as a repository collaborator
2. Make sure they have accepted the collaboration invitation
3. Try logging out of GitHub and back in
4. Clear browser cache

### Changes Not Appearing on Website

1. Check GitHub Actions to ensure deployment succeeded
2. Wait 2-3 minutes for GitHub Pages to update
3. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check the repository for the commits

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
