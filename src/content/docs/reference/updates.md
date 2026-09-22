---
title: Updates
description: How Kubermeister updates itself — the download, check and off modes, the check interval, and the menu's Check for Updates dialog.
sidebar:
  order: 3
---

Kubermeister updates itself from its GitHub releases.

## Modes

Set in **Settings → Updates**:

- **Download** (the default) — a found release is downloaded in the background and installed when you
  quit.
- **Check** — you are told a release exists and decide when to download it.
- **Off** — no scheduled checks.

The default is `download` on purpose. The app releases often, installs on quit, and an announcement
waiting on a click is a fix that never lands.

Nothing is downloaded before the mode is read, so choosing `check` or `off` genuinely prevents the
download rather than merely hiding it.

## Scheduling

Checks run every 4 hours by default, starting a few seconds after launch. Changing the interval
reschedules from now; saving any _other_ setting never pushes the next check out.

A failed scheduled check is recorded quietly and never surfaces as a notification. You find out when
you go looking.

## Where you see it

- A pill in the top bar, with a popover and a one-shot toast when the state changes.
- The **About** card in Settings.
- The command palette can run a check.
- **Check for Updates…** in the application menu, which uses **native dialogs** rather than the
  interface. That matters: the pill and Settings only exist once the window has finished loading, and
  an update found while a blank screen keeps that from happening still needs a way in.

## Release notes

The app shows none. Generated release notes are a list of pull-request titles, dozens of lines with
an author and a URL on each — so the app gives the version and its date and links to the release
page, and the native dialog offers a **Release Notes** button.

What a release actually changed for you is in the [changelog](/changelog/), which is written by hand.
