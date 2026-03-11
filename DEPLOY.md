# Public URL Deployment Guide

You said "愿意", so here is the fastest path to get a public URL.

## Option A (Recommended): Vercel (5 minutes)
1. Push this repo to your GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Framework preset: **Other**.
4. Build command: *(leave empty)*.
5. Output directory: *(leave empty, root)*.
6. Click **Deploy**.
7. You will get a URL like: `https://<project>.vercel.app`.

This repo already includes `vercel.json` for route fallback and preview compatibility.

## Option B: Netlify
1. Push repo to GitHub.
2. Go to https://app.netlify.com/start and import repo.
3. Build command: *(empty)*.
4. Publish directory: `.`
5. Deploy.
6. URL example: `https://<project>.netlify.app`.

This repo already includes `netlify.toml` route rules.

## Option C: GitHub Pages
1. Repo Settings -> Pages.
2. Source: Deploy from branch (`main`/`work`) root.
3. Save and wait.
4. URL example: `https://<username>.github.io/<repo>/`

For Pages, open `/index.html` or `/preview.html` if default route behaves differently.

## After deployment: working links to test
- `/`
- `/index.html`
- `/preview.html`
- `/preview`

