---
title: sshi
description: SSH-config-based cross-platform remote management tool with an interactive TUI.
type: github
tags: [rust, ssh, tui, cli]
repo: superyngo/sshi
featured: true
order: 2
stars: 0
version: v1.3.2
---

## Overview

sshi manages fleets of remote hosts straight from your `~/.ssh/config`.
It collects system snapshots, synchronizes files across machines, runs
commands in parallel, and ships an interactive terminal UI for browsing
results and configuring checks.

## Features

- Host discovery from `~/.ssh/config` with shell-type detection
- System snapshots for historical tracking
- File sync across hosts (collect → decide → distribute)
- scp-style file copy to many hosts at once
- Parallel remote command and script execution
- Interactive TUI for snapshot data, filters, and checks

## Screenshot

![sshi TUI](/productions/sshi/tui.png)

## Install

```bash
# macOS / Linux
cargo install sshi
```

```powershell
# Windows
$env:APP_NAME="sshi"; $env:REPO="superyngo/sshi"; irm https://gist.githubusercontent.com/superyngo/a6b786af38b8b4c2ce15a70ae5387bd7/raw/gpinstall.ps1 | iex
```
