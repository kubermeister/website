---
title: Cordoning and draining nodes
description: Cordoning and draining a Kubernetes node from Kubermeister — seeing the plan first, honouring PodDisruptionBudgets, and stopping a drain safely.
sidebar:
  order: 2
---

## Cordon

Cordoning patches `spec.unschedulable` and nothing else, so it reads the same to every other tool.

## Drain

A drain writes for minutes and reports as it goes, so it is a **stream** rather than a single call:
one line per pod, as each one leaves.

### The plan comes first

Before anything happens, the app answers what a drain _would_ do for the options you have chosen.
When you start it, the drain re-derives that same plan itself — so the screen can never promise one
thing and the app carry out another.

### Eviction, not deletion

Pods are removed through the **eviction API**, which is what makes PodDisruptionBudgets matter. A 429
from the API server means "not now", not "failed", so the loop waits and retries against its own
two-minute deadline per pod.

That loop deliberately runs outside the ordinary read timeout: a ceiling meant for a single read is
the wrong ceiling for something whose job is to keep asking.

### Stopping

Stopping ends the stream at once and **leaves the node cordoned**. Undoing that is your decision, not
the app's — a drain you interrupted is rarely one you wanted fully reversed.

## PodDisruptionBudgets

Budgets are listed as their own kind. A budget that allows no disruption reads **Blocked**, because a
drain stops on it and no count says so on its own.

## Node detail

A node's screen lists the pods actually on it, selected by `spec.nodeName`, along with its
conditions, capacity and allocatable resources, and its usage charts.
