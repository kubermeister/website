/**
 * Puts the documentation this site publishes in place: the app repository's `docs/` at the release
 * the build describes, pages into `src/content/docs/` and screenshots into `src/assets/screenshots/`.
 * Both are generated, ignored by git, and rewritten on every run.
 *
 * The docs live beside the code they describe, so a pull request there that changes a screen also
 * changes the page about it. Building from the release tag rather than from `main` is what keeps a
 * page describing the version people can download: a page written ahead of a release is published
 * with it.
 *
 * Which release: the one a release dispatch names (`KM_RELEASE_TAG`), else the latest, the same
 * question `src/lib/release.ts` asks. Unlike that module this has no fallback. GitHub Pages keeps
 * serving the last good deploy, so a build that cannot read the docs costs nothing, and a committed
 * copy to fall back on is the duplicate the move exists to remove.
 *
 * `KM_DOCS_DIR=../kubermeister/docs npm run dev` reads a local checkout instead, for previewing
 * pages before they are released. Only a local run does that; CI never sets it.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'kubermeister/kubermeister';
const HERE = fileURLToPath(new URL('..', import.meta.url));
const PAGES = join(HERE, 'src', 'content', 'docs');
const SCREENSHOTS = join(HERE, 'src', 'assets', 'screenshots');

const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'kubermeister-website-build',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

function fail(message) {
    console.error(`[docs] ${message}`);
    process.exit(1);
}

async function releaseTag() {
    const pinned = process.env.KM_RELEASE_TAG?.trim();
    if (pinned) return `v${pinned.replace(/^v/, '')}`;
    const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers,
        signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) fail(`could not ask GitHub for the latest release: ${response.status} ${response.statusText}`);
    return (await response.json()).tag_name;
}

/** The tag's source archive, unpacked into a temporary directory; returns the unpacked `docs/`. */
async function downloadDocs(tag) {
    const response = await fetch(`https://codeload.github.com/${REPO}/tar.gz/refs/tags/${tag}`, {
        headers: { 'User-Agent': headers['User-Agent'] },
        signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) fail(`could not download ${tag}: ${response.status} ${response.statusText}`);
    const work = mkdtempSync(join(tmpdir(), 'km-docs-'));
    const archive = join(work, 'source.tar.gz');
    writeFileSync(archive, Buffer.from(await response.arrayBuffer()));
    execFileSync('tar', ['-xzf', archive, '-C', work]);
    const root = readdirSync(work).find((entry) => entry !== 'source.tar.gz');
    const docs = root && join(work, root, 'docs');
    if (!docs || !existsSync(docs)) fail(`${tag} has no docs/ directory; the first release to carry one is 0.5.1`);
    return docs;
}

function pagesUnder(dir) {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return pagesUnder(path);
        return /\.mdx?$/.test(entry) ? [path] : [];
    });
}

/**
 * Starlight builds a page's edit link from the path it read the file at, which here is this
 * repository's generated copy. The page's own `editUrl` wins over that, so each copy is given the
 * address of its source: the page on the app repository's `main`, where a fix belongs.
 */
function pointEditLinks(dir) {
    for (const page of pagesUnder(dir)) {
        const source = relative(dir, page).split('\\').join('/');
        const text = readFileSync(page, 'utf8');
        if (!text.startsWith('---\n')) fail(`docs/${source} has no frontmatter`);
        const editUrl = `https://github.com/${REPO}/edit/main/docs/${source}`;
        writeFileSync(page, text.replace('---\n', `---\neditUrl: ${editUrl}\n`));
    }
}

const local = process.env.KM_DOCS_DIR ? resolve(process.env.KM_DOCS_DIR) : null;
if (local && !existsSync(local)) fail(`KM_DOCS_DIR points at ${local}, which does not exist`);
const tag = local ? null : await releaseTag();
const source = local ?? (await downloadDocs(tag));

rmSync(PAGES, { recursive: true, force: true });
rmSync(SCREENSHOTS, { recursive: true, force: true });
cpSync(source, PAGES, { recursive: true, filter: (path) => !path.startsWith(join(source, 'screenshots')) });
if (existsSync(join(source, 'screenshots'))) cpSync(join(source, 'screenshots'), SCREENSHOTS, { recursive: true });
pointEditLinks(PAGES);

console.log(`[docs] ${pagesUnder(PAGES).length} pages from ${local ?? `${REPO}@${tag}`}`);
