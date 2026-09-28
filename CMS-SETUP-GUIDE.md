# Art by Jen editor setup

The editor at `/admin/` is a static, dependency-free page. It uses the GitHub REST API directly from the browser. GitHub [supports CORS requests](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests) from GitHub Pages, so no OAuth server or separate hosting account is needed.

## Access

Editors must have write access to `Dime73/ArtByJen` and create a fine-grained personal access token limited to this repository with **Contents: Read and write**. The GitHub [token settings](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) allow a selected repository and an expiration date. The token is held in a JavaScript variable for the current page session. It is not written to local storage, cookies, or repository files.

The editor itself is a public page. GitHub controls who can save changes based on repository access and token permissions.

## How publishing works

The editor reads the latest `main` commit and its Git tree, then loads the JSON files in `content/`. On publish, it validates the input, uploads any new image blobs, and creates a new Git tree and commit. It updates `main` with a non-forced reference update. This is one atomic commit for text, artwork files, images, and `content/gallery-index.json`. New and removed artwork entries update the gallery index automatically.

If `main` changed since the editor loaded, publishing stops so another editor’s work is not overwritten. The existing GitHub Actions Pages workflow deploys the new commit. Old image files are retained when artwork is removed.

The API calls use GitHub’s [Git trees](https://docs.github.com/en/rest/git/trees), [commits](https://docs.github.com/en/rest/git/commits), and [references](https://docs.github.com/en/rest/git/refs) endpoints. GitHub documents **Contents: write** as the required fine-grained token permission for those write operations.

## Content files

- `content/hero.json`: home heading and subtitle
- `content/about.json`: about heading and paragraphs
- `content/contact.json`: contact heading, text, and email
- `content/gallery/*.json`: individual artwork metadata
- `content/gallery-index.json`: ordered list of artwork files, maintained by the editor
- `images/`: artwork images

To test locally, serve the repository root with `python3 -m http.server 8080` and visit `http://localhost:8080/admin/`. A real token is still required to load and save repository content. Avoid using a token on a shared or untrusted computer.
