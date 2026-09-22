import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/**
 * Docs live at /docs/ while the marketing pages own the root, so every entry id carries the prefix.
 * Files stay at src/content/docs/<section>/<page>.md; only the route gains it.
 */
const docsId = ({ entry }: { entry: string }): string => {
    const path = entry.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
    return path ? `docs/${path}` : 'docs';
};

export const collections = {
    docs: defineCollection({ loader: docsLoader({ generateId: docsId }), schema: docsSchema() }),
};
