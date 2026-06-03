# Changelog

All notable changes to this project are documented here.

## Unreleased

### 2026-06-04 — Initial studio website build

Built the minimalist editorial studio website as an Astro 5 static site for Cloudflare Pages, executed task-by-task from `docs/superpowers/plans/2026-06-03-studio-website.md` with spec-compliance + code-quality review after each task.

- **Scaffold & tooling:** Astro 5 project, strict TypeScript, Vitest, `@astrojs/sitemap`; `npm run build` runs `astro build` + Pagefind indexing.
- **Content collections:** `blog` and `productions` Markdown collections (zod schemas, git-managed) with sample content.
- **Tested helpers (TDD):** `src/lib/blog.ts` (`filterDrafts`, `sortPostsByDate`, `getAllTags`) and `src/lib/stats.ts` (build-time GitHub/App Store stat fetchers with graceful fallback to frontmatter baselines) — 9 Vitest unit tests.
- **Design system:** editorial-minimal tokens + global styles (serif headings / sans body, light & dark palettes).
- **Layout & components:** `BaseHead` (SEO/OG/RSS autodiscovery + no-flash theme), `Header` (desktop nav + accessible mobile drawer with Escape-to-close), `Footer`, `ThemeToggle` (persisted + Giscus theme sync), `BaseLayout`.
- **Pages:** home (featured productions + latest posts), productions list (responsive grid + client-side type filter) and detail (build-time stats), paginated blog list, blog post (Giscus comments, Pagefind body), paginated tag pages, about, privacy, 404.
- **Feeds & search & images:** RSS feed, Pagefind full-text search, per-post build-time OG image generation (`astro-og-canvas`).
- **Analytics & docs:** Cloudflare Web Analytics beacon and `README.md` with a Cloudflare Pages deploy guide + post-setup checklist.

Verified: `npx vitest run` (9/9 pass), `npx astro check` (0 errors), `npm run build` (Astro + Pagefind succeed), and a `npm run preview` smoke test of all routes (home, productions + filter, product detail, blog + pagination, post + Giscus, tag page, search, about, privacy, RSS, sitemap, OG image, 404).

**Owner-supplied configuration still required** (placeholders left in place): Giscus repo/category IDs (`src/components/Giscus.astro`), Cloudflare Web Analytics token (`src/components/BaseHead.astro`), production domain (`astro.config.mjs` `site`), social links (`Header`/`Footer`), and the real `public/og-default.png` share image.
