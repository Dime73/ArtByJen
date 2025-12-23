# ArtByJen

A minimalist art portfolio website with Scandinavian design aesthetics and an easy-to-use Content Management System (CMS).

## Live Website

This portfolio is hosted on GitHub Pages: [https://dime73.github.io/ArtByJen/](https://dime73.github.io/ArtByJen/)

## Content Management

**✨ New!** This website now includes a user-friendly CMS that allows non-technical users to update content and images without touching code!

### For Content Editors (Non-Technical Users)

📖 **[Read the User Guide](CMS-USER-GUIDE.md)** - Step-by-step instructions for updating your website

**Quick Access:**
- CMS Login: [https://dime73.github.io/ArtByJen/admin/](https://dime73.github.io/ArtByJen/admin/)
- Login with your GitHub account
- Update text, images, and gallery items easily!

### For Developers/Administrators

📖 **[Read the Setup Guide](CMS-SETUP-GUIDE.md)** - Technical documentation for CMS configuration

**What can be managed:**
- Home page hero section (title, subtitle)
- About section (all text content)
- Contact information (email, description)
- Gallery items (add, edit, delete, reorder)
- All images

## Features

- Clean, minimal Scandinavian design
- Responsive layout for all devices
- Simple navigation
- Gallery showcase with placeholder artwork
- About section
- Contact information
- **Content Management System (CMS)** for easy updates
- Dynamic content loading from JSON files

## Design Philosophy

The design follows Scandinavian minimalism principles:
- Muted, neutral color palette
- Generous white space
- Simple typography
- Clean lines and borders
- Subtle hover effects

## Deployment

This site can be deployed to multiple platforms:

### GitHub Pages (Current)

This site is configured to automatically deploy to GitHub Pages using GitHub Actions.

#### Enabling GitHub Pages (One-time setup)

To enable automatic deployment, you need to configure GitHub Pages in your repository settings:

1. Go to your repository on GitHub: https://github.com/Dime73/ArtByJen
2. Click on **Settings** tab
3. In the left sidebar, click on **Pages**
4. Under **Build and deployment**:
   - Set **Source** to "GitHub Actions"
5. Save the settings

Once configured, the workflow will automatically deploy the site to GitHub Pages whenever you push to the `main` branch.

The site will be available at: https://dime73.github.io/ArtByJen/

#### Manual Deployment

You can also manually trigger a deployment by going to the Actions tab and running the "Deploy to GitHub Pages" workflow.

### Netlify

This site is also ready to deploy on Netlify with zero configuration needed!

📖 **[Read the Netlify Deployment Guide](NETLIFY-DEPLOYMENT.md)** - Complete instructions for deploying to Netlify

**Quick start:**
1. Log in to [Netlify](https://app.netlify.com)
2. Import this repository
3. Deploy! (Settings are auto-detected from `netlify.toml`)

**Benefits of Netlify:**
- Automatic HTTPS
- Global CDN
- Instant cache invalidation
- Deploy previews for pull requests
- Easy custom domain setup

## Local Development

To view the website locally:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

