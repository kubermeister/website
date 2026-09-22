---
title: Helm releases
description: Browsing, rolling back and uninstalling Helm releases in Kubermeister — read from the release Secrets Helm itself writes, so the Helm CLI can still read them afterwards.
sidebar:
  order: 1
---

Helm has no API of its own. A release is a **Secret** of type `helm.sh/release.v1` whose `release`
field is base64(gzip(json)), base64'd again by the API, with one Secret per revision named
`sh.helm.release.v1.<name>.v<n>`.

Kubermeister decodes those Secrets. That is the whole mechanism, and it is why the app needs no Helm
binary and no Tiller-like component.

## What you see

Releases in the selected namespace, each with its chart, app version, status and revision. Open one
for its revision history, its values, and the manifest each revision rendered.

## Rolling back

A rollback re-applies the target revision's objects, removes what that revision never had, and then
keeps Helm's own bookkeeping straight: the same Secret names, labels and status words Helm uses.

It records the result as a **new** revision. Helm numbers forward and never rewinds, so a rollback
from revision 5 to revision 3 produces revision 6, and revision 5 is marked superseded.

The point of all that care is simple: a release this app rolls back is still one the Helm CLI can
read and act on.

## Uninstalling

An uninstall deletes the current revision's objects and then either forgets the history or marks it
uninstalled, matching what `helm uninstall` does with and without `--keep-history`.

## Objects Helm is told to keep

An object annotated `helm.sh/resource-policy: keep` is never deleted by a rollback or an uninstall,
and the app counts them back to you so you know what was left behind.

## Chart repositories

Configured chart repositories are a fact about your install, not about the cluster you happen to be
pointed at, so they live in app settings and survive a context switch. See
[settings](/docs/reference/settings/#chart-repositories).
