import type { Faq } from './schema';

/**
 * Comparison content. Claims about Kubermeister come from the app's own behaviour; claims about
 * another tool are kept to characteristics that are stable and easy for a reader to check for
 * themselves, because a comparison page that gets a rival's facts wrong is worth less than no page
 * at all. Anything version- or price-dependent is listed in `verify` rather than asserted here.
 */
export type Cell = { readonly km: string; readonly them: string };

export type Competitor = {
    readonly slug: string;
    readonly name: string;
    /** One phrase for what kind of tool it is, used in the intro sentence and the OG card. */
    readonly kind: string;
    readonly title: string;
    readonly description: string;
    /** An honest paragraph about the other tool, written as if its maintainers will read it. */
    readonly about: string;
    readonly rows: readonly { readonly feature: string; readonly cell: Cell }[];
    readonly pickThem: readonly string[];
    readonly pickKm: readonly string[];
    readonly faqs: readonly Faq[];
    /** Claims a maintainer should re-read before this page goes live. */
    readonly verify: readonly string[];
};

const kmShared = {
    live: 'Watch-based. One informer per kind and namespace feeds every screen showing it, so a list updates as the cluster changes instead of on a timer.',
    logs: 'Opens already following. Search narrows or highlights, regex and case toggles, and a workload tab merges every pod it owns into one stream.',
    shell: 'A shell lives in its pod’s tab: it opens with the tab and ends with it, so no terminal is left attached to a cluster nobody is watching.',
    forwards:
        'Forwards can target a Service and resolve a ready endpoint per connection, so a rollout does not end them. They are listed and stopped from the top bar.',
    helm: 'Releases, revision history, rollback and uninstall, decoded from the release Secrets Helm itself writes, so the CLI can still read what the app did.',
    drain: 'Cordon, and a drain that streams each pod as it goes, honours PodDisruptionBudgets through the eviction API and can be stopped mid-run.',
    writes: 'Every write carries the context the screen was rendered under and is refused if the app has since switched, so a stale tab can never act on the wrong cluster.',
    security:
        'Sandboxed renderer, context isolation on, Node integration off, Electron fuses flipped at package time, and a signed, notarized macOS build.',
};

export const COMPETITORS: readonly Competitor[] = [
    {
        slug: 'lens',
        name: 'Lens',
        kind: 'a commercial desktop Kubernetes IDE',
        title: 'Kubermeister vs Lens',
        description:
            'How Kubermeister compares with Lens Desktop: licensing and sign-in, live updates, logs, shells, port forwarding and Helm — with an honest note on when Lens is the better fit.',
        about: 'Lens Desktop is the best-known graphical Kubernetes client and the one most people mean by "a Kubernetes IDE". It is a polished, broad product with an extension catalog and a team behind it, and it is commercially licensed: using it involves a Lens ID, and organisations above a size threshold are expected to buy seats. That business model is the single biggest reason people go looking for something else, and it is the honest headline of this comparison — not a claim that Lens is bad software.',
        rows: [
            {
                feature: 'Licence',
                cell: {
                    km: 'Free and open source. No account, no sign-in, no telemetry gate.',
                    them: 'Commercial. A Lens ID is required, and paid seats apply above the free tier’s terms.',
                },
            },
            {
                feature: 'Live updates',
                cell: { km: kmShared.live, them: 'Live cluster views, refreshed by the app as objects change.' },
            },
            { feature: 'Logs', cell: { km: kmShared.logs, them: 'Pod log viewer with search and follow.' } },
            {
                feature: 'Shell into a pod',
                cell: { km: kmShared.shell, them: 'Built-in terminal, including a node shell and a bundled kubectl.' },
            },
            {
                feature: 'Port forwarding',
                cell: { km: kmShared.forwards, them: 'Port forwarding from the object that owns the port.' },
            },
            {
                feature: 'Helm',
                cell: { km: kmShared.helm, them: 'Helm chart browsing, install and release management.' },
            },
            { feature: 'Node drain', cell: { km: kmShared.drain, them: 'Cordon and drain from the node view.' } },
            {
                feature: 'Extensions',
                cell: {
                    km: 'None. The app ships what it does and adds no extension surface.',
                    them: 'An extension API and a catalog, which is its main advantage over everything here.',
                },
            },
            {
                feature: 'kubectl on PATH',
                cell: {
                    km: 'Not required. Exec credential plugins are run by the app itself, with the login shell’s PATH adopted at startup.',
                    them: 'Bundles its own kubectl for terminal use.',
                },
            },
            {
                feature: 'Hardening',
                cell: {
                    km: kmShared.security,
                    them: 'Electron app; hardening details are not published in the same form.',
                },
            },
        ],
        pickThem: [
            'You want an extension ecosystem, or you already depend on a specific Lens extension.',
            'Your organisation wants a vendor with a support contract behind the tool.',
            'You use its cluster catalog and management features across many clusters and teams.',
        ],
        pickKm: [
            'You want a graphical client with no account, no seat count and no licence to read.',
            'You want the app to stay out of the way: no bundled kubectl, no background agent installed into your clusters.',
            'You care that a write cannot land on the cluster you switched away from.',
        ],
        faqs: [
            {
                question: 'Is Kubermeister a drop-in replacement for Lens?',
                answer: 'For day-to-day work — browsing resources, reading logs, shelling into pods, forwarding ports, managing Helm releases and draining nodes — yes. If you rely on a Lens extension, there is no equivalent: Kubermeister has no extension API.',
            },
            {
                question: 'Does Kubermeister require an account?',
                answer: 'No. It reads your existing kubeconfig and nothing else. There is no sign-in, no licence key and no account of any kind.',
            },
            {
                question: 'Is Kubermeister free for commercial use?',
                answer: 'Yes. It is free and open source with no seat count and no revenue threshold.',
            },
        ],
        verify: [
            'Lens licensing terms and the current free-tier threshold — these change, and the page states them as a headline.',
            'Whether Lens still bundles kubectl and offers a node shell in the current release.',
        ],
    },
    {
        slug: 'openlens',
        name: 'OpenLens',
        kind: 'the open-source build of the Lens core',
        title: 'Kubermeister vs OpenLens',
        description:
            'How Kubermeister compares with OpenLens: what OpenLens actually is, why community builds drift, and what you get from a client designed as open source from the start.',
        about: 'OpenLens is the open-source part of Lens, built by the community from the Lens core repository without the proprietary pieces. It exists because people wanted Lens without the account, and it does that — but it is downstream of a product whose owner decides what stays in that core, which is why OpenLens builds, extensions and the instructions for getting one have been a moving target. That fragility, not the software, is the reason to consider an alternative.',
        rows: [
            {
                feature: 'Provenance',
                cell: {
                    km: 'Its own application. What ships is what is in its repository.',
                    them: 'A community build of an upstream a commercial product also draws from.',
                },
            },
            {
                feature: 'Releases',
                cell: {
                    km: 'Signed and notarized installers for macOS, Windows and Linux, published from tagged CI with checksums verified before the update feed is written.',
                    them: 'Community builds, which have varied in availability and in how they are distributed.',
                },
            },
            {
                feature: 'Updates',
                cell: {
                    km: 'Built-in updater with a mode you choose: check, download, or off.',
                    them: 'Depends on the build you installed.',
                },
            },
            { feature: 'Live updates', cell: { km: kmShared.live, them: 'Inherited from the Lens core.' } },
            { feature: 'Logs', cell: { km: kmShared.logs, them: 'Pod log viewer from the Lens core.' } },
            {
                feature: 'Shell into a pod',
                cell: {
                    km: kmShared.shell,
                    them: 'Terminal from the Lens core; some builds removed pieces that had moved out of it.',
                },
            },
            {
                feature: 'Helm',
                cell: { km: kmShared.helm, them: 'Helm support has depended on an extension in some builds.' },
            },
            {
                feature: 'Hardening',
                cell: { km: kmShared.security, them: 'Depends on the build and how it was packaged.' },
            },
        ],
        pickThem: [
            'You want the Lens interface specifically and are happy tracking community builds.',
            'You already have an OpenLens install and extensions that work for you.',
        ],
        pickKm: [
            'You want a client whose releases come from one place, signed, on a schedule.',
            'You do not want to find out from a forum thread where this month’s build lives.',
            'You want the app’s security posture written down and tested rather than inherited.',
        ],
        faqs: [
            {
                question: 'Is OpenLens the same as Lens?',
                answer: 'No. OpenLens is a community build of the open-source core that Lens Desktop is also built from. It lacks the proprietary parts, and what is in that core is decided upstream.',
            },
            {
                question: 'Why would I move from OpenLens to Kubermeister?',
                answer: 'Mostly for supply chain reasons: one publisher, signed and notarized installers, a built-in updater, and a hardening posture that is asserted in the repository’s own tests rather than inherited from a build you found.',
            },
        ],
        verify: [
            'The current state of OpenLens builds and where they are distributed — this has changed more than once.',
        ],
    },
    {
        slug: 'k9s',
        name: 'k9s',
        kind: 'a terminal UI for Kubernetes',
        title: 'Kubermeister vs k9s',
        description:
            'How Kubermeister compares with k9s: a terminal UI against a desktop app. Where k9s wins on speed and reach, and where a window wins on logs, diffs and long-running sessions.',
        about: 'k9s is excellent and this page is not going to pretend otherwise. It is a fast, keyboard-driven terminal UI that runs anywhere a terminal does — including over SSH on a jump host, which no desktop app can do. If you live in a terminal, k9s is probably already the right tool. The comparison is only interesting because some work is genuinely easier in a window: reading a long log beside the object that produced it, comparing two revisions of a pod template, or keeping four port forwards alive while you do something else.',
        rows: [
            {
                feature: 'Where it runs',
                cell: {
                    km: 'A desktop app on macOS, Windows and Linux. It needs a graphical session.',
                    them: 'Any terminal, including over SSH on a machine with no desktop at all.',
                },
            },
            {
                feature: 'Interaction',
                cell: {
                    km: 'Pointer and keyboard, with a command palette on ⌘K.',
                    them: 'Keyboard only, with a command mode — faster once learned.',
                },
            },
            {
                feature: 'Logs',
                cell: { km: kmShared.logs, them: 'Log view with follow and filtering, in the terminal’s own buffer.' },
            },
            {
                feature: 'Rollout diffs',
                cell: {
                    km: 'Two revisions of a pod template side by side, canonicalised so a difference on screen is one somebody made.',
                    them: 'Not a terminal UI’s strength; usually done with kubectl and a diff tool.',
                },
            },
            {
                feature: 'Port forwarding',
                cell: {
                    km: kmShared.forwards,
                    them: 'Port forwards managed from the pod view, tied to the running session.',
                },
            },
            {
                feature: 'Long-running sessions',
                cell: {
                    km: 'Forwards, shells and log follows survive navigation and are listed in the top bar.',
                    them: 'Tied to the terminal session; closing it ends them.',
                },
            },
            {
                feature: 'Metrics',
                cell: {
                    km: 'Charts from metrics-server samples taken while the app is open, per cluster, node, workload and pod.',
                    them: 'Usage columns from metrics-server, as numbers.',
                },
            },
            {
                feature: 'Resource cost',
                cell: { km: 'A desktop app — heavier than a terminal by definition.', them: 'A single small binary.' },
            },
        ],
        pickThem: [
            'You work over SSH, on a jump host, or on machines with no desktop session.',
            'You are faster with a keyboard-driven TUI than with any pointer, which many people are.',
            'You want one small binary and nothing installed.',
        ],
        pickKm: [
            'You want logs, the object, its events and its related objects visible at once.',
            'You compare rollouts, read describe output, and edit manifests with real syntax highlighting.',
            'You keep port forwards and shells running while you do other work.',
        ],
        faqs: [
            {
                question: 'Is a desktop app slower than k9s?',
                answer: 'To start, yes — a window costs more than a binary. In use the difference is not about the renderer: both watch the API server, and Kubermeister deliberately avoids whole-cluster pod listing for counts, which is the usual reason a graphical client feels slow on a busy cluster.',
            },
            {
                question: 'Can I use both?',
                answer: 'Most people do. They read your kubeconfig and change nothing about it, so switching between them costs nothing.',
            },
        ],
        verify: ['k9s port-forward and metrics behaviour in the current release.'],
    },
    {
        slug: 'headlamp',
        name: 'Headlamp',
        kind: 'a web and desktop Kubernetes UI',
        title: 'Kubermeister vs Headlamp',
        description:
            'How Kubermeister compares with Headlamp: an in-cluster web UI with a plugin system against a desktop-only client that installs nothing into your clusters.',
        about: 'Headlamp is a Kubernetes UI under the CNCF umbrella that runs either as a desktop app or in-cluster as a web UI, with a plugin system for extending it. Running in-cluster is a real capability Kubermeister does not have and does not want: it means a team can share one UI behind their own auth. The trade is that it becomes something you deploy, upgrade and secure. Kubermeister is the other shape — an app on your machine that adds nothing to the cluster.',
        rows: [
            {
                feature: 'Deployment',
                cell: {
                    km: 'A desktop app only. Nothing is installed into the cluster.',
                    them: 'Desktop app, or deployed in-cluster and served as a web UI.',
                },
            },
            {
                feature: 'Multi-user',
                cell: {
                    km: 'Single user, using your kubeconfig and your RBAC.',
                    them: 'Can be shared by a team behind cluster auth when run in-cluster.',
                },
            },
            {
                feature: 'Extensibility',
                cell: { km: 'None by design.', them: 'A plugin system, which is a core part of its design.' },
            },
            { feature: 'Live updates', cell: { km: kmShared.live, them: 'Live views over the API server.' } },
            { feature: 'Logs', cell: { km: kmShared.logs, them: 'Pod log viewer.' } },
            { feature: 'Shell into a pod', cell: { km: kmShared.shell, them: 'In-browser terminal.' } },
            { feature: 'Helm', cell: { km: kmShared.helm, them: 'Available through a plugin.' } },
            { feature: 'Node drain', cell: { km: kmShared.drain, them: 'Cordon and drain actions on nodes.' } },
            {
                feature: 'Attack surface',
                cell: {
                    km: 'Nothing exposed. The app talks to the API server as you do.',
                    them: 'An in-cluster deployment is one more thing to expose, authenticate and keep patched.',
                },
            },
        ],
        pickThem: [
            'You want one shared UI for a team rather than an app each person installs.',
            'You want to extend the UI with plugins of your own.',
            'You want a project governed under the CNCF.',
        ],
        pickKm: [
            'You want nothing added to the cluster — no deployment, no service, no ingress, no extra credential.',
            'You want desktop-native behaviour: OS dialogs, real keyboard handling and a terminal that behaves.',
            'You want long-running forwards and shells that belong to your machine, not to a browser tab.',
        ],
        faqs: [
            {
                question: 'Can Kubermeister run in-cluster as a web UI?',
                answer: 'No, and it is not planned. It is a desktop client: it uses your kubeconfig and your RBAC, and installs nothing into the cluster.',
            },
            {
                question: 'Does Kubermeister have plugins?',
                answer: 'No. Every feature ships in the app and is tested there. That is a deliberate limitation, not a roadmap item.',
            },
        ],
        verify: ['Headlamp’s current CNCF status and whether Helm support has moved out of a plugin.'],
    },
] as const;

export const competitor = (slug: string): Competitor => {
    const found = COMPETITORS.find((entry) => entry.slug === slug);
    if (!found) throw new Error(`unknown competitor: ${slug}`);
    return found;
};
