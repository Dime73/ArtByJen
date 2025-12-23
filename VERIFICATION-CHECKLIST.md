# Decap CMS OAuth Proxy Verification Checklist

This checklist helps you verify that the Decap CMS with GitHub OAuth proxy is properly configured and working.

## Prerequisites

Before testing, ensure all setup steps are complete:

### 1. OAuth Proxy Deployment
- [ ] OAuth proxy is deployed and running
- [ ] OAuth proxy URL is accessible (e.g., `https://your-oauth-proxy.herokuapp.com`)
- [ ] OAuth proxy health check passes (if available)

### 2. GitHub OAuth App Configuration
- [ ] GitHub OAuth App is created at https://github.com/settings/developers
- [ ] Application name is set (e.g., "ArtByJen CMS")
- [ ] Homepage URL is set to: `https://dime73.github.io/ArtByJen/`
- [ ] Authorization callback URL is set to: `https://YOUR_OAUTH_PROXY_URL/callback`
  - Replace `YOUR_OAUTH_PROXY_URL` with actual URL
- [ ] Client ID is noted/saved
- [ ] Client Secret is generated and noted/saved

### 3. OAuth Proxy Configuration
- [ ] OAuth proxy has `OAUTH_CLIENT_ID` environment variable set
- [ ] OAuth proxy has `OAUTH_CLIENT_SECRET` environment variable set
- [ ] OAuth proxy has `ORIGIN` set to: `https://dime73.github.io`
- [ ] OAuth proxy has `GIT_HOSTNAME` set to: `github.com`
- [ ] OAuth proxy is restarted after configuration changes (if needed)

### 4. CMS Configuration
- [ ] `admin/config.yml` has `base_url` set to your OAuth proxy URL
- [ ] `admin/config.yml` has correct `repo: Dime73/ArtByJen`
- [ ] `admin/config.yml` has correct `branch: main`
- [ ] `admin/config.yml` has `site_url: https://dime73.github.io/ArtByJen`
- [ ] Changes to `admin/config.yml` are committed to repository
- [ ] Changes are pushed to GitHub

### 5. GitHub Pages Deployment
- [ ] GitHub Pages is enabled in repository settings
- [ ] GitHub Pages source is set to "GitHub Actions"
- [ ] Latest GitHub Actions workflow has completed successfully
- [ ] Site is accessible at: https://dime73.github.io/ArtByJen/
- [ ] Admin page is accessible at: https://dime73.github.io/ArtByJen/admin/

### 6. User Access
- [ ] Test user has a GitHub account
- [ ] Test user is added as a collaborator to the repository
- [ ] Test user has "Write" or higher access level
- [ ] Test user has accepted the collaboration invitation

## Testing the CMS

### Phase 1: Access the CMS
- [ ] Navigate to https://dime73.github.io/ArtByJen/admin/
- [ ] CMS login page loads without errors
- [ ] "Login with GitHub" button is visible
- [ ] Browser console shows no JavaScript errors

### Phase 2: Authentication Flow
- [ ] Click "Login with GitHub" button
- [ ] Redirected to OAuth proxy (URL should contain your OAuth proxy domain)
- [ ] Redirected from OAuth proxy to GitHub authorization page
- [ ] GitHub authorization page displays the correct app name
- [ ] Authorize the application (if first time)
- [ ] Redirected back to the CMS at https://dime73.github.io/ArtByJen/admin/
- [ ] Login completes successfully
- [ ] CMS dashboard loads and displays content collections

### Phase 3: View Content
- [ ] "Site Settings" collection is visible
- [ ] "Gallery Items" collection is visible
- [ ] Can open "Site Settings" → "Home Page Hero"
- [ ] Current hero title and subtitle are displayed correctly
- [ ] Can open "Site Settings" → "About Section"
- [ ] Current about content is displayed correctly
- [ ] Can open "Site Settings" → "Contact Information"
- [ ] Current contact info is displayed correctly

### Phase 4: Edit Content
- [ ] Open "Site Settings" → "Home Page Hero"
- [ ] Make a small test change to the title (e.g., add "TEST" to the end)
- [ ] Click "Publish" button
- [ ] Success message appears
- [ ] No errors in browser console

### Phase 5: Verify GitHub Commit
- [ ] Navigate to https://github.com/Dime73/ArtByJen/commits/main
- [ ] Most recent commit was made by the CMS (should show "Update Site Settings "hero"" or similar)
- [ ] Commit is from the correct user account
- [ ] Click on the commit to view the diff
- [ ] Diff shows the change made to `content/hero.json`
- [ ] Change is correct

### Phase 6: Verify Deployment
- [ ] Navigate to https://github.com/Dime73/ArtByJen/actions
- [ ] Most recent workflow run is triggered by the CMS commit
- [ ] Workflow completes successfully (green checkmark)
- [ ] Wait 2-3 minutes for deployment to complete

### Phase 7: Verify Live Site
- [ ] Navigate to https://dime73.github.io/ArtByJen/
- [ ] Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] The test change is visible on the home page hero section
- [ ] Page loads without errors
- [ ] Images still load correctly

### Phase 8: Test Gallery Management
- [ ] Navigate back to CMS at https://dime73.github.io/ArtByJen/admin/
- [ ] Click on "Gallery Items" collection
- [ ] List of existing gallery items loads
- [ ] Click "New Gallery Item"
- [ ] Fill in required fields:
  - Filename: `test-artwork` (lowercase, hyphens only)
  - Title: `Test Artwork`
  - Medium/Description: `Test Medium`
  - Upload a small test image (< 1MB)
  - Alt Text: `Test alt text`
  - Order: `99`
- [ ] Click "Publish"
- [ ] Success message appears
- [ ] Gallery item appears in the list

### Phase 9: Update Gallery Index
- [ ] Navigate to "Site Settings" → "Gallery Index (Auto-managed)"
- [ ] Current list of gallery item filenames is displayed
- [ ] Add new entry to the list: `test-artwork.json`
- [ ] Click "Publish"
- [ ] Success message appears

### Phase 10: Verify Gallery Changes
- [ ] Check https://github.com/Dime73/ArtByJen/commits/main
- [ ] Two new commits should be present (gallery item + gallery index)
- [ ] Wait for GitHub Actions to complete
- [ ] Navigate to https://dime73.github.io/ArtByJen/
- [ ] Hard refresh the page
- [ ] Scroll to gallery section
- [ ] Test artwork should be visible in the gallery (may be at the end due to order: 99)
- [ ] Image loads correctly
- [ ] Title and medium are displayed

### Phase 11: Clean Up Test Changes
- [ ] Go back to CMS
- [ ] Edit "Home Page Hero" to remove "TEST" from title
- [ ] Publish the change
- [ ] Delete the test gallery item
- [ ] Update gallery index to remove `test-artwork.json`
- [ ] Publish the change
- [ ] Verify changes on live site after deployment

## Troubleshooting

If any step fails, refer to the [CMS Setup Guide](CMS-SETUP-GUIDE.md) troubleshooting section.

### Common Issues

**Login fails or redirects incorrectly**:
- Verify OAuth proxy URL in `admin/config.yml` matches your actual OAuth proxy
- Verify GitHub OAuth App callback URL matches: `https://YOUR_OAUTH_PROXY_URL/callback`
- Check OAuth proxy logs for errors
- Verify CORS is properly configured in OAuth proxy

**Authentication succeeds but CMS shows errors**:
- Verify user is a repository collaborator with Write access
- Check browser console for specific error messages
- Verify `repo` and `branch` in `admin/config.yml` are correct

**Changes don't appear on live site**:
- Wait 3-5 minutes for GitHub Pages deployment
- Check GitHub Actions for failed deployments
- Hard refresh browser (Ctrl+Shift+R)
- Verify commit was actually made to GitHub

**Images don't load in CMS or on site**:
- Verify images are uploaded to `/images` folder
- Check image file size (keep under 2MB)
- Verify image format is web-friendly (JPG, PNG, SVG)
- Check browser console for 404 errors

## Success Criteria

All of the following must be true for the verification to pass:

✅ CMS login works without errors  
✅ OAuth flow completes successfully  
✅ Content can be viewed in CMS  
✅ Content can be edited and published  
✅ Changes create commits in GitHub  
✅ GitHub Actions deploys successfully  
✅ Changes appear on live site within 5 minutes  
✅ Gallery items can be added and removed  
✅ Images upload and display correctly  

## Final Notes

- Save the OAuth proxy URL, GitHub OAuth App credentials securely
- Document the OAuth proxy deployment for future reference
- Provide CMS User Guide to content editors: [CMS-USER-GUIDE.md](CMS-USER-GUIDE.md)
- Monitor GitHub Actions for deployment issues
- Set up notifications for failed deployments if desired

## Support Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [CMS Setup Guide](CMS-SETUP-GUIDE.md)
- [CMS User Guide](CMS-USER-GUIDE.md)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [netlify-cms-github-oauth-provider](https://github.com/vencax/netlify-cms-github-oauth-provider)
