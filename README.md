# kubermeister.dev

The Kubermeister website and documentation. Astro with Starlight for the docs, Tailwind 4 for the
marketing pages, deployed to GitHub Pages at [kubermeister.dev](https://kubermeister.dev).

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # writes dist/
npm run preview    # serve dist/
npm run check      # astro check
npm run format     # prettier
```

Node 24 or newer.

## What is where

| Path                     | What it holds                                                       |
| ------------------------ | ------------------------------------------------------------------- |
| `src/pages`              | The marketing pages: home, download, changelog, comparisons, 404.   |
| `src/content/docs`       | The documentation. Files map to `/docs/<path>/`.                    |
| `src/lib`                | Site constants, page metadata, comparison content, structured data. |
| `src/components`         | Shared components; `components/docs` overrides Starlight's.         |
| `src/assets/screenshots` | Synced from the app repo's harness, one directory per theme.        |
| `scripts`                | The screenshot capture and the IndexNow submitter.                  |

## Screenshots

Every screenshot is the real application. The harness lives in the app repository, which owns the
demo cluster and the shot list and photographs every screen in both themes:

```sh
cd ../kubermeister && npm run build && npm run screenshots
cd ../website && npm run screenshots:sync
```

The sync copies only the shots this site renders, listed in `scripts/sync-screenshots.mjs`.
`KM_APP_REPO` points at the app checkout if it is not at `../kubermeister`.

## Deploying

A push to `main` builds and deploys through `.github/workflows/deploy.yml`, then submits the live
sitemap to IndexNow. The app's release workflow can fire a `release-published` repository dispatch
so a new version rebuilds the download page and the changelog on its own.

DNS for the apex points at GitHub Pages; `public/CNAME` carries the domain and `www` redirects to
the apex.
