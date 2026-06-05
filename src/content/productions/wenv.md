---
title: wenv
description: A cross-platform TUI for managing multiple shell configuration files.
type: github
tags: [rust, tui, shell, cli]
repo: superyngo/wenv
featured: false
order: 4
stars: 0
version: v0.18.2
---

## Overview

wenv is a terminal UI for managing multiple shell config files —
`.bashrc`, `.zshrc`, PowerShell profiles — from a single tree view.
It understands aliases, functions, environment variables, and source
statements, and lets you move entries between files safely.

## Features

- Multi-file tree view across all your shell configs
- External editor integration via `$EDITOR`
- Real-time fuzzy search across every file
- Cut, copy, and paste entries between files
- Undo support for any operation
- Smart parsing with confirm-before-save safety

## Screenshot

![wenv TUI](/productions/wenv/tui.png)

## Install

```bash
cargo install wenv
```
