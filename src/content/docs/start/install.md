---
title: Install Kubermeister
description: Install the Kubermeister desktop Kubernetes client on macOS with Homebrew or the .dmg, on Windows with the installer, and on Linux from the AppImage or .deb.
sidebar:
  order: 1
---

Kubermeister ships as a signed desktop application for macOS, Windows and Linux. Every build comes
from a tagged release on GitHub, and the installers carry the version in their file name, so a
download is always a specific release rather than whatever is current.

## macOS

### Homebrew

The cask is the least friction, and it keeps the app updated alongside everything else you install
that way.

```sh
brew install --cask kubermeister/tap/kubermeister
```

To upgrade later:

```sh
brew upgrade --cask kubermeister
```

### The installer

Download the `.dmg` for your architecture from the [download page](/download/) — `mac-arm64` for
Apple silicon, `mac-x64` for Intel — open it and drag the app to Applications.

macOS builds are Developer ID signed and notarized, so the first launch opens without a
right-click-to-open dance.

## Windows

Download the `.exe` installer from the [download page](/download/) and run it.

## Linux

Two formats are published, both x86-64:

- **AppImage** — download it, mark it executable and run it. Nothing is installed.

  ```sh
  chmod +x Kubermeister-*-linux-x86_64.AppImage
  ./Kubermeister-*-linux-x86_64.AppImage
  ```

- **`.deb`** — for Debian, Ubuntu and derivatives.

  ```sh
  sudo apt install ./Kubermeister-*-linux-amd64.deb
  ```

An AppImage installs no desktop entry until you integrate it, so the window carries its own icon
rather than falling back to your desktop's placeholder.

## Verifying a download

Each release lists its assets on the [releases page](https://github.com/kubermeister/kubermeister/releases).
Assets are uploaded one at a time and read back to check their size and checksum before the update
feed is written, so a release you can see is a release whose files are complete.

## Updating

Kubermeister updates itself. By default it downloads a new version in the background and installs it
when you quit, because the app releases often and an announcement waiting on a click is a fix that
never lands. You can change that to check-only or turn it off entirely — see
[updates](/docs/reference/updates/).

## Next

Point it at a cluster: [connecting to a cluster](/docs/clusters/connecting/).
