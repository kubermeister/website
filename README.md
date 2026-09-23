# kubermeister.dev

The Kubermeister website. Astro with Starlight for the docs, Tailwind 4 for the marketing pages,
deployed to GitHub Pages at [kubermeister.dev](https://kubermeister.dev). The documentation itself
is written in the [app repository](https://github.com/kubermeister/kubermeister/tree/main/docs) and
fetched from its latest release at build time.

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
| `src/content/docs`       | Fetched docs, not committed. Files map to `/docs/<path>/`.          |
| `src/lib`                | Site constants, page metadata, comparison content, structured data. |
| `src/components`         | Shared components; `components/docs` overrides Starlight's.         |
| `src/assets/screenshots` | Fetched with the docs, not committed, one directory per theme.      |
| `scripts`                | The docs fetch and the IndexNow submitter.                          |

## Docs and screenshots

`npm run dev`, `check` and `build` first run `scripts/fetch-docs.mjs`, which puts the app's `docs/`
from its latest release (or the release a dispatch names) in place, pages and screenshots together.
To preview pages that are not released yet, point it at an app checkout:

```sh
KM_DOCS_DIR=../kubermeister/docs npm run dev
```

Pages and screenshots are changed in the app repository, never here.

## Deploying

A push to `main` builds and deploys through `.github/workflows/deploy.yml`, then submits the live
sitemap to IndexNow. The app's release workflow can fire a `release-published` repository dispatch
so a new version rebuilds the download page and the changelog on its own.

DNS for the apex points at GitHub Pages; `public/CNAME` carries the domain and `www` redirects to
the apex.
