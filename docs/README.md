# GitHub Pages Deployment

This folder contains the production build for GitHub Pages deployment.

## Deployment URL
https://chrisayliffe.github.io/Where-are-you-from-widget/

## Files Included
- `index.html` - Main entry point with `<base href="/Where-are-you-from-widget/">` tag
- `static/` - All JavaScript and CSS bundles
- `.nojekyll` - Prevents GitHub Pages from using Jekyll processing

## GitHub Pages Configuration
Make sure your repository settings have:
- Source: Deploy from a branch
- Branch: main (or your default branch)
- Folder: /docs

## How to Rebuild
From the `/app/frontend` directory:
```bash
yarn build
rm -rf ../docs
mkdir ../docs
cp -r build/* ../docs/
touch ../docs/.nojekyll
```

The build is configured with `homepage: "/Where-are-you-from-widget/"` in package.json.
