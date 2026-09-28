# ArtByJen

A modern, gallery-led art portfolio with a browser-based studio editor. The three artworks currently shown are generated samples and should be replaced with Jen's own work before presenting the gallery as her portfolio.

## Live Website

This portfolio is hosted on GitHub Pages: [https://dime73.github.io/ArtByJen/](https://dime73.github.io/ArtByJen/)

## Content management

Open the [studio editor](https://dime73.github.io/ArtByJen/admin/) to update the home page, about and contact sections, and gallery artwork and images. The editor uses a fine-grained GitHub token with **Contents: Read and write** access to this repository. It saves changes directly to `main`, which triggers the GitHub Pages deployment. See the [editor guide](CMS-USER-GUIDE.md) for first-time access and the [setup guide](CMS-SETUP-GUIDE.md) for technical details.

## Features

- Editorial typography and an art-first layout
- Responsive layout for all devices
- Simple navigation
- Gallery showcase with clearly labeled sample artwork
- About section
- Contact information
- Studio editor for content and artwork
- Dynamic content loading from JSON files

## Design Philosophy

The design uses oversized editorial typography, generous space, a cobalt accent, and an asymmetric gallery. Artwork and text remain editable through the studio editor.

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
