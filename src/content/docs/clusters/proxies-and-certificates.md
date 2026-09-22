---
title: Proxies and certificate authorities
description: Using Kubermeister behind a corporate HTTP proxy and with a private certificate authority — how HTTPS_PROXY, proxy-url and a CA bundle are applied.
sidebar:
  order: 3
---

Kubermeister proxies exactly what a `kubectl` in the same shell would, and adds a certificate
authority rather than replacing the ones already trusted.

## Proxies

The settings are applied per cluster, onto the loaded kubeconfig, which is the one place every path
already reads — the HTTP dispatcher behind ordinary calls and the agent behind the exec and
port-forward websockets alike.

In order of precedence:

1. **Settings → Network.** A proxy of your own, a bypass list standing in for `NO_PROXY`, or _no
   proxy at all_. This overrides everything below.
2. **`proxy-url` in the kubeconfig entry.** A cluster that carries one keeps it in every mode.
3. **`HTTPS_PROXY` and `HTTP_PROXY`** from the environment, read per scheme with no cross-scheme
   fallback. The app adopts your login shell's environment at startup, so these are found even when
   the app was launched from the Dock.

Loopback addresses are never proxied.

## Certificate authorities

A CA bundle set in **Settings → Network** is **added** to what is already trusted, never substituted
for it — the way `NODE_EXTRA_CA_CERTS` behaves. The cluster's own authority, or the system roots when
it has none, is concatenated with your bundle.

The path is chosen through a native file dialog; the interface never takes a typed path.

A bundle that cannot be read changes nothing about the connection and is reported by the network
startup check, so you find out rather than silently connecting with a different trust store than you
think.

## When either changes

Changing the proxy or the bundle ends every stream and reloads the kubeconfig, because both are read
once, when it loads. Open shells and forwards end with an error naming the reason.
