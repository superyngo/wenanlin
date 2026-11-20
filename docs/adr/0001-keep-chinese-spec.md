# 0001 — Keep the studio-website spec in Chinese
Status: Implemented (2026-11-20)

## Context

repo-docs 4 asks for docs in one language (English). `docs/spec/2026-06-03-studio-website.md`
was written in Chinese; the plan, README, CHANGELOG, and every other doc are English. The spec is
a frozen record (repo-docs 15): translating it would be a content rewrite, not a status change.

## Decision

`docs/spec/2026-06-03-studio-website.md` stays in Chinese as written. Only its `Status:` line
(line 2) is English, replacing the former `狀態` field. All new docs are written in English.
Chinese site content under `src/content/` is product content, not documentation, and is out of
scope.

## Alternatives rejected

- Translate in place — violates freeze-on-landing (repo-docs 15).
- Add an English translation as a new record — no reader needs it; the English plan already
  covers the same design.
