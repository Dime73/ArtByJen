# Deploying to Netlify

This guide explains how to deploy the ArtByJen portfolio to Netlify.

## Prerequisites

- A Netlify account (free tier is sufficient)
- Access to this GitHub repository

## Deployment Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Log in to Netlify**
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Sign in with your GitHub account

2. **Import from GitHub**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account
   - Select the `Dime73/ArtByJen` repository

3. **Configure build settings**
   - The settings should be automatically detected from `netlify.toml`
   - **Branch to deploy**: `main`
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (current directory)
   - Click "Deploy site"

4. **Wait for deployment**
   - Netlify will build and deploy your site
   - You'll get a temporary URL like `random-name-123.netlify.app`

5. **Configure custom domain (Optional)**
   - Go to "Site settings" → "Domain management"
   - Click "Add custom domain"
   - Follow the instructions to set up your custom domain

### Option 2: Deploy with Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and deploy**
   ```bash
   cd /path/to/ArtByJen
   netlify init
   netlify deploy --prod
   ```

## Studio editor

The studio editor also works when the site is hosted on Netlify. Open `https://your-site.netlify.app/admin/` and enter a fine-grained GitHub token for `Dime73/ArtByJen` with **Contents: Read and write**. The GitHub account must have write access to the repository. See the [editor guide](CMS-USER-GUIDE.md).

## Configuration Details

The `netlify.toml` file includes:

- **Static site deployment**: No build process, publishes directly from the root directory
- **Security headers**: Adds important security headers to all pages
- **Cache optimization**: Long-term caching for static assets (CSS, JS, images)
- **Future-ready**: Configured to handle Netlify forms if needed

## Continuous Deployment

Once connected to GitHub:
- Every push to the `main` branch will automatically deploy to Netlify
- You can view deployment status in the Netlify dashboard
- Failed deployments will show error logs

## Troubleshooting

### Editor access issues
- Ensure you have collaborator access to the GitHub repository
- Check that the token selects this repository and has **Contents: Read and write**
- Check whether the token has expired or been revoked

### Deployment Failures
- Check the Netlify deploy logs for specific errors
- Verify all required files are committed to the repository
- Ensure `netlify.toml` is in the root directory

### Site Not Updating
- Check if the deployment succeeded in Netlify dashboard
- Clear your browser cache
- Wait a few minutes for CDN propagation

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Editor guide](CMS-USER-GUIDE.md)
- [GitHub Repository](https://github.com/Dime73/ArtByJen)
