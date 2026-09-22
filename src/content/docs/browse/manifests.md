---
title: Manifests and YAML
description: Reading a Kubernetes object as YAML in Kubermeister, editing and replacing it safely with resourceVersion, and creating objects from a file or a template.
sidebar:
  order: 3
---

Every object has a **Manifest** tab showing it as the cluster holds it. Manifests are serialised with
plain YAML rather than the client library's typed dump, which drops fields it does not know about —
so what you see is the whole object, including anything a controller or a CRD put there.

## Editing

Editing the manifest and applying it is a **replace**, and a replace must carry the
`metadata.resourceVersion` the object was read with. That is what turns a concurrent change into a
visible conflict instead of a silent overwrite of somebody else's edit.

The editor also pins what it was opened on: a manifest naming a different kind, name or namespace is
refused rather than applied somewhere unexpected.

## Creating

The Create screen takes a manifest and applies it through the same path. The API path is derived from
the manifest's own `apiVersion` and `kind`, so a custom resource rides exactly the same call as a
Pod.

Namespace rules are enforced at the boundary:

- A manifest that names no namespace takes the **active** one.
- With **All namespaces** selected and no namespace in the manifest, the write is refused rather than
  left to a client-library default.
- A kind the app does not recognise is asked of API discovery to learn whether it is namespaced.

## Opening a manifest from a file

A `.yaml` file dropped anywhere on the window, or picked through **File → Open**, is staged and opens
the Create screen on it. A file only ever enters the app through the OS — a native dialog, or a real
drag-and-drop — never through a path the interface chose. Both a dropped file and a template ask
before they replace an editor you have already typed in.

## Secrets

A Secret's **Manifest** tab shows the object as the cluster holds it, values included, because that
is what editing it requires. Everywhere else, values are handled one key at a time — see
[security](/docs/reference/security/).
