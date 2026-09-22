import { SITE, absolute } from './site';

/**
 * Structured data builders. Every page emits exactly one `@graph`, because several disconnected
 * JSON-LD blocks on a page make the entities harder for a parser to relate than one graph whose
 * nodes reference each other by `@id`.
 */
type Node = Record<string, unknown>;

export const ORGANIZATION_ID = absolute('/#organization');
export const WEBSITE_ID = absolute('/#website');
export const APP_ID = absolute('/#software');

export const organization = (): Node => ({
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE.org,
    url: SITE.origin,
    logo: { '@type': 'ImageObject', url: absolute('/icon-512.png'), width: 512, height: 512 },
    sameAs: [SITE.repo],
});

export const website = (): Node => ({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: SITE.origin,
    description: SITE.description,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en',
});

export const softwareApplication = (version: string, datePublished: string): Node => ({
    '@type': 'SoftwareApplication',
    '@id': APP_ID,
    name: SITE.name,
    url: SITE.origin,
    description: SITE.description,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Kubernetes client',
    operatingSystem: 'macOS 11+, Windows 10+, Linux',
    softwareVersion: version,
    datePublished,
    downloadUrl: absolute('/download/'),
    installUrl: absolute('/download/'),
    softwareHelp: { '@type': 'CreativeWork', url: absolute('/docs/') },
    releaseNotes: `${SITE.repo}/releases`,
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
});

export const webPage = (input: { url: string; title: string; description: string }): Node => ({
    '@type': 'WebPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.title,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': APP_ID },
    inLanguage: 'en',
});

export const breadcrumbs = (trail: readonly { name: string; path: string }[]): Node => ({
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: step.name,
        item: absolute(step.path),
    })),
});

export type Faq = { readonly question: string; readonly answer: string };

export const faqPage = (faqs: readonly Faq[]): Node => ({
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
});

export const howTo = (input: {
    name: string;
    description: string;
    steps: readonly { name: string; text: string }[];
}): Node => ({
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    step: input.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
    })),
});

export const graph = (nodes: readonly Node[]): string =>
    JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });
