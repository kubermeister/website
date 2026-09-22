---
title: Shell into a pod
description: Opening an exec session into a Kubernetes pod from Kubermeister, why the shell belongs to the pod's tab, and what the app deliberately will not do.
sidebar:
  order: 2
---

A pod's **Shell** tab is an exec session into that pod. It opens when the tab opens and ends when you
leave it.

## Why it works that way

A shell belongs to its pod. Leaving the pod is how a shell is closed, which means a terminal is never
left attached to a cluster nobody is looking at.

The tab is deliberately **not** kept mounted in the background, unlike Logs. Merely opening a pod's
page must not exec into it.

## Containers

Pick the container from the tab. A pod's containers come back as one ordered list carrying a role —
init, app or ephemeral — so the picker labels each without you having to know the shape of the pod
spec.

## Theme

The terminal has its own two palettes, because a terminal needs literal colours and the app's theme
can flip while a session is running.

## What the app will not do

The app opens no other way in:

- it attaches **no debug container**;
- it runs **no privileged pod** on a node;
- it carries **no files** across the exec channel.

`kubectl debug` and `kubectl cp` are where those belong. The app is not quietly a way around your
RBAC.

## Ending a session

Leaving the tab ends it. So does switching context, changing the kubeconfig, or changing a network
setting — every stream shares the one live connection, and none of them outlive it. You get an error
naming the reason rather than a terminal that has silently stopped responding.
