import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderCard, type Card } from '../../lib/og';
import { PAGES, cardRoute } from '../../lib/pages';

/**
 * One social card per page, rendered at build time. The route mirrors the page path so BaseHead
 * can derive the image URL from the page it is already describing.
 */
export const getStaticPaths: GetStaticPaths = async () => {
    const marketing = PAGES.map((meta) => ({
        params: { route: cardRoute(meta.path) },
        props: {
            eyebrow: meta.eyebrow,
            title: meta.cardTitle ?? meta.title,
            subtitle: meta.cardSubtitle,
        } satisfies Card,
    }));

    const docs = (await getCollection('docs')).map((entry) => ({
        params: { route: entry.id },
        props: {
            eyebrow: 'Documentation',
            title: entry.data.title,
            subtitle: entry.data.description,
        } satisfies Card,
    }));

    return [...marketing, ...docs];
};

export const GET: APIRoute = async ({ props }) =>
    new Response(new Uint8Array(await renderCard(props as Card)), {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
