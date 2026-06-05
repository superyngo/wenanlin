---
title: wedi
description: A lightweight, fast console text editor written in Rust.
type: github
tags: [rust, tui, editor, cli]
repo: superyngo/wedi
featured: false
order: 5
stars: 0
version: v0.8.7
---

## Overview

wedi is a lightweight console text editor with a fast startup and a
familiar editing experience. It brings syntax highlighting for 200+
languages, undo/redo, search, and clipboard support to the terminal —
including terminals without Shift-key selection.

## Features

- Cross-platform with fast startup
- Syntax highlighting for 219+ languages with incremental caching
- Undo/redo, search, comment toggling, and go-to-line
- Clipboard copy/cut/paste and selection mode
- Ctrl+S selection mode for limited terminals
- Tab/Shift+Tab indentation and fast keyboard navigation
- Chinese character support and 7 built-in themes

## Screenshot

![wedi editor](/productions/wedi/tui.png)

## Install

```bash
# via Wenget
wenget install wedi
```

```powershell
# Windows one-liner
$env:APP_NAME="wedi"; $env:REPO="superyngo/wedi"; $env:UNINSTALL="false"; irm https://gist.githubusercontent.com/superyngo/a6b786af38b8b4c2ce15a70ae5387bd7/raw/gpinstall.ps1 | iex
```
