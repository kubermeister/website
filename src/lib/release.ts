import { SITE } from './site';
import fallback from '../data/release.json';

export type Release = {
    /** Version without the leading `v`, e.g. `0.6.1`. */
    readonly version: string;
    readonly publishedAt: string;
    readonly htmlUrl: string;
    /** Asset names actually published for this release, used to hide a download we cannot serve. */
    readonly assets: readonly string[];
};

const API = 'https://api.github.com/repos/kubermeister/kubermeister';

/**
 * Set by the deploy workflow from the release dispatch's payload, and empty on every other build.
 * Its presence is what tells this module the build exists to publish one specific release.
 */
const releaseTag = process.env.KM_RELEASE_TAG?.trim() || null;

const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'kubermeister-website-build',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

/**
 * The build asks GitHub for the release the download page, the version badge and the structured
 * data describe.
 *
 * A build the release workflow asked for names the tag it is publishing and asks for that exact
 * release. Asking for "latest" would put a second source on the same question seconds after the
 * first: the dispatch fires as soon as the release is public, and a reply that is briefly stale
 * would ship a site advertising the previous version, successfully and silently.
 *
 * Any other build asks for the latest release, and a committed snapshot answers when the API is
 * unreachable or rate-limited, because a site that fails to build is worse than one a release
 * behind.
 */
export async function latestRelease(): Promise<Release> {
    const path = releaseTag ? `/releases/tags/v${releaseTag}` : '/releases/latest';
    try {
        const response = await fetch(`${API}${path}`, { headers, signal: AbortSignal.timeout(15_000) });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        const body = (await response.json()) as {
            tag_name: string;
            published_at: string;
            html_url: string;
            assets: { name: string }[];
        };
        return {
            version: body.tag_name.replace(/^v/, ''),
            publishedAt: body.published_at,
            htmlUrl: body.html_url,
            assets: body.assets.map((asset) => asset.name),
        };
    } catch (error) {
        // The fallback is for a build that had nothing to do with a release. One the release itself
        // asked for has no such excuse: publishing that version is the whole point of the run, so it
        // fails rather than quietly deploying the version before it.
        if (releaseTag) {
            throw new Error(`[release] could not read v${releaseTag}: ${(error as Error).message}`);
        }
        console.warn(`[release] falling back to src/data/release.json: ${(error as Error).message}`);
        return fallback as Release;
    }
}

export type ChangelogEntry = {
    readonly version: string;
    readonly date: string | null;
    /** Markdown body of the section, headings and all. */
    readonly body: string;
};

/**
 * CHANGELOG.md is hand-written in the app repository and is the only prose about a release that
 * says what changed for somebody deciding whether to update, so the site renders that file rather
 * than the generated list of pull-request titles.
 */
export async function changelog(): Promise<readonly ChangelogEntry[]> {
    let source: string;
    try {
        const response = await fetch('https://raw.githubusercontent.com/kubermeister/kubermeister/main/CHANGELOG.md', {
            headers: { 'User-Agent': headers['User-Agent'] },
            signal: AbortSignal.timeout(15_000),
        });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        source = await response.text();
    } catch (error) {
        console.warn(`[changelog] unavailable, rendering an empty changelog: ${(error as Error).message}`);
        return [];
    }
    return parseChangelog(source);
}

/** Splits a Keep a Changelog document into its `## [version] - date` sections, newest first. */
export function parseChangelog(source: string): readonly ChangelogEntry[] {
    const entries: ChangelogEntry[] = [];
    const heading = /^## \[([^\]]+)\](?:\s*-\s*(\S+))?\s*$/gm;
    const matches = [...source.matchAll(heading)];
    for (const [index, match] of matches.entries()) {
        const start = match.index + match[0].length;
        const end = index + 1 < matches.length ? matches[index + 1]!.index : source.length;
        const body = source.slice(start, end).trim();
        if (!body) continue;
        entries.push({ version: match[1]!, date: match[2] ?? null, body });
    }
    return entries;
}

export const releaseNotesUrl = (version: string): string => `${SITE.repo}/releases/tag/v${version}`;
