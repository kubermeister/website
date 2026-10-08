/** The landing page's feature grid. Each entry is a thing the app does, not a thing it is. */
export type Feature = {
    readonly title: string;
    readonly body: string;
    /** A doc page that explains it, so the landing page links into the docs rather than dead-ending. */
    readonly href: string;
    readonly icon: IconName;
};

export type IconName = 'activity' | 'terminal' | 'scroll' | 'plug' | 'helm' | 'chart' | 'search' | 'file' | 'bell';

export const FEATURES: readonly Feature[] = [
    {
        title: 'Logs that open following',
        body: 'A Logs tab starts live. Narrow by regex or highlight in place, pick a container and a time window, and download that window’s log straight from the API server.',
        href: '/docs/sessions/logs/',
        icon: 'scroll',
    },
    {
        title: 'A shell that belongs to its pod',
        body: 'The exec session lives in the pod’s own Shell tab and ends when the tab does, so a terminal is never left attached to a cluster nobody is watching.',
        href: '/docs/sessions/shell/',
        icon: 'terminal',
    },
    {
        title: 'Port forwards that survive a rollout',
        body: 'Forward to a Service and each connection goes to a ready endpoint, so a deploy doesn’t kill the tunnel. Every forward is listed and stopped from the top bar.',
        href: '/docs/sessions/port-forwarding/',
        icon: 'plug',
    },
    {
        title: 'Lists that are already live',
        body: 'Screens watch the API server instead of polling it, and only the rows in view are rendered. A list costs the size of your window, not the size of your cluster.',
        href: '/docs/browse/lists/',
        icon: 'activity',
    },
    {
        title: 'Helm releases, read properly',
        body: 'History, rollback and uninstall, decoded from the Secrets Helm itself writes. A release this app rolls back is still one the Helm CLI can read.',
        href: '/docs/operations/helm/',
        icon: 'helm',
    },
    {
        title: 'Alerts derived from the cluster',
        body: 'Pending and failed pods, crash loops, image pull failures, failed Jobs and stuck claims, found from field selectors and kubelet events rather than by reading every pod.',
        href: '/docs/operations/alerts/',
        icon: 'bell',
    },
    {
        title: 'Your CRDs, with their own columns',
        body: 'Custom resources show the columns their definition declares, the ones kubectl get -o wide prints, and edit like any built-in kind.',
        href: '/docs/browse/custom-resources/',
        icon: 'search',
    },
    {
        title: 'Usage without a stack to run',
        body: 'Charts for the cluster, nodes, Deployments and pods, sampled from metrics-server while the app is open. No metrics-server means empty charts, not an error page.',
        href: '/docs/operations/metrics/',
        icon: 'chart',
    },
    {
        title: 'Manifests, describe and exports',
        body: 'Read any object as YAML, copy a structured describe, and export a selection as one file, either as the cluster holds it or cleaned up to apply elsewhere.',
        href: '/docs/browse/manifests/',
        icon: 'file',
    },
] as const;
