---
title: Settings
description: Every Kubermeister setting — kubeconfig, read timeout, refresh cadence, log buffer, proxy, certificate authority, update mode and chart repositories.
sidebar:
  order: 1
---

Settings live in a versioned JSON file in the app's own user-data directory. Older versions are
migrated forward on load, and one the app does not recognise falls back to defaults rather than
failing to start.

Open them from the sidebar footer, or with `⌘,` on macOS.

## General

- **Hold to quit** — on macOS, whether `⌘Q` must be held. On by default, because `⌘Q` sits one key
  away from `⌘W` and quitting ends every port forward, shell, log follow and drain at once. See
  [quitting](#quitting).

## Data

- **Read timeout** (60 s by default) — the ceiling on every cluster call. It both fails the call and
  **aborts** it, so a screen that polls cannot pile up requests against a cluster that never answers.
- **Refresh interval** — the poll cadence for the few things that are polled rather than watched.
- **Log buffer lines** — how many lines a log console keeps. Read live, so raising it trims
  differently from the next batch on rather than restarting a follow.

## Cluster

- **Kubeconfig** — chosen through a native file dialog. The interface can never set a file path
  itself.

## Network

- **Proxy** — a proxy of your own, a bypass list standing in for `NO_PROXY`, or no proxy at all.
  Overrides `HTTPS_PROXY`/`HTTP_PROXY` and the kubeconfig's `proxy-url`.
- **Certificate authority bundle** — added to what is already trusted, never substituted for it.
  Also chosen through a dialog.

Changing either ends every stream and reloads the kubeconfig, since both are read once, when it
loads. See [proxies and certificates](/docs/clusters/proxies-and-certificates/).

## Updates

- **Mode** — `download` (the default), `check`, or `off`.
- **Check interval** — 4 hours by default, after a short delay at launch.

See [updates](/docs/reference/updates/).

## Chart repositories

Chart sources are a fact about your install, not about the cluster you are pointed at, so they are
app-level and a context switch leaves them alone.

Three things are kept in step when you add one: the entry in settings, the cached index, and the
credential.

- **A source is read before it is recorded.** An address that answers with no index is refused when
  you type it, rather than reported as broken from then on. A credential stored for an add that then
  failed is taken back out of the keychain.
- **A password never reaches the settings file.** It is sealed with the OS secret store — Keychain,
  libsecret or DPAPI — and only the ciphertext is written. A system with no secret store is told so
  rather than written to in the clear, and a credential the local key can no longer open reads as
  absent.
- **A password is refused for a plaintext `http` address.** That repository is still usable
  anonymously.
- An **OCI registry** publishes no index, so it is verified the way `helm registry login` does. Its
  row shows no chart count, because there is nothing to count.

## Theme

The theme is stored separately from these settings, because it has to apply before the window's first
paint.

## Quitting

On macOS `⌘Q` is held rather than pressed, unless you turn that off. Only the keystroke is guarded —
the menu item, an update's restart, and a shutdown the OS asks for each quit at once, since each is
already a deliberate act.

The guard fails open: with no window, or a window that never finished loading, `⌘Q` quits
immediately rather than waiting on a hint nobody can see.
