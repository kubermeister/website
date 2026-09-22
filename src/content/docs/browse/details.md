---
title: Detail pages, events and describe
description: The Kubermeister detail layout — overview, events, labels and annotations, and the structured describe output for pods and nodes.
sidebar:
  order: 2
---

Every kind's detail page has the same shape: a header naming the object, over a left rail of tabs
grouped into **Observe**, **Inspect** and **Connect**.

## Overview

The properties that matter for that kind, as labelled pairs, with the status badge and any usage
metrics beside them.

## Events

Events for this object, newest first. They come from a field-selected query against the object
itself rather than a scan.

## Labels and annotations

Labels, annotations, and the two parts of `metadata` no view model carries: the controlling owner
reference, and the finalizers holding a deletion open. That card is added by the detail layout
itself, so it is present on every kind rather than on the ones that remembered to pass it.

## Describe

Pods and nodes have a **Describe** tab. Everything else has its manifest, which says the same thing
in YAML.

Describe answers a structured document — sections of labelled rows, with blocks for the parts that
repeat — rather than pre-rendered text. The screen lays it out, and the copy and download buttons
render the very same document to text, so what you paste is what you read.

## Related objects

The **Related** tab answers what else this object is tied to, and every link says _why_: "mounted as
volume", "envFrom in web", "selects these pods", "runs as".

A relation that cannot be explained is a guess, so everything comes from the object's own spec or
from a selector that actually covers the labels of what it matched — never from names that merely
look alike. Pods come first, because a pod is where every relation is concrete.

## Ownership

Ownership is resolved through the API's own owner references, never label selectors. A selector says
which pods a controller _would_ adopt; the references say which it _has_, and two workloads can share
labels but never a reference.

A pod walks up through the one intermediary its kind allows — a ReplicaSet to its Deployment, a Job
to its CronJob — and stops. A link is only a link when there is a screen for that kind; a broken link
higher up ends the chain rather than failing the whole card.
