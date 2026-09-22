---
title: Troubleshooting
description: Fixing Kubermeister connection problems — kubeconfig errors, unusable contexts, credential plugin failures, timeouts and empty list screens.
sidebar:
  order: 4
---

## The top bar says the kubeconfig will not load

The file did not parse. The app still opens — the notice carries three ways out: **try again**, **choose
a different kubeconfig**, or **use the default**.

Individually broken entries are dropped rather than failing the whole file, so if the whole file is
refused, the problem is structural. The notice names the failure; the underlying parser message
quotes the file, so it is not shown.

## The top bar says "Context unusable"

The file parsed, but this context points at a cluster or user entry that is not there — filtered out
as invalid, or removed while the context stayed behind.

The app names the missing entry, the context selector marks it, and the fix is to switch to a context
that is complete, or repair the file.

## "Credential plugin failed" or an authorisation error naming a command

Your kubeconfig authenticates through an exec credential plugin — `aws`, `gke-gcloud-auth-plugin`,
`az` — and it is missing or exited non-zero.

The app adopts your **login shell's** PATH at startup, so a plugin that works in your terminal
normally works here too. If it does not:

1. Check the plugin runs in a fresh login shell, not just in your current one.
2. Check it is installed for the user running the app.
3. If you installed it after launching the app, restart the app so it re-reads the environment.

## Everything times out

Cluster calls have a ceiling, 60 seconds by default, in **Settings → Data**. A timed-out screen points
you there, because how long your cluster may take is your call.

A _connect_ failure is reported as **unreachable** rather than a timeout, and arrives faster — that
distinction usually tells you whether the cluster is slow or simply not there.

## A namespaced list times out under All namespaces

One namespace is a fraction of the cluster; every namespace is the whole thing. Pick a namespace from
the selector. The app says exactly this when it happens, and cluster-scoped screens never give that
advice because narrowing does not apply to them.

## A list is empty but kubectl shows rows

Check the namespace selector first — a list asks for its kind _in its namespace_, and the search box
only narrows what is already there.

If the kind is a custom resource, check that the definition is served and that its instances are in
the namespace you are looking at.

## Behind a proxy, nothing connects

See [proxies and certificates](/docs/clusters/proxies-and-certificates/). The short version:
`HTTPS_PROXY` and `HTTP_PROXY` are read per scheme with no cross-scheme fallback, a kubeconfig's
`proxy-url` always wins for that cluster, loopback is never proxied, and **Settings → Network**
overrides all of it.

A CA bundle that cannot be read changes nothing about the connection and is reported by the network
startup check — so if certificate errors persist after setting one, check that report.

## A shell, forward or log follow ended on its own

Every stream shares one live connection. Switching context, changing the kubeconfig, or changing the
proxy or CA bundle ends them all, with an error naming the reason.

## Still stuck

Open an issue at
[github.com/kubermeister/kubermeister/issues](https://github.com/kubermeister/kubermeister/issues),
or ask in [Discussions](https://github.com/kubermeister/kubermeister/discussions).
