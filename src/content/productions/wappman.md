---
title: wappman
description: A user-level service manager for Linux/Unix, written in pure Bash.
type: github
tags: [bash, linux, service-manager, cli]
repo: superyngo/wappman
featured: false
order: 6
stars: 0
version: v1.0.6
---

## Overview

wappman is a user-level service manager for Linux/Unix systems. It runs
the lifecycle of multiple services — start, stop, restart — with optional
health checking and file watching for auto-restart. It's a pure Bash
solution with no external dependencies beyond `inotify-tools` for file
watching.

## Features

- Service lifecycle management for multiple services at once
- Periodic health monitoring with configurable intervals
- File watching with auto-restart on config changes
- Real-time status and uptime reporting
- Centralized logging with automatic rotation
- Crash recovery with retry limits and crash notifications

## Install

```bash
# via Wenget
wenget install wappman
```

```bash
git clone https://github.com/superyngo/wappman.git
cd wappman
chmod +x wappman
```
