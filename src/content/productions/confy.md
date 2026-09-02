---
title: confy
description: A cross-platform TUI, web, desktop, and VS Code editor for structured config files (TOML/JSON/YAML).
type: github
tags: [rust, tui, config, wasm, cross-platform, vscode]
repo: superyngo/confy
featured: false
order: 7
stars: 0
version: v1.0.0
---

## Overview

confy is an interactive tree editor for structured configuration files —
TOML, JSON/JSONC, and a lossless YAML subset. Edits are round-trip
preserving: comments, key order, and formatting survive every save
(byte-identical for unmodified subtrees). Now at v1.0.0, the same headless
core powers a terminal TUI, a browser-based web UI (via WebAssembly), a
native desktop app (Tauri), and a VS Code custom editor — one engine behind
every surface.

**Live demo: [confy.turkeyang.net](https://confy.turkeyang.net/)**

## Features

- Interactive TUI tree editor with vim-style navigation
- Round-trip preserving saves — comments, key order, and whitespace intact
- Convert between TOML / JSON / JSONC / YAML with comments carried across
- Pointer-first web UI driving the same core through WASM, with a touch layout
- Native desktop app for macOS and Windows, also listed on the Microsoft Store
- VS Code custom editor, plus outline symbols, schema diagnostics, and
  hover hints on the native TOML/YAML text editors
- JSON Schema-aware validation with grid-stepping value nudges and inline
  violation markers
- Type picker for adding nodes (string/number/bool/date/table/array/comment)
- English and Traditional Chinese (zh-TW) UI, switchable at runtime
- Undo/redo, fuzzy filter, selection, copy/cut/paste/move, comment toggling
- Atomic, crash-safe saves with BOM preservation and hostile-input guards

## Try it

Use the web UI directly in your browser at
[confy.turkeyang.net](https://confy.turkeyang.net/), grab the TUI and
desktop builds from
[GitHub releases](https://github.com/superyngo/confy/releases), or install
the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=wenanlin.confy-vscode)
(also on [Open VSX](https://open-vsx.org/extension/wenanlin/confy-vscode)).

```bash
confy <file.toml>
```
