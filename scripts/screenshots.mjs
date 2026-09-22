/**
 * Captures the screenshots the site uses, from the real application driven against a throwaway
 * cluster — the same k3s container and seed fixtures the app's end-to-end suite uses, so nothing
 * here ever touches a real cluster or the developer's kubeconfig.
 *
 *   node scripts/screenshots.mjs
 *
 * Requires Docker, and a built app in the sibling checkout (`npm run build` there). The app's own
 * devDependencies provide Playwright and Testcontainers; this repository does not carry them, since
 * it needs them only for this one script. Point KM_APP_REPO elsewhere if your checkout is not at
 * ../kubermeister.
 */
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('..', import.meta.url));
const APP = resolve(process.env.KM_APP_REPO ?? join(HERE, '..', 'kubermeister'));
const OUT = join(HERE, 'src', 'assets', 'screenshots');

if (!existsSync(join(APP, 'out', 'main', 'index.mjs'))) {
    console.error(`No built app at ${APP}/out. Run \`npm run build\` in the app checkout first.`);
    process.exit(1);
}

const appRequire = createRequire(join(APP, 'package.json'));
const { _electron: electron } = appRequire('@playwright/test');
const { K3sContainer } = appRequire('@testcontainers/k3s');

const CONTEXT = 'km-shots-ctx';
const NAMESPACE = 'km-e2e';
const KUBECONFIG = join(HERE, '.screenshots.kubeconfig');

/** 2x of a 1600x1000 window: big enough to read when a page shows it half-width. */
const WIDTH = 1600;
const HEIGHT = 1000;

/**
 * The end-to-end seed exists to be asserted on, not to be photographed: its one deployment prints a
 * single marker line. These extra workloads give the log console, the pod list and the revision
 * history something real to show, and they live here rather than in the app's fixtures so no test
 * starts depending on them.
 */
const DEMO = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: ${NAMESPACE}
  labels: { app: api, tier: frontend }
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  template:
    metadata:
      labels: { app: api, tier: frontend }
    spec:
      containers:
        - name: api
          image: busybox:1.36
          resources:
            requests: { cpu: 10m, memory: 16Mi }
            limits: { cpu: 200m, memory: 64Mi }
          command: ['/bin/sh', '-c']
          args:
            - |
              paths="/v1/orders /v1/orders/4821 /v1/customers /healthz /v1/shipments /v1/orders/search"
              while true; do
                for p in $paths; do
                  ms=$(( (RANDOM % 180) + 4 ))
                  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) INFO  http request completed method=GET path=$p status=200 duration=\${ms}ms"
                  sleep 1
                done
                echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) WARN  upstream slow service=billing latency=812ms retry=1"
                sleep 1
                echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) INFO  cache refreshed entries=1284 evicted=17"
                sleep 1
              done
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker
  namespace: ${NAMESPACE}
  labels: { app: worker, tier: backend }
spec:
  replicas: 2
  selector: { matchLabels: { app: worker } }
  template:
    metadata:
      labels: { app: worker, tier: backend }
    spec:
      containers:
        - name: worker
          image: busybox:1.36
          resources:
            requests: { cpu: 10m, memory: 16Mi }
          command: ['/bin/sh', '-c']
          args:
            - |
              while true; do
                echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) INFO  job processed queue=exports took=$(( (RANDOM % 900) + 40 ))ms"
                sleep 2
              done
`;

const kubectl = (id, args, input) =>
    execFileSync('docker', ['exec', '-i', id, 'kubectl', ...args], { encoding: 'utf8', input });

async function startCluster() {
    console.log('[shots] starting k3s…');
    // metrics-server is left enabled, unlike the end-to-end suite, so the usage charts on the
    // summary and node screens have something real to draw.
    const started = await new K3sContainer('rancher/k3s:v1.36.4-k3s1')
        .withCommand(['server', '--disable=traefik', '--disable=servicelb'])
        .start();

    writeFileSync(KUBECONFIG, started.getKubeConfig().replace(/\bdefault\b/g, CONTEXT));

    const seed = join(APP, 'tests', 'e2e', 'fixtures', 'seed.yaml');
    const custom = join(APP, 'tests', 'e2e', 'fixtures', 'seed-custom.yaml');
    kubectl(started.getId(), ['apply', '-f', '-'], readFileSync(seed, 'utf8'));
    kubectl(started.getId(), ['wait', '--for=condition=Established', '--timeout=60s', 'crd/widgets.km-e2e.test']);
    kubectl(started.getId(), ['apply', '-f', '-'], readFileSync(custom, 'utf8'));
    kubectl(started.getId(), ['apply', '-f', '-'], DEMO);
    kubectl(started.getId(), [
        '-n',
        NAMESPACE,
        'wait',
        '--for=condition=Available',
        '--timeout=180s',
        'deployment',
        '--all',
    ]);

    // A second revision, so the History tab and the revision comparison have two things to compare.
    kubectl(started.getId(), ['-n', NAMESPACE, 'set', 'env', 'deployment/api', 'RELEASE=2026.9.2']);
    kubectl(started.getId(), ['-n', NAMESPACE, 'rollout', 'status', 'deployment/api', '--timeout=120s']);

    // metrics-server needs a couple of scrape intervals before it answers for pods.
    console.log('[shots] waiting for metrics-server to have samples…');
    for (let attempt = 0; attempt < 30; attempt += 1) {
        try {
            kubectl(started.getId(), ['top', 'pods', '-n', NAMESPACE]);
            break;
        } catch {
            await new Promise((done) => setTimeout(done, 5000));
        }
    }
    return started;
}

async function launch() {
    const userData = mkdtempSync(join(tmpdir(), 'km-shots-'));
    writeFileSync(
        join(userData, 'settings.json'),
        JSON.stringify({
            version: 1,
            session: { lastContext: CONTEXT, lastNamespace: NAMESPACE, restoreOnLaunch: true },
            connection: { kubeconfigPath: KUBECONFIG },
        }),
    );

    const app = await electron.launch({
        cwd: APP,
        args: ['out/main/index.mjs', `--force-device-scale-factor=2`],
        env: {
            ...process.env,
            KUBERMEISTER_USER_DATA: userData,
            KUBECONFIG,
            KUBERMEISTER_SHOW_INACTIVE: '1',
        },
    });

    const window = await app.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    await app.evaluate(
        ({ BrowserWindow }, size) => {
            const [first] = BrowserWindow.getAllWindows();
            first?.setContentSize(size.width, size.height);
        },
        { width: WIDTH, height: HEIGHT },
    );
    await window.getByTestId('app-shell').waitFor({ timeout: 60_000 });
    return { app, window, userData, startedAt: Date.now() };
}

/** Navigate by hash rather than by clicking: the router is hash-based, so this cannot mis-click. */
async function go(window, hash) {
    await window.evaluate((target) => {
        window.location.hash = target;
    }, hash);
    await window.waitForTimeout(1500);
}

async function tab(window, name) {
    // Rail items carry a count badge, so their accessible name is "History 2" rather than "History":
    // match on the text they contain instead of on an exact name.
    for (const role of ['tab', 'button', 'link']) {
        const control = window.getByRole(role).filter({ hasText: name }).first();
        if (await control.count()) {
            await control.click();
            await window.waitForTimeout(2500);
            return true;
        }
    }
    console.warn(`[shots] no "${name}" tab found; capturing the page as it is`);
    return false;
}

async function shoot(window, name) {
    await window.waitForTimeout(800);
    await window.screenshot({ path: join(OUT, `${name}.png`) });
    console.log(`[shots] wrote ${name}.png`);
}

const ONLY =
    process.env.KM_SHOTS?.split(',')
        .map((name) => name.trim())
        .filter(Boolean) ?? null;
const wanted = (name) => !ONLY || ONLY.includes(name);

const SHOTS = [
    { name: 'pods', hash: '#/workloads/pods' },
    { name: 'logs', hash: `#/workloads/deployments/${NAMESPACE}/api`, tab: 'Logs', settle: 8000 },
    { name: 'rollout', hash: `#/workloads/deployments/${NAMESPACE}/api`, tab: 'History', settle: 2000 },
    { name: 'helm', hash: '#/addons/releases' },
];

/** How long to leave the summary open so its 12-second samples actually draw a line. */
const CHART_FILL_MS = 150_000;

let cluster;
let launched;
try {
    cluster = await startCluster();
    launched = await launch();
    const { window } = launched;

    // Open the summary first and leave it: the sampler starts when a reader asks for it, so the
    // chart is only worth photographing once it has collected a few minutes of samples.
    await go(window, '#/overview/summary');

    for (const shot of SHOTS.filter((shot) => wanted(shot.name))) {
        await go(window, shot.hash);
        if (shot.settle) await window.waitForTimeout(shot.settle);
        if (shot.tab) await tab(window, shot.tab);
        await shoot(window, shot.name);
    }

    // The shell execs into a pod, so it runs against one that is known to be up, and a command is
    // typed so the terminal shows a session rather than a bare prompt.
    // The drain dialog, not a drain: the plan it shows is the point, and a one-node cluster has
    // nowhere to move the pods to anyway.
    if (wanted('drain')) {
        await go(window, '#/overview/nodes');
        const nodeRow = window
            .getByRole('link')
            .filter({ hasText: /^[0-9a-f]{6,}/ })
            .first();
        if (await nodeRow.count()) {
            await nodeRow.click();
            await window.waitForTimeout(3000);
            const drain = window.getByRole('button', { name: /drain/i }).first();
            if (await drain.count()) {
                await drain.click();
                await window.waitForTimeout(3000);
            } else {
                console.warn('[shots] no Drain button on the node page');
            }
            await shoot(window, 'drain');
            await window.keyboard.press('Escape');
        } else {
            console.warn('[shots] no node row found; skipping the drain screenshot');
        }
    }

    if (wanted('shell')) {
        await go(window, '#/workloads/pods');
        const podRow = window.getByRole('link').filter({ hasText: 'api-' }).first();
        if (await podRow.count()) {
            await podRow.click();
            await window.waitForTimeout(2500);
            if (await tab(window, 'Shell')) {
                await window.waitForTimeout(4000);
                const terminal = window.locator('.xterm-screen, .xterm').first();
                if (await terminal.count()) await terminal.click();
                await window.waitForTimeout(500);
                await window.keyboard.type('ps -o pid,args');
                await window.keyboard.press('Enter');
                await window.waitForTimeout(1200);
                await window.keyboard.type('cat /etc/hosts');
                await window.keyboard.press('Enter');
                await window.waitForTimeout(1500);
                await shoot(window, 'shell');
            }
        } else {
            console.warn('[shots] no api pod row found; skipping the shell screenshot');
        }
    }

    if (wanted('overview')) {
        const remaining = Math.max(0, CHART_FILL_MS - (Date.now() - launched.startedAt));
        if (remaining > 0) {
            console.log(`[shots] waiting ${Math.round(remaining / 1000)}s for the usage chart to fill…`);
            await window.waitForTimeout(remaining);
        }
        await go(window, '#/overview/summary');
        await window.waitForTimeout(4000);
        await shoot(window, 'overview');
    }
} finally {
    await launched?.app.close().catch(() => {});
    await cluster?.stop().catch(() => {});
}

console.log('[shots] done');
