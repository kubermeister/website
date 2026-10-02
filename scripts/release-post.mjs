/**
 * Opens an issue reminding whoever publishes a release to announce it on X, with a draft post and a
 * link that opens X's composer already holding it. It runs after the deploy, so by the time the
 * issue exists the site the post links to already describes the release.
 *
 * Nothing is posted: the issue is the reminder, and the post stays somebody's own words.
 */
const REPO = process.env.GITHUB_REPOSITORY;
const APP_REPO = 'kubermeister/kubermeister';
const SITE = 'https://kubermeister.dev';
const LABELS = ['area: content', 'size: S'];
// X counts every URL as 23 characters, however long it is.
const X_LIMIT = 280;
const X_URL_LENGTH = 23;

const version = process.env.KM_RELEASE_VERSION;
const token = process.env.GITHUB_TOKEN;
if (!version || !token || !REPO) {
    console.error('KM_RELEASE_VERSION, GITHUB_TOKEN and GITHUB_REPOSITORY must be set');
    process.exit(1);
}

const github = async (path, init = {}) => {
    const response = await fetch(`https://api.github.com${path}`, {
        ...init,
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28',
            ...init.headers,
        },
        signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`${init.method ?? 'GET'} ${path}: ${response.status} ${await response.text()}`);
    return response.json();
};

const title = `Post Kubermeister ${version} on X`;

// Closed ones count too: a re-run after the post went out must not ask for it again.
const existing = await github(`/repos/${REPO}/issues?state=all&labels=${encodeURIComponent(LABELS[0])}&per_page=100`);
if (existing.some((issue) => issue.title === title)) {
    console.log(`"${title}" already exists`);
    process.exit(0);
}

// Read at the tag, as the build does, so the notes are the ones the release shipped with.
const changelogResponse = await fetch(`https://raw.githubusercontent.com/${APP_REPO}/v${version}/CHANGELOG.md`, {
    signal: AbortSignal.timeout(30_000),
});
const changelog = changelogResponse.ok ? await changelogResponse.text() : '';
const heading = new RegExp(`^## \\[${version.replaceAll('.', '\\.')}\\][^\\n]*\\n`, 'm');
const start = changelog.search(heading);
const section = start === -1 ? '' : changelog.slice(start).replace(heading, '').split(/^## /m)[0].trim();

const plain = (line) =>
    line
        .replace(/\*\*|`/g, '')
        .replace(/\s+/g, ' ')
        .trim();
const bullets = (kind) =>
    [...section.matchAll(new RegExp(`^### ${kind}\\n([\\s\\S]*?)(?=^### |(?![\\s\\S]))`, 'gm'))]
        .flatMap((match) => match[1].split(/^- /m).slice(1))
        .map(plain);
// What a release adds is the reason to tell anybody about it; a fix-only release leads with its fix.
const highlight = [...bullets('Added'), ...bullets('Changed'), ...bullets('Fixed')][0];

const opening = `Kubermeister ${version} is out.`;
const closing = `What changed: ${SITE}/changelog/`;
const length = (text) => text.replace(/https:\/\/\S+/g, 'x'.repeat(X_URL_LENGTH)).length;
const withHighlight = highlight && `${opening}\n\n${highlight}\n\n${closing}`;
const draft = withHighlight && length(withHighlight) <= X_LIMIT ? withHighlight : `${opening}\n\n${closing}`;

// A bare parenthesis would end the Markdown link early.
const intent = `https://x.com/intent/post?text=${encodeURIComponent(draft).replace(/[()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)}`;

const body = [
    `Kubermeister ${version} is released and kubermeister.dev has been redeployed with it. Announce it on X, then close this issue.`,
    `**[Open X with the draft](${intent})**, or copy it:`,
    '```text\n' + draft + '\n```',
    `The draft is ${length(draft)} of ${X_LIMIT} characters, counting the link as ${X_URL_LENGTH}. Replace the line in the middle with whichever change matters most.`,
    section
        ? `<details><summary>What changed in ${version}</summary>\n\n${section}\n\n</details>`
        : `The ${version} section of the changelog could not be read; it is on the [release](https://github.com/${APP_REPO}/releases/tag/v${version}).`,
].join('\n\n');

const issue = await github(`/repos/${REPO}/issues`, {
    method: 'POST',
    body: JSON.stringify({ title, body, labels: LABELS, type: 'Task' }),
});
console.log(`opened ${issue.html_url}`);
