/**
 * Submits the live sitemap's URLs to IndexNow after a deploy, so Bing — and the answer engines
 * that read its index — hear about a new page rather than waiting to crawl it.
 *
 * The key is a static file served from the site root; that file is how IndexNow verifies that
 * whoever is submitting controls the host. Set the same value as the INDEXNOW_KEY repository
 * variable and as the name of the file in `public/`.
 */
const HOST = 'kubermeister.com';

const key = process.env.INDEXNOW_KEY;
if (!key) {
    console.error('INDEXNOW_KEY is not set; skipping submission');
    process.exit(0);
}

const sitemap = await fetch(`https://${HOST}/sitemap-0.xml`, { signal: AbortSignal.timeout(30_000) });
if (!sitemap.ok) {
    console.error(`could not read the live sitemap: ${sitemap.status} ${sitemap.statusText}`);
    process.exit(1);
}

const urlList = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urlList.length === 0) {
    console.error('the live sitemap listed no URLs');
    process.exit(1);
}

const response = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
    signal: AbortSignal.timeout(30_000),
});

console.log(`IndexNow: ${response.status} ${response.statusText} for ${urlList.length} URLs`);
