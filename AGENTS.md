# kubermeister.dev

The marketing site for Kubermeister, and the site its documentation is published on. The
application lives in [`kubermeister/kubermeister`](https://github.com/kubermeister/kubermeister),
and so do the documentation pages and their screenshots; this repository contains neither.

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
  `src/content.config.ts`, so the fetched files sit at `src/content/docs/<section>/<page>.md` and
  only the route gains it. The sidebar's `autogenerate` directories in `astro.config.mjs` are **unprefixed**
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

### The documentation comes from the app

- **The pages and their screenshots live in the app repository's `docs/`**, where the pull request
  that changes a screen also changes the page about it. Never add or edit a doc page here.
- `scripts/fetch-docs.mjs` runs before `dev`, `check` and `build`. It reads the app's source
  archive **at the release tag** the build describes — `KM_RELEASE_TAG` on a release dispatch, the
  latest release otherwise — and writes the pages to `src/content/docs/` and the screenshots to
  `src/assets/screenshots/`, both ignored by git. The site therefore documents exactly the version
  people can download, and a page written on the app's `main` is published with its release.
- **There is no fallback.** A build that cannot read the docs fails, and GitHub Pages keeps serving
  the last good deploy; a committed copy would be the duplicate the move removed.
- Each fetched page is given an `editUrl` to its source on the app's `main`, because Starlight
  would otherwise build the edit link from the generated copy's path here. Git history here knows
  nothing of the pages, so `lastUpdated` is off.
- `KM_DOCS_DIR=../kubermeister/docs npm run dev` previews an app checkout's pages before they are
  released. CI never sets it.
- What a page may use is defined in the app's `AGENTS.md`; the components it names (`Figure`,
  Starlight's own) are this repository's to keep working. A new docs section needs its sidebar
  group in `astro.config.mjs`.

### Checking the marketing pages against a release

The marketing pages, `src/lib/pages.ts`, `src/lib/site.ts` and `src/lib/features.ts` make claims
about the app too, and nothing ties them to its code. When asked to **update the website**, read
the `CHANGELOG.md` section and the code diff (`git diff vA..vB -- src` in an app checkout) of every
release since the last one checked, correct whatever those files say that is no longer true, and
refresh `src/data/release.json` from the GitHub API. The docs need nothing: each release brings its
own.

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

- **The screenshots come with the docs**, from the app's `docs/screenshots/<theme>/<shot>.webp`,
  shot by the harness there. **Never add a second harness here.**
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
