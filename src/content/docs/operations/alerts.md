---
title: Cluster alerts
description: How Kubermeister finds pending pods, failed pods, crash loops and image pull failures without listing every pod in the cluster.
sidebar:
  order: 4
---

Alerts are derived from cluster state, cluster-wide, with thresholds the app decides rather than ones
you tune. They are meant to answer "is anything obviously wrong" on a screen you already have open.

## What is found, and how

The interesting part is that **pod alerts never read every pod**:

- **Pending and failed pods** come from `status.phase` field selectors, so the API server does the
  filtering.
- **Crash loops and image pull failures** come from the recent Warning `BackOff` events the kubelet
  emits for them, deduplicated per pod.

That second one is not an optimisation, it is a correctness point: a CrashLoopBackOff pod is phase
`Running`, so no field selector finds it. The event is the only cheap signal.

## What is deliberately missing

There is **no high-restarts alert**, because healthy pods' restart counts are never read. Adding one
would mean listing every pod in the cluster on a timer, which is exactly what the rest of the app
avoids.

## Node and workload alerts

Nodes that are not ready, and workloads whose available replicas do not match what they want, are
found from the lists those screens already watch.
