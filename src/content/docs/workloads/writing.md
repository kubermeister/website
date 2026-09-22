---
title: Writing to the cluster
description: How Kubermeister creates, replaces, deletes and scales Kubernetes objects — context stamping, namespace rules, conflicts and the kinds that ask you to type their name.
sidebar:
  order: 4
---

Every write in the app goes through the same path and the same guards.

## Writes fail closed on targeting

Every write carries a **context stamp**: the context the screen was rendered under. The app compares
it with the context it is actually on and refuses a mismatch as a conflict.

That is what makes a stale tab safe. Rows left over from before a context switch cannot act on the
new cluster, no matter how long the window sat open.

## Namespace rules

- A delete or scale of a namespaced kind **must** name its namespace; a cluster-scoped kind must
  not.
- **The active namespace is never consulted for a destructive write.**
- A create or replace whose manifest names no namespace takes the active one — and with _All
  namespaces_ selected, is refused rather than guessed at.
- Single-object reads follow the same rule: with no namespace known, you get "not found" or an
  invalid-input error, never the first same-named object found across the cluster.

## Conflicts

A replace carries the `resourceVersion` it was read with. If somebody else changed the object in the
meantime, you get a conflict — not a silent overwrite.

## Kinds that ask you to type the name

Nodes, CustomResourceDefinitions, namespaces and other cluster-wide plumbing are treated as
dangerous. Deleting one asks you to type its name, and **those kinds have no bulk delete at all**,
because a checkbox column and an irreversible action do not belong on the same screen.

## Errors

Every rejection surfaces as a toast naming what went wrong. Classified failures — unauthorised, not
found, conflict, timeout, unreachable, invalid — read as themselves rather than as a generic
failure.
