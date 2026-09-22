import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, absolute } from '../lib/site';

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
            entry.body?.trim() ?? '',
        ].join('\n'),
    );

    const body = [`# ${SITE.name} documentation`, '', `> ${SITE.description}`, '', ...pages].join('\n\n---\n\n');

    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
