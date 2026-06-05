---
title: AGM
description: A Rust CLI for centralized management of AI coding agent CLI tools.
type: github
tags: [rust, cli, tui, ai]
repo: superyngo/agm
featured: true
order: 3
stars: 0
version: v0.11.0
---

## Overview

AGM (AI Agent Manager) centralizes prompts, skills, agents, and configs
for every AI coding-agent CLI — Claude Code, Codex CLI, Copilot CLI,
Crush, OpenCode, and more — so you maintain them once and link them
everywhere.

## Features

- Centralized configuration for all AI CLI tools in one place
- Symlink management (junctions + hardlinks on Windows)
- Install skills and agents from local paths or git repos, with auto-update
- Interactive ratatui-based TUI to browse and toggle skills/agents
- Registry-driven: add tools by editing TOML, no code changes
- At-a-glance link health and tool-install status

## Screenshot

![AGM TUI](/productions/agm/tui.png)

## Install

```bash
# via Wenget
wenget install agm
```

```bash
# Linux / macOS
curl -fsSL https://gist.githubusercontent.com/superyngo/a6b786af38b8b4c2ce15a70ae5387bd7/raw/gpinstall.sh | APP_NAME="agm" REPO="superyngo/agm" bash
```
