import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, absolute } from '../lib/site';
import { PAGES } from '../lib/pages';

/**
 * An index of the site in the llms.txt convention, for the answer engines that now sit between a
 * search and a visit. It is a map, not a copy: the full text lives at /llms-full.txt.
 */
export const GET: APIRoute = async () => {
    const docs = (await getCollection('docs')).sort((a, b) => a.id.localeCompare(b.id));

    const section = (title: string, lines: readonly string[]) => `## ${title}\n\n${lines.join('\n')}\n`;
    const link = (name: string, url: string, note: string) => `- [${name}](${url}): ${note}`;

    const body = [
        `# ${SITE.name}`,
        '',
        `> ${SITE.description}`,
        '',
        'Kubermeister is free and open source. It requires no account, installs nothing into your cluster, and reads the kubeconfig you already have. It is a desktop application, not a web service.',
        '',
        section(
            'Pages',
            PAGES.map((meta) => link(meta.title, absolute(meta.path), meta.description)),
        ),
        section(
            'Documentation',
            docs.map((entry) =>
                link(entry.data.title, absolute(`/${entry.id}/`), entry.data.description ?? SITE.description),
            ),
        ),
        section('Project', [
            link('Source code', SITE.repo, 'The application repository, including CHANGELOG.md.'),
            link('Releases', `${SITE.repo}/releases`, 'Every published version and its installers.'),
            link('Issues', SITE.issues, 'Bug reports and feature requests.'),
            link('Discussions', SITE.discussions, 'Questions and ideas.'),
        ]),
        '## Optional',
        '',
        link('Full text', absolute('/llms-full.txt'), 'Every documentation page, concatenated.'),
        '',
    ].join('\n');

    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
