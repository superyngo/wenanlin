---
title: confy
description: A cross-platform TUI, web, and desktop editor for structured config files (TOML/JSON/YAML).
type: github
tags: [rust, tui, config, wasm, cross-platform]
repo: superyngo/confy
featured: false
order: 7
stars: 0
version: v0.16.0
---

## Overview

confy is an interactive tree editor for structured configuration files —
TOML, JSON/JSONC, and a lossless YAML subset. Edits are round-trip
preserving: comments, key order, and formatting survive every save
(byte-identical for unmodified subtrees). The same headless core powers a
terminal TUI, a browser-based web UI (via WebAssembly), and a native
desktop app (Tauri).

**Live demo: [confy.turkeyang.net](https://confy.turkeyang.net/)**

## Features

- Interactive TUI tree editor with vim-style navigation
- Round-trip preserving saves — comments, key order, and whitespace intact
- Convert between TOML / JSON / JSONC / YAML with comments carried across
- Pointer-first web UI driving the same core through WASM, with a touch layout
- Native desktop app for macOS and Windows with native open/save dialogs
- English and Traditional Chinese (zh-TW) UI, switchable at runtime
- Undo/redo, fuzzy filter, selection, copy/cut/paste/move, comment toggling

## Try it

Use the web UI directly in your browser at
[confy.turkeyang.net](https://confy.turkeyang.net/), or grab the TUI and
desktop builds from
[GitHub releases](https://github.com/superyngo/confy/releases).

```bash
confy <file.toml>
```
