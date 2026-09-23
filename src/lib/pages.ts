/**
 * Title, description and social card for every page outside /docs/. Keeping them here rather than
 * in each page means the social card generator, llms.txt and the page itself can never disagree
 * about what a page is called.
 */
export type PageMeta = {
    readonly path: string;
    readonly title: string;
    readonly description: string;
    /** Label above the title on the social card. */
    readonly eyebrow: string;
    /** Card title, when the <title> is too long to read at 76px. */
    readonly cardTitle?: string;
    readonly cardSubtitle?: string;
    readonly bareTitle?: boolean;
};

export const PAGES: readonly PageMeta[] = [
    {
        path: '/',
        title: 'Kubermeister — a fast desktop Kubernetes client',
        description:
            'A fast, native desktop client for Kubernetes. Browse live clusters, follow logs, exec into pods, forward ports, roll back Helm releases and drain nodes on macOS, Windows and Linux. Free and open source, no account required.',
        eyebrow: 'Kubernetes desktop client',
        cardTitle: 'A fast desktop client for Kubernetes',
        cardSubtitle: 'Live clusters, logs, shells, port forwards and Helm. Free and open source.',
        bareTitle: true,
    },
    {
        path: '/download/',
        title: 'Download Kubermeister for macOS, Windows and Linux',
        description:
            'Download the latest Kubermeister release for macOS (Apple silicon and Intel, signed and notarised), Windows and Linux, plus a Homebrew cask.',
        eyebrow: 'Download',
        cardTitle: 'Download Kubermeister',
        cardSubtitle: 'Builds for macOS, Windows and Linux. Free and open source.',
    },
    {
        path: '/changelog/',
        title: 'Changelog',
        description:
            'What changed in each Kubermeister release, written for somebody deciding whether to update: what the app now does, and what stopped going wrong.',
        eyebrow: 'Changelog',
        cardTitle: 'What changed, release by release',
    },
] as const;

export const page = (path: string): PageMeta => {
    const found = PAGES.find((entry) => entry.path === path);
    if (!found) throw new Error(`no page metadata for ${path}`);
    return found;
};

/** `/download/` becomes `download`, `/` becomes `index` — the social card route for a page. */
export const cardRoute = (path: string): string => (path === '/' ? 'index' : path.replace(/^\/|\/$/g, ''));
