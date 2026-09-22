---
title: Jobs and CronJobs
description: Retrying a failed Kubernetes Job and triggering a CronJob manually in Kubermeister, without the new run inheriting the old one's selector.
sidebar:
  order: 3
---

## Retrying a Job

A Job's spec is immutable once it has run, so a retry is a delete and a resubmit.

The app uses foreground deletion and then waits for the name to come free before creating the new
Job, so the create cannot race a half-deleted one. That whole sequence gets its own timeout ceiling,
because the ordinary read timeout would cut it short and report a timeout where the truth is "the old
run is still finishing".

## Triggering a CronJob

Triggering builds a Job from the CronJob's template, owned by nobody — so the CronJob's history
limits never sweep your manual run away.

Building it correctly means stripping two things the control plane stamps: the selector, and the uid
labels. Left in place, they would bind the new Job to the old one's pods.

## Watching it run

Both land in the Jobs list, which is live, and their pods appear under them. The Logs tab on a Job
follows every pod it owns, the same way a Deployment's does.
