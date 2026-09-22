/**
 * Every fact about the site that more than one page needs. Pages read from here rather than
 * repeating an origin, a repository URL or a product sentence that would then drift.
 */
export const SITE = {
    origin: 'https://kubermeister.io',
    name: 'Kubermeister',
    /** The one-line answer to "what is this", reused as the default meta description. */
    tagline: 'A fast, native desktop client for Kubernetes',
    description:
        'Kubermeister is a fast desktop Kubernetes client for macOS, Windows and Linux. Browse live clusters, follow logs, exec into pods, forward ports, manage Helm releases and drain nodes — without kubectl.',
    repo: 'https://github.com/kubermeister/kubermeister',
    siteRepo: 'https://github.com/kubermeister/website',
    tap: 'https://github.com/kubermeister/homebrew-tap',
    discussions: 'https://github.com/kubermeister/kubermeister/discussions',
    issues: 'https://github.com/kubermeister/kubermeister/issues',
    org: 'Kubermeister',
    /** Twitter/X handle, or null while there is no account — the meta tag is omitted rather than faked. */
    social: null as string | null,
} as const;

export type NavLink = { readonly label: string; readonly href: string };

export const NAV: readonly NavLink[] = [
    { label: 'Features', href: '/#features' },
    { label: 'Docs', href: '/docs/' },
    { label: 'Compare', href: '/compare/' },
    { label: 'Changelog', href: '/changelog/' },
] as const;

export const FOOTER: readonly { readonly title: string; readonly links: readonly NavLink[] }[] = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '/#features' },
            { label: 'Download', href: '/download/' },
            { label: 'Changelog', href: '/changelog/' },
            { label: 'Security', href: '/docs/reference/security/' },
        ],
    },
    {
        title: 'Documentation',
        links: [
            { label: 'Install', href: '/docs/start/install/' },
            { label: 'Connect a cluster', href: '/docs/clusters/connecting/' },
            { label: 'Logs', href: '/docs/sessions/logs/' },
            { label: 'Troubleshooting', href: '/docs/reference/troubleshooting/' },
        ],
    },
    {
        title: 'Compare',
        links: [
            { label: 'vs Lens', href: '/compare/lens/' },
            { label: 'vs OpenLens', href: '/compare/openlens/' },
            { label: 'vs k9s', href: '/compare/k9s/' },
            { label: 'vs Headlamp', href: '/compare/headlamp/' },
        ],
    },
    {
        title: 'Project',
        links: [
            { label: 'GitHub', href: SITE.repo },
            { label: 'Discussions', href: SITE.discussions },
            { label: 'Report an issue', href: SITE.issues },
            { label: 'Releases', href: `${SITE.repo}/releases` },
        ],
    },
] as const;

export type PlatformId = 'mac-arm64' | 'mac-x64' | 'win-x64' | 'linux-appimage' | 'linux-deb';

export type Platform = {
    readonly id: PlatformId;
    readonly os: 'macos' | 'windows' | 'linux';
    readonly label: string;
    readonly note: string;
    /** Template over the release version; `{v}` is replaced with the version, without the leading v. */
    readonly asset: string;
};

/**
 * Mirrors the `artifactName` pattern in the app's electron-builder.yml
 * (`${productName}-${version}-${os}-${arch}.${ext}`). The two change together.
 */
export const PLATFORMS: readonly Platform[] = [
    {
        id: 'mac-arm64',
        os: 'macos',
        label: 'macOS · Apple silicon',
        note: 'M1 and newer',
        asset: 'Kubermeister-{v}-mac-arm64.dmg',
    },
    { id: 'mac-x64', os: 'macos', label: 'macOS · Intel', note: 'x86-64', asset: 'Kubermeister-{v}-mac-x64.dmg' },
    {
        id: 'win-x64',
        os: 'windows',
        label: 'Windows',
        note: 'Installer, x86-64',
        asset: 'Kubermeister-{v}-win-x64.exe',
    },
    {
        id: 'linux-appimage',
        os: 'linux',
        label: 'Linux · AppImage',
        note: 'x86-64, portable',
        asset: 'Kubermeister-{v}-linux-x86_64.AppImage',
    },
    {
        id: 'linux-deb',
        os: 'linux',
        label: 'Linux · Debian',
        note: 'x86-64, .deb',
        asset: 'Kubermeister-{v}-linux-amd64.deb',
    },
] as const;

export const downloadUrl = (platform: Platform, version: string): string =>
    `${SITE.repo}/releases/download/v${version}/${platform.asset.replace('{v}', version)}`;

/** Absolute URL for a site-relative path. */
export const absolute = (path: string): string => new URL(path, SITE.origin).href;
