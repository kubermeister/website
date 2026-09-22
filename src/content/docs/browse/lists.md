---
title: Resource lists
description: How Kubermeister lists Kubernetes resources — live watches, virtualised rows, searching, choosing columns and grouping pods by node or workload.
sidebar:
  order: 1
---

A list screen asks the cluster for one thing: its kind, in its namespace. Everything else you can do
on the screen happens on the rows already there.

## They are live

Lists stay current through a watch, not a timer. One informer serves every screen watching the same
kind and namespace, so opening a second screen on the same list replays the informer's cache instead
of opening a second watch and re-listing. The informer stops when its last subscriber goes.

A kind whose definition a cluster need not have — volume snapshots, for instance — has no watch
source and is polled instead, at the cadence in **Settings → Data**.

## Searching

The search box narrows the rows on screen against the columns on screen. Nothing about it reaches the
API server, which is why it is instant and why it costs the cluster nothing.

## Columns

Which columns a list shows is a preference about this window, like the theme, so it is stored locally
per screen rather than in your cluster or an account.

Typical columns are the name, a status badge with a tone from that kind's own vocabulary, age, a
ready ratio, and usage meters where metrics-server provides them.

## Grouping

Pod rows carry the controller that owns them, which is what lets the cluster-wide pod list group by
node or by workload. Grouping interleaves heading rows into the virtualised list rather than nesting
tables, so it stays as cheap as the flat list.

## Why they stay fast

Only the rows in view are rendered. A list costs the size of your window, not the size of your
cluster, and that is locked in by a test that counts mounted cells rather than milliseconds.

There is also a rule about what is _not_ listed: **no screen lists the cluster's pods just to show a
count**. The Namespaces and Nodes lists carry no pod column, the cluster summary shows no pod total,
and the namespace selector shows names only. On a busy cluster, one such count is megabytes on every
refresh.

Pods are listed where a detail needs them, scoped to that object: a namespace's own screen, a node's
screen, a workload's screen. The Pods screen is the only whole-cluster pod list.

## Exporting a selection

Select rows and save them as **one YAML file**, one document per object. The export strips what the
server owns — `status`, the bookkeeping parts of `metadata`, and the owner reference naming a uid
only the originating cluster ever issued — so the file applies elsewhere. Where it lands is a native
save dialog's answer.
