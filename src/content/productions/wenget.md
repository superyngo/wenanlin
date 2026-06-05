---
title: Wenget
description: A cross-platform package manager for GitHub binaries, written in Rust.
type: github
tags: [rust, cli, package-manager, cross-platform]
repo: superyngo/Wenget
featured: true
order: 1
stars: 0
version: v3.4.1
---

## Overview

Wenget is a cross-platform package manager that installs and manages
command-line tools distributed through GitHub Releases. It detects your
platform, downloads the right binary, and keeps everything organized
under `~/.wenget/`.

## Features

- One-line remote installation for Windows, macOS, and Linux
- Auto-update to the latest GitHub Release
- Bucket system for organizing packages and scripts
- Script support for PowerShell, Bash, and Python
- Smart cross-bucket search and platform detection
- Fast multi-threaded downloads with caching

## Install

```powershell
# Windows
winget install wenget
```

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/superyngo/Wenget/main/install.sh | bash
```
