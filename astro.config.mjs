// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { EnumChangefreq } from 'sitemap';

import { SITE } from './src/lib/site.ts';

export default defineConfig({
    site: SITE.origin,
    // GitHub Pages serves directory indexes, so one slash style has to win or every page is
    // reachable at two URLs. Canonical tags are emitted to match.
    trailingSlash: 'always',
    prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
    build: { format: 'directory' },
    image: { responsiveStyles: true },
    vite: { plugins: [tailwindcss()] },
    integrations: [
        starlight({
            title: 'Kubermeister Docs',
            description: SITE.description,
            disable404Route: true,
            favicon: '/favicon.svg',
            logo: { src: './src/assets/logo.svg', alt: 'Kubermeister' },
            social: [{ icon: 'github', label: 'GitHub', href: SITE.repo }],
            editLink: { baseUrl: `${SITE.siteRepo}/edit/main/` },
            lastUpdated: true,
            pagination: true,
            customCss: ['./src/styles/global.css', './src/styles/docs.css'],
            components: {
                SiteTitle: './src/components/docs/SiteTitle.astro',
                Head: './src/components/docs/Head.astro',
            },
            expressiveCode: { themes: ['github-dark-default', 'github-light'] },
            sidebar: [
                { label: 'Start here', items: [{ autogenerate: { directory: 'docs/start' } }] },
                { label: 'Clusters', items: [{ autogenerate: { directory: 'docs/clusters' } }] },
                { label: 'Browsing resources', items: [{ autogenerate: { directory: 'docs/browse' } }] },
                { label: 'Workloads', items: [{ autogenerate: { directory: 'docs/workloads' } }] },
                { label: 'Live sessions', items: [{ autogenerate: { directory: 'docs/sessions' } }] },
                { label: 'Operations', items: [{ autogenerate: { directory: 'docs/operations' } }] },
                { label: 'Reference', items: [{ autogenerate: { directory: 'docs/reference' } }] },
            ],
        }),
        sitemap({
            filter: (page) => !page.includes('/_'),
            serialize(item) {
                const path = new URL(item.url).pathname;
                if (path === '/') return { ...item, priority: 1.0, changefreq: EnumChangefreq.WEEKLY };
                if (path === '/download/') return { ...item, priority: 0.9, changefreq: EnumChangefreq.WEEKLY };
                if (path.startsWith('/docs/')) return { ...item, priority: 0.7, changefreq: EnumChangefreq.MONTHLY };
                return { ...item, priority: 0.5, changefreq: EnumChangefreq.MONTHLY };
            },
        }),
    ],
});
