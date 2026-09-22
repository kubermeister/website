---
title: Scaling and restarting
description: Scaling a Kubernetes workload in Kubermeister, restarting a deployment the way kubectl rollout restart does, and adjusting a HorizontalPodAutoscaler.
sidebar:
  order: 2
---

## Scaling

Scale a workload from its detail page. A scale of a namespaced kind must name its namespace and a
cluster-scoped kind must not — enforced at the boundary, never inferred from whatever namespace
happens to be selected.

## Restarting

A restart is a strategic merge patch stamping the pod template's
`kubectl.kubernetes.io/restartedAt` annotation — the same key `kubectl rollout restart` writes, so
both read as one history.

Two consequences follow:

- **Only workload kinds can be restarted.** The app restarts what has a pod template to stamp.
- **Nothing here deletes a pod to restart it.** Restarting from a _pod's_ page rolls the workload
  that owns it, because a pod deleted on its own simply comes back unchanged.

## Autoscalers

A HorizontalPodAutoscaler's bounds can be adjusted from its own screen. Its CPU target is only
written when you actually change it, so an autoscaler watching other metrics keeps watching them.

## Evicting and deleting pods

A pod can be **evicted**, which goes through the eviction API so PodDisruptionBudgets still have a
say — a plain delete does not. A delete can carry a grace period, and zero is the forced delete the
pod dialog offers explicitly.
