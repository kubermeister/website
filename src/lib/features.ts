/** The landing page's feature grid. Each entry is a thing the app does, not a thing it is. */
export type Feature = {
    readonly title: string;
    readonly body: string;
    /** A doc page that explains it, so the landing page links into the docs rather than dead-ending. */
    readonly href: string;
    readonly icon: IconName;
};

export type IconName =
    | 'activity'
    | 'terminal'
    | 'scroll'
    | 'plug'
    | 'helm'
    | 'node'
    | 'shield'
    | 'chart'
    | 'diff'
    | 'search'
    | 'file'
    | 'bell';

export const FEATURES: readonly Feature[] = [
    {
        title: 'Lists that are already live',
        body: 'Screens watch the API server instead of polling it. One informer serves every screen on the same kind, and rows are virtualised, so a list costs the size of your window rather than the size of your cluster.',
        href: '/docs/browse/lists/',
        icon: 'activity',
    },
    {
        title: 'Logs that open following',
        body: 'A Logs tab starts live, because a log is opened to see what is happening now. Narrow by regex or highlight in place, pick a container and a time window, and download the whole log from the API server rather than the buffer on screen.',
        href: '/docs/sessions/logs/',
        icon: 'scroll',
    },
    {
        title: 'A shell that belongs to its pod',
        body: 'The exec session lives in the pod’s own Shell tab: it opens when the tab does and ends with it, so a terminal is never left attached to a cluster nobody is looking at.',
        href: '/docs/sessions/shell/',
        icon: 'terminal',
    },
    {
        title: 'Port forwards that survive a rollout',
        body: 'Forward to a Service and the app resolves a ready endpoint per connection, so a deploy does not kill the tunnel. Every forward is listed and stopped from the top bar, wherever you started it.',
        href: '/docs/sessions/port-forwarding/',
        icon: 'plug',
    },
    {
        title: 'Helm releases, read properly',
        body: 'Releases, revision history, rollback and uninstall — decoded from the Secrets Helm itself writes, and written back the same way, so a release this app rolls back is still one the Helm CLI can read.',
        href: '/docs/operations/helm/',
        icon: 'helm',
    },
    {
        title: 'Node drains you can watch',
        body: 'Cordon a node, see exactly what a drain would do before it runs, then watch each pod go. Eviction honours PodDisruptionBudgets, and stopping leaves the node cordoned rather than half-drained silently.',
        href: '/docs/operations/nodes/',
        icon: 'node',
    },
    {
        title: 'Rollouts you can compare',
        body: 'Put two revisions of a pod template side by side, canonicalised so a difference on screen is one somebody made rather than one the API server filled in — then roll back with a JSON patch that actually undoes it.',
        href: '/docs/workloads/rollouts/',
        icon: 'diff',
    },
    {
        title: 'Usage without a stack to run',
        body: 'Charts for the cluster, each node, each workload and each pod, sampled from metrics-server while the app is open. No metrics-server means zero usage, never an error page.',
        href: '/docs/operations/metrics/',
        icon: 'chart',
    },
    {
        title: 'Alerts derived from the cluster',
        body: 'Pending and failed pods, crash loops and image pull failures, found through field selectors and the kubelet’s own events — never by reading every pod in the cluster.',
        href: '/docs/operations/alerts/',
        icon: 'bell',
    },
    {
        title: 'Your CRDs, with their own columns',
        body: 'Custom resources list with the additionalPrinterColumns their definition declares — the same columns kubectl get would print — and edit through the same path as any built-in kind.',
        href: '/docs/browse/custom-resources/',
        icon: 'search',
    },
    {
        title: 'Manifests, describe and exports',
        body: 'Read any object as YAML, describe pods and nodes as a structured document you can copy, and save a whole list selection as one file with the fields the server owns stripped out so it applies elsewhere.',
        href: '/docs/browse/manifests/',
        icon: 'file',
    },
    {
        title: 'Writes that fail closed',
        body: 'Every write carries the context the screen was rendered under and is refused if the app has switched since. Deleting a node or a CRD asks you to type its name. Nothing destructive is one click away.',
        href: '/docs/workloads/writing/',
        icon: 'shield',
    },
] as const;
