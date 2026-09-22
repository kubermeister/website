import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// Resolved from the project root rather than from `import.meta.url`: this module is bundled into
// the prerender output, where a URL relative to the module no longer points at src/.
const asset = (path: string) => readFileSync(resolve(process.cwd(), 'src/assets', path));

const font = (file: string) => asset(`fonts/${file}`);

const FONTS = [
    { name: 'Geist', data: font('Geist-Regular.ttf'), weight: 400 as const, style: 'normal' as const },
    { name: 'Geist', data: font('Geist-SemiBold.ttf'), weight: 600 as const, style: 'normal' as const },
    { name: 'Geist', data: font('Geist-Bold.ttf'), weight: 700 as const, style: 'normal' as const },
];

const MARK = asset('logo.svg')
    .toString()
    .replace(/currentColor/g, '#5b7cff');
const MARK_URI = `data:image/svg+xml;base64,${Buffer.from(MARK).toString('base64')}`;

const BG = '#0b0d10';
const FG = '#eef0f4';
const MUTED = '#7a808b';
const ACCENT = '#5b7cff';
const LINE = '#262a31';

/** Satori takes a React-ish tree; these are plain objects so the module needs no JSX pipeline. */
type El = { type: string; props: Record<string, unknown> };
const el = (type: string, props: Record<string, unknown>): El => ({ type, props });

export type Card = {
    /** Small label above the title, e.g. `Documentation` or `Compare`. */
    readonly eyebrow: string;
    readonly title: string;
    readonly subtitle?: string;
};

const tree = (card: Card): El =>
    el('div', {
        style: {
            width: 1200,
            height: 630,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: BG,
            padding: '64px 72px',
            fontFamily: 'Geist',
            // A single accent hairline along the top — the one piece of decoration on the card.
            borderTop: `8px solid ${ACCENT}`,
        },
        children: [
            el('div', {
                style: { display: 'flex', alignItems: 'center', gap: 16 },
                children: [
                    el('img', { src: MARK_URI, width: 44, height: 44 }),
                    el('div', {
                        style: { display: 'flex', fontSize: 30, fontWeight: 600, color: FG, letterSpacing: '-0.02em' },
                        children: 'Kubermeister',
                    }),
                    el('div', {
                        style: {
                            display: 'flex',
                            marginLeft: 'auto',
                            fontSize: 20,
                            color: MUTED,
                            textTransform: 'uppercase',
                            letterSpacing: '0.16em',
                        },
                        children: card.eyebrow,
                    }),
                ],
            }),
            el('div', {
                style: { display: 'flex', flexDirection: 'column', gap: 24 },
                children: [
                    el('div', {
                        style: {
                            display: 'flex',
                            fontSize: card.title.length > 46 ? 62 : 76,
                            fontWeight: 600,
                            color: FG,
                            letterSpacing: '-0.035em',
                            lineHeight: 1.06,
                        },
                        children: card.title,
                    }),
                    card.subtitle
                        ? el('div', {
                              style: {
                                  display: 'flex',
                                  fontSize: 30,
                                  color: MUTED,
                                  lineHeight: 1.4,
                                  maxWidth: 940,
                              },
                              children: card.subtitle,
                          })
                        : null,
                ].filter(Boolean),
            }),
            el('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: `1px solid ${LINE}`,
                    paddingTop: 28,
                    fontSize: 24,
                    color: MUTED,
                },
                children: [
                    el('div', { style: { display: 'flex', color: ACCENT }, children: 'kubermeister.dev' }),
                    el('div', {
                        style: { display: 'flex', marginLeft: 'auto' },
                        children: 'macOS · Windows · Linux',
                    }),
                ],
            }),
        ],
    });

export async function renderCard(card: Card): Promise<Buffer> {
    const svg = await satori(tree(card) as never, { width: 1200, height: 630, fonts: FONTS });
    return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
}
