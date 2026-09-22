---
title: Security
description: What Kubermeister can reach, what it never does, how Secrets are handled, and how the desktop build is hardened and signed.
sidebar:
  order: 2
---

## What it talks to

Your Kubernetes API server, and GitHub for update checks. That is the list.

There is no backend, no account, no telemetry service and no analytics. Nothing about your clusters
leaves your machine.

## What it uses to get in

Your kubeconfig, read-only. Switching context or namespace changes the app's memory and its own
settings, never the file. The app has exactly your permissions — it authenticates as you and your
RBAC applies unchanged.

## What it installs in your cluster

Nothing. No deployment, no service, no agent, no service account, no CRD.

## What it deliberately cannot do

- It attaches **no debug container**.
- It runs **no privileged pod** on a node.
- It carries **no files** across the exec channel.

`kubectl debug` and `kubectl cp` are where those belong. The app is not a way around your RBAC.

## Secrets

A Secret's values never cross into the interface as a map:

- The entries call returns **key names with a fixed mask**.
- A reveal or a copy asks for the **single key** it needs.
- A revealed value is held on its own, never in the query cache. It **re-masks itself on a timer**
  and goes when you leave the page.
- A **copy never renders the value at all** — it goes to the clipboard without appearing on screen.

The Manifest tab is the exception, and shows the object as the cluster holds it, because that is what
editing it requires.

## Renderer hardening

The window is hardened and that is never relaxed:

- `sandbox` on, `contextIsolation` on, `nodeIntegration` off.
- Window-open and navigation handlers route only `http:` and `https:` URLs to your OS browser and
  **deny everything else**.
- The preload bridge imports exactly one file, which imports nothing, because a sandboxed preload
  cannot require anything but Electron built-ins.
- Every IPC channel is declared with schemas and validated **in both directions**.
- A file only enters the app through the OS — a native dialog, or a real drag-and-drop. A path the
  interface named would be a file it chose to have read.

A build-time check fails the build if anything else ever appears in the preload bundle.

## Build hardening

Electron fuses are flipped in the binary at package time and read before any JavaScript runs:

- `runAsNode`, `NODE_OPTIONS` and the inspect arguments are **off**, so the signed app cannot be
  started as a plain Node binary or have a script preloaded into it;
- `onlyLoadAppFromAsar` and the embedded ASAR integrity check are **on**.

macOS builds are Developer ID signed and notarized.

## Releases

Installers carry their version in the file name, so a new build never overwrites the files a live
update feed points at. Each asset is uploaded on its own and read back to verify its size and
checksum before the feed is written, and any failure leaves the previous release complete.

## Reporting a problem

If you believe you have found a security issue, please report it through the repository's security
advisories rather than a public issue.
