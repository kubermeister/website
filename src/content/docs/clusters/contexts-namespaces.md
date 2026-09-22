---
title: Contexts and namespaces
description: Switching Kubernetes contexts and namespaces in Kubermeister, what happens to open sessions, and why a switch resets every screen.
sidebar:
  order: 2
---

The two controls in the top bar decide what every screen shows.

## Switching context

A context switch is a change of cluster, and the app treats it as one:

- **Every cluster query is reset**, not merely refetched. Screens go back to loading rather than
  showing the previous cluster's rows while writes already reach the new one.
- **A detail page closes back to its list**, because the object it names belongs to the cluster you
  are leaving.
- **Every stream ends** — port forwards, shells, log follows, drains — with an error naming the
  reason. They all share one live connection, so none of them can outlive it.
- **The informers stop**, and the metrics sampler resets, so charts start again from now.
- **The startup checks re-run**, so any notice in the top bar describes the context you are on.

None of this touches your kubeconfig.

## Switching namespace

Selecting a namespace narrows every namespaced screen to it. Selecting **All namespaces** widens
them.

The namespace selector lists names only. It never counts pods, because on a busy cluster one such
count is megabytes on every refresh.

Internally, "All namespaces" is the absence of a namespace — the label is the interface's, never a
value handed to a cluster call. It is answered from the app's own memory rather than the cluster, so
it is known immediately and stays known while the cluster is down.

## All namespaces and timeouts

A namespaced list under **All namespaces** is asking for a fraction of the cluster multiplied by the
number of namespaces. When one times out, the app says so and points at the namespace selector.
Cluster-scoped lists never give that advice, since narrowing does not apply to them.

## Namespaces have a screen of their own

A namespace does nothing by itself, so its detail page is a roll-up: what lives in it, with each
count linking to that kind's list; the quotas and limit ranges it carries; and the usage of its pods
against what they requested.

Namespaces can be created and deleted through the ordinary write path, and deleting one asks you to
type its name — it takes every object inside it with it.
