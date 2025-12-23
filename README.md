# ArtByJen

A minimalist art portfolio website with Scandinavian design aesthetics.

## Live Website

This portfolio is hosted on GitHub Pages: [https://dime73.github.io/ArtByJen/](https://dime73.github.io/ArtByJen/)

## Features

- Clean, minimal Scandinavian design
- Responsive layout for all devices
- Simple navigation
- Gallery showcase with placeholder artwork
- About section
- Contact information

## Design Philosophy

The design follows Scandinavian minimalism principles:
- Muted, neutral color palette
- Generous white space
- Simple typography
- Clean lines and borders
- Subtle hover effects

## Deployment

This site is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Enabling GitHub Pages (One-time setup)

To enable automatic deployment, you need to configure GitHub Pages in your repository settings:

1. Go to your repository on GitHub: https://github.com/Dime73/ArtByJen
2. Click on **Settings** tab
3. In the left sidebar, click on **Pages**
4. Under **Build and deployment**:
   - Set **Source** to "GitHub Actions"
5. Save the settings

Once configured, the workflow will automatically deploy the site to GitHub Pages whenever you push to the `main` branch.

The site will be available at: https://dime73.github.io/ArtByJen/

### Manual Deployment

You can also manually trigger a deployment by going to the Actions tab and running the "Deploy to GitHub Pages" workflow.

## Local Development

To view the website locally:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

