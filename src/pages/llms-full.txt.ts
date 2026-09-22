import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, absolute } from '../lib/site';

/**
 * Strips what MDX adds and Markdown does not have: the component imports at the top of a page and
 * the self-closing elements in its body. A reader of this file wants the prose, not the figures.
 */
const prose = (body: string): string =>
    body
        .replace(/^import .*?;\s*$/gm, '')
        .replace(/^<[A-Z][\s\S]*?\/>\s*$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

/** Every documentation page as one plain-text document, in sidebar order. */
export const GET: APIRoute = async () => {
    const docs = (await getCollection('docs')).sort((a, b) => a.id.localeCompare(b.id));

    const pages = docs.map((entry) =>
        [
            `# ${entry.data.title}`,
            '',
            `Source: ${absolute(`/${entry.id}/`)}`,
            entry.data.description ? `\n${entry.data.description}` : '',
            '',
            prose(entry.body ?? ''),
        ].join('\n'),
    );

    const body = [`# ${SITE.name} documentation`, '', `> ${SITE.description}`, '', ...pages].join('\n\n---\n\n');

    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
