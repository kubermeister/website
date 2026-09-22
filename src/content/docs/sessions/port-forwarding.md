---
title: Port forwarding
description: Forwarding a port from a Kubernetes pod or Service with Kubermeister, including forwards that survive a rollout, and how forwards are remembered per context.
sidebar:
  order: 3
---

Start a forward from a pod or a Service. Every forward is then listed in the **top bar** and stopped
from there, rather than from the page that happened to start it — because that page is often not the
one you are on when you want it gone.

## Forwarding to a Service

A forward may target a Service, and the app resolves it to a **ready endpoint per connection**.

That is the difference that matters: a forward aimed at one pod ends when that pod is replaced. A
forward aimed at a Service survives the rollout, because each new connection picks a pod that is
ready right then.

## Forwards live outside the page

Like shells, forwards are held outside the interface's component tree, so navigating away does not
end one. Only stopping it, or losing the connection, does.

## Remembered, but never reopened unasked

Forwards are remembered per context in your settings, and are only ever **offered** again when you
come back to that context.

They are never reopened automatically. Reopening a local port on your machine without asking would be
the app deciding something about your machine, which is not its call.

## A context switch stops them all

Every stream shares the one live connection. Switching context, choosing a different kubeconfig, or
changing the proxy or CA bundle ends every forward with an error naming the reason.
