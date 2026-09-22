---
title: Connecting to a cluster
description: How Kubermeister reads your kubeconfig, how it authenticates with exec credential plugins for EKS, GKE and AKS, and what to do when a kubeconfig will not load.
sidebar:
  order: 1
---

Kubermeister reads your kubeconfig and treats it as **read-only**. Switching context or namespace in
the app changes the app's own memory and settings — never the file on disk. Nothing you do here will
surprise the `kubectl` in your terminal.

## Where it looks

The default location, unless you point it somewhere else in **Settings → Cluster**. The path is
chosen through a native file dialog: the app never takes a path typed into the interface.

## Authentication

There is no dependency on `kubectl`. The client library handles exec credential plugins itself, so a
kubeconfig written by `aws eks update-kubeconfig`, `gcloud container clusters get-credentials` or
`az aks get-credentials` works as it does in a terminal.

Two details make that work outside a terminal:

- **Your login shell's PATH is adopted at startup.** Launching from Finder or the Dock otherwise
  inherits a bare `/usr/bin:/bin:/usr/sbin:/sbin`, and a kubeconfig that names its plugin by bare
  command — `aws`, `gke-gcloud-auth-plugin` — would not find it.
- **A failing plugin is reported as a failing plugin.** If it is missing or exits non-zero you get an
  authorisation error naming it, not the plugin's stderr under a generic failure.

## When the kubeconfig will not load

A kubeconfig that will not parse never blocks the app. The window opens, and the top bar carries a
notice with three ways out: try again, choose a different kubeconfig, or fall back to the default.

Entries that are individually broken are dropped rather than failing the whole file — an entry with
no name, an empty `cluster:`, or a cluster with no server — which is the same tolerance `kubectl`
has. Every other context in the file keeps working.

## When a context is unusable

A file can parse and still contain a context whose cluster or user entry is missing, because it was
filtered out or removed while the context stayed. The library will happily switch to it and then fail
every call with "No active cluster!".

Kubermeister names the missing entry instead. The context selector marks it, the startup check
reports it, and the notice reads **Context unusable** with a hint to switch. Switching context re-runs
the checks, so the notice always describes where you are now.

## Read timeouts

Every cluster call has a ceiling, 60 seconds by default, set in **Settings → Data**. When a call hits
it the app both reports the timeout _and_ aborts the request, so a screen that polls cannot pile up
requests and credential-plugin processes against a cluster that never answers.

A timed-out list points you at Settings, because how long your cluster may take is your call, not the
app's.

## Next

[Contexts and namespaces](/docs/clusters/contexts-namespaces/) ·
[Proxies and certificates](/docs/clusters/proxies-and-certificates/)
