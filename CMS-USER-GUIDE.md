# Art by Jen editor guide

The portfolio editor is at [dime73.github.io/ArtByJen/admin/](https://dime73.github.io/ArtByJen/admin/). It works on GitHub Pages and saves changes to the `Dime73/ArtByJen` repository.

## First-time access

1. Sign in to a GitHub account with write access to `Dime73/ArtByJen`.
2. Create a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new). Choose `Dime73` as the resource owner, select only the `ArtByJen` repository, and grant **Contents: Read and write**. Set an expiration date.
3. Open the editor and paste the token into the access field. Keep the token private. The editor holds it only in the current tab’s memory and does not save it in browser storage.

The token is cleared when you disconnect, close, or reload the tab. If it expires, generate a new one. Revoke an unused token in GitHub settings.

## Edit your portfolio

- **Home:** Edit the main title and subtitle.
- **About:** Edit the heading and two paragraphs.
- **Contact:** Edit the heading, introduction, and email address.
- **Gallery:** Open an artwork to edit its title, medium, image, accessible description, order, or sample label. Use **Add artwork** to create a new entry. The file name must use lowercase letters, numbers, and hyphens.
- **Upload an image:** In an artwork, choose a JPG, PNG, or WebP file under 8 MB. The editor places it in the `images/` folder. It also accepts a path to an existing image in that folder.
- **Remove artwork:** Open it and choose **Remove artwork**. The artwork entry is removed from the site; its image file stays in the repository in case it is shared or needed later.

Choose **Publish changes** when you are ready. The editor saves all pending edits in one commit. GitHub Pages then updates the live website, normally within a few minutes. Open the website in a new tab and refresh to check.

If someone else changed the repository while you were editing, the editor will stop before publishing. Copy any unsaved text you need, reload the page, reconnect, and review the latest content before trying again.
