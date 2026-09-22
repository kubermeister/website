/**
 * Copies the screenshots this site uses out of the app checkout.
 *
 *   npm run screenshots:sync
 *
 * The harness itself lives in the application repository (`npm run build && npm run screenshots`
 * there), which owns the demo cluster, the shot list and both themes. That repository generates
 * its set and commits none of it; this one commits the handful it renders, because the site has to
 * build in CI with no Docker and no app checkout.
 *
 * The harness writes PNG. They are stored here as near-lossless WebP, which is a third smaller
 * again with no artifacts on the one thing these images are full of, small text. That matters
 * because git keeps every regenerated set for good and these are files whose bytes change wholesale
 * on every run.
 *
 * Point KM_APP_REPO elsewhere if your checkout is not at ../kubermeister.
 */
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const HERE = fileURLToPath(new URL('..', import.meta.url));
const APP = resolve(process.env.KM_APP_REPO ?? join(HERE, '..', 'kubermeister'));
const SOURCE = join(APP, 'docs', 'screenshots');
const TARGET = join(HERE, 'src', 'assets', 'screenshots');

/** The shots the site renders. Adding one here is the only step needed to use it in a page. */
const WANTED = [
    'command-palette',
    'crd-instances',
    'deployment-compare',
    'describe',
    'events',
    'helm-release',
    'manifest-editor',
    'namespace-detail',
    'node-detail',
    'node-drain-plan',
    'pod-logs',
    'pod-related',
    'pod-shell',
    'pods-grouped',
    'pods-list',
    'port-forwards',
    'secret-reveal',
    'settings',
    'summary',
    'workload-logs',
];

/**
 * The harness photographs a 1440x900 window, which a retina Mac captures at 2x. No page ever serves
 * one above 1920 wide, so the extra pixels are bytes git would keep for good and nobody would see.
 */
const MAX_WIDTH = 2048;

const THEMES = ['dark', 'light'];

if (!existsSync(SOURCE)) {
    console.error(
        `No screenshots at ${SOURCE}.\nGenerate them first:\n  cd ${APP} && npm run build && npm run screenshots`,
    );
    process.exit(1);
}

let copied = 0;
let bytesIn = 0;
let bytesOut = 0;
const missing = [];

for (const theme of THEMES) {
    const from = join(SOURCE, theme);
    if (!existsSync(from)) {
        missing.push(`${theme}/ (the whole theme)`);
        continue;
    }
    const available = new Set(readdirSync(from));
    const to = join(TARGET, theme);
    mkdirSync(to, { recursive: true });

    for (const shot of WANTED) {
        const file = `${shot}.png`;
        if (!available.has(file)) {
            missing.push(`${theme}/${file}`);
            continue;
        }
        const { size } = await sharp(join(from, file))
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ nearLossless: true, quality: 60, effort: 6 })
            .toFile(join(to, `${shot}.webp`));
        bytesIn += statSync(join(from, file)).size;
        bytesOut += size;
        copied += 1;
    }
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
console.log(`Converted ${copied} screenshot(s) from ${SOURCE}: ${mb(bytesIn)} PNG -> ${mb(bytesOut)} WebP`);

if (missing.length > 0) {
    // A missing shot fails the sync rather than leaving a page pointing at a stale image: the
    // harness names its shots, so a rename should be noticed here and not in a published page.
    console.error(`\nMissing:\n${missing.map((name) => `  - ${name}`).join('\n')}`);
    console.error('\nRegenerate the full set in the app checkout, or update WANTED in this script.');
    process.exit(1);
}
