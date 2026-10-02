/**
 * Links that leave kubermeister.dev open in a new tab, so a reader following one to GitHub or a
 * tool's own docs keeps the page they came from. Installer downloads are written without these
 * attributes: a file link never navigates, and a new tab would only flash open empty.
 */
import { SITE } from './site';

export const EXTERNAL = { target: '_blank', rel: 'noopener' } as const;

export const isExternal = (href: string): boolean => /^https?:\/\//.test(href) && !href.startsWith(SITE.origin);

/**
 * The same rule for Markdown, as a Sätteri hast plugin, which covers the docs fetched from the app
 * repository and anything else Astro renders from Markdown or MDX.
 */
export const externalLinksPlugin = {
    name: 'external-links',
    element: {
        filter: ['a'],
        visit(
            node: Readonly<{ properties?: Record<string, unknown> }>,
            ctx: { setProperty(node: object, key: string, value: unknown): void },
        ) {
            const href = node.properties?.href;
            if (typeof href !== 'string' || !isExternal(href)) return;
            for (const [key, value] of Object.entries(EXTERNAL)) ctx.setProperty(node, key, value);
        },
    },
};
