# kubermeister.dev

The marketing site and documentation for Kubermeister. The application itself lives in
[`kubermeister/kubermeister`](https://github.com/kubermeister/kubermeister); this repository
contains no application code.

`CLAUDE.md` only imports this file, so edits go here.

## Commands

- `npm run dev` serves at `http://localhost:4321`. `npm run build` writes `dist/`.
- After every change run `npm run check` (astro check) and `npm run format`.
- Node 24 or newer.

## Git workflow

The app repository's conventions apply here too: never commit on `main`, branch as
`type/short-slug`, land every change as a squash-merged PR whose title is a Conventional Commit
header of 66 characters or fewer, and write each paragraph of the PR body as one unwrapped line.
Scopes here are `repo`, `content`, `docs`, `design`, `seo`, `build`, `ci`, `deps`.

### Issues are the plan, and there are no discussions

- **This repository has no Ideas discussion category**, unlike the application repository. Anything
  worth keeping is an issue, whether or not it is scheduled; there is nowhere else for it to go.
- An issue carries a type (`--type Task`, `Bug` or `Feature`, which are the organization's), exactly
  one `area:` label and a `size:` label. A milestone when it belongs to one, which not every issue
  here does.
- **Labels are defined in `.github/labels.yml`** and change only through that file, which the
  `labels.yml` workflow syncs on merge, deleting anything the file does not name. Never add a label
  by hand: the next sync removes it.
- A PR that resolves an issue ends its body with the one-line paragraph `Closes #N.`

## Architecture

### Routing

- **Marketing pages own the root**; Starlight owns `/docs/`. The prefix comes from `generateId` in
  `src/content.config.ts`, so files stay at `src/content/docs/<section>/<page>.md` and only the
  route gains it. The sidebar's `autogenerate` directories in `astro.config.mjs` are **unprefixed**
  (`start`, not `docs/start`): Starlight matches them against the file path under
  `src/content/docs/`, not the entry id, so a prefixed one matches nothing and its group is empty.
- `trailingSlash: 'always'`. GitHub Pages serves directory indexes and has no redirect rules, so
  one slash style has to win or every page is reachable at two URLs. Canonicals are emitted to
  match.
- There are no redirects. A URL, once published, is permanent.

### SEO

- **One JSON-LD `@graph` per page**, built by `src/lib/schema.ts`. Several disconnected blocks make
  the entities harder to relate than one graph whose nodes reference each other by `@id`.
  `Organization`, `WebSite` and `SoftwareApplication` are on every page; pages add `FAQPage`,
  `HowTo`, `BreadcrumbList` or `TechArticle`.
- **Title and description live in `src/lib/pages.ts`**, not in the page, so the social card
  generator, `llms.txt` and the page itself cannot disagree about what a page is called.
- **Starlight already emits** the title, description, canonical, `og:title`, `og:url`,
  `og:site_name`, `og:description` and `twitter:card`. `src/components/docs/Head.astro` adds only
  what it does not — the social image, the structured data and the icons — because adding a tag
  Starlight writes leaves the page with two of it.
- Social cards are rendered at build time by `src/lib/og.ts` (satori plus resvg) at
  `/og/<page path>.png`, one per marketing page and per doc. Its fonts are resolved from the
  project root rather than `import.meta.url`, since the module is bundled into the prerender
  output.
- `llms.txt` and `llms-full.txt` are generated from the same page metadata and content collection.

### Content

- **Claims about Kubermeister come from how the app behaves**, not from how it is positioned.
- The changelog is fetched from the app repository's `CHANGELOG.md` at build time; the release is
  fetched from the GitHub API with `src/data/release.json` as the fallback, because a site that
  fails to build is worse than one a release behind.
- `PLATFORMS` in `src/lib/site.ts` mirrors the `artifactName` pattern in the app's
  `electron-builder.yml`, and electron-builder renders `${arch}` differently per Linux target
  (`amd64` for the `.deb`, `x86_64` for the AppImage). The two change together.

### Keeping the docs in step with the app

The docs describe the app as of one release, recorded in **`src/data/docs-version.json`**. Nothing
updates them automatically, so when asked to **update the website** (or the docs), bring them up
to the newest published release:

1. Read `docs-version.json`, then list the app's releases after that version
   (`gh release list -R kubermeister/kubermeister`). None newer means there is nothing to do.
2. Take them oldest first. For each, read its section of the app's `CHANGELOG.md` **and** the code
   diff between the two tags in a local checkout of the app (`git diff vA..vB -- src`). The
   changelog says what changed; the diff is what the app actually does, and a doc sentence is
   written from the diff. Controls are named by their exact label in the code.
3. Update every page the change touches — often more than one, since a setting or a menu is named
   on several — and add a page when a feature has none. A behaviour a filed bug gets wrong is
   described as it is, with a `:::caution[Known issue]` aside linking the issue; remove the aside
   once the fix has shipped.
4. When a page needs a screenshot that does not exist, add the shot to the harness in the app
   repository first (its own PR there), regenerate the set, then add the name to `WANTED` and run
   `npm run screenshots:sync` here. When the UI of an existing shot changed, re-sync it.
5. Check the marketing pages, `src/lib/pages.ts` and `src/lib/site.ts` against the same diff; they
   make claims about the app too.
6. Set `docs-version.json` to the newest release covered, refresh `src/data/release.json` from the
   GitHub API, run `npm run check` and `npm run format`, and open **one** PR whose body has a
   paragraph per release saying what changed in the docs.

### Design

- The palette, fonts and radius are the app's own (`src/renderer/styles/globals.css` there), so a
  screenshot sits on a page without a seam. The **type scale is not**: the app is 13px because it
  shows a thousand rows, and a landing page is not.
- The theme is `data-theme` on `<html>`, which is Starlight's mechanism, stored under Starlight's
  `starlight-theme` key — so the toggle in the marketing header and the one in the docs are the
  same control and a choice carries across the whole site.
- `src/styles/docs.css` overrides Starlight's custom properties and nothing else, so its upgrades
  keep working.

### Screenshots

- **The harness lives in the application repository**, not here: `npm run build && npm run
screenshots` there drives the built app against its own demo cluster and writes
  `docs/screenshots/<theme>/<shot>.png` in both themes. That repository generates its set and
  commits none of it (kubermeister/kubermeister#315); this one commits the handful it renders,
  because the site has to build in CI with no Docker and no app checkout.
- `npm run screenshots:sync` copies the shots in `WANTED` out of that checkout. A shot the harness
  no longer produces fails the sync rather than leaving a page pointing at a stale image.
- **Never add a second harness here.** Two would drift, and the one over there already has the demo
  seed, the deliberately broken workloads the alerts panel needs, and both themes.
- `src/components/Shot.astro` renders the pair and lets CSS pick, so a light page shows the light
  screenshot. A lazy image inside a hidden element is not fetched until it is shown, so only the
  hero pays for the pair it cannot defer.

### Deployment

- GitHub Pages, from `.github/workflows/deploy.yml` on a push to `main` or a `release-published`
  repository dispatch from the app's release workflow.
- IndexNow submission runs after the deploy and reads the **live** sitemap, so it submits what was
  actually published. It never fails a deploy that already succeeded. The key file in `public/`
  and the `INDEXNOW_KEY` repository variable must hold the same value.

## Code style

Prettier and EditorConfig are authoritative: 4 spaces for source, 2 for JSON, YAML and Markdown;
single quotes; semicolons; 120 columns. Never `any`. Comments explain why, not what.
