# Changelog

All notable changes to this project are documented here.

## Unreleased

### 2026-06-05 — Add Wenget install option to productions

- Add a `wenget install <name>` block to the sshi, AGM, wenv, and wappman production install sections (wedi already had one; Wenget cannot self-install).

### 2026-06-05 — Add production pages for six tools

- Add production content for Wenget, sshi, AGM, wenv, wedi, and wappman (all `type: github`), each with overview, features, and install sections.
- Add TUI screenshots under `public/productions/<slug>/tui.png` for sshi, AGM, wenv, and wedi.
- Remove the `sample-cli.md` placeholder production.

### 2026-06-04 — Add tag filter to productions

- Add an optional `tags` array to the productions schema and surface tags on `ProductionCard` (data attribute + inline chips).
- Add a second filter row to the productions list (mirroring the blog tag filter) that combines with the existing GitHub/App Store source filter via AND.
- Pass `tags` through from the home page and productions list; tag the sample production for demonstration.

### 2026-06-04 — Pre-launch hardening

- Wrap `localStorage` access in the no-flash theme scripts (`BaseHead.astro` read, `ThemeToggle.astro` write) in try/catch so Safari private mode's `SecurityError` no longer breaks theming.
- Preload the Newsreader 500 headline woff2 (imported for a stable hashed URL that matches the bundled `@fontsource` CSS) to cut FOUT on the most visible text.
- Add an optional `rating` baseline field to the productions schema (parallels `stars`) and use it as the App Store fallback in the production detail page.

### 2026-06-04 — Add real default OG image

- Replace the 1×1 `public/og-default.png` placeholder with a real 1200×630 share image reading "Wenanlin企業社", generated via `astro-og-canvas` in the same dark editorial style as the per-post OG images (Heiti TC for the Chinese glyphs).

### 2026-06-04 — Set real social links

- Update `Footer.astro` social links to the real Email (`turkeyang@turkeyang.net`), Facebook page, and GitHub.

### 2026-06-04 — Wire up Giscus comments

- Replace the `REPO` / `REPLACE_REPO_ID` / `REPLACE_CATEGORY_ID` placeholders in `Giscus.astro` with the real `superyngo/wenanlin` repo and Announcements category IDs.

### 2026-06-04 — Wire up Cloudflare Web Analytics token

- Replace the `REPLACE_TOKEN` placeholder in `BaseHead.astro` with the real Cloudflare Web Analytics beacon token.

### 2026-06-04 — Set production domain

- Point `astro.config.mjs` `site` to the production custom domain `https://www.turkeyang.net` (was the `*.pages.dev` placeholder) so sitemap and OG absolute URLs resolve correctly.

### 2026-06-04 — Initial studio website build

Built the minimalist editorial studio website as an Astro 5 static site for Cloudflare Pages, executed task-by-task from `docs/superpowers/plans/2026-06-03-studio-website.md` with spec-compliance + code-quality review after each task.

- **Scaffold & tooling:** Astro 5 project, strict TypeScript, Vitest, `@astrojs/sitemap`; `npm run build` runs `astro build` + Pagefind indexing.
- **Content collections:** `blog` and `productions` Markdown collections (zod schemas, git-managed) with sample content.
- **Tested helpers (TDD):** `src/lib/blog.ts` (`filterDrafts`, `sortPostsByDate`, `getAllTags`) and `src/lib/stats.ts` (build-time GitHub/App Store stat fetchers with graceful fallback to frontmatter baselines) — 9 Vitest unit tests.
- **Design system:** editorial-minimal tokens + global styles (serif headings / sans body, light & dark palettes).
- **Layout & components:** `BaseHead` (SEO/OG/RSS autodiscovery + no-flash theme), `Header` (desktop nav + accessible mobile drawer with Escape-to-close), `Footer`, `ThemeToggle` (persisted + Giscus theme sync), `BaseLayout`.
- **Pages:** home (featured productions + latest posts), productions list (responsive grid + client-side type filter) and detail (build-time stats), paginated blog list (with a client-side tag filter), blog post (Giscus comments, Pagefind body), paginated tag pages, about, privacy, 404.
- **Feeds & search & images:** RSS feed, Pagefind full-text search, per-post build-time OG image generation (`astro-og-canvas`).
- **SEO & theme consistency:** `og:type=article` for blog posts (`website` elsewhere); Giscus comment iframe syncs to the site's theme on load as well as on toggle.
- **Analytics & docs:** Cloudflare Web Analytics beacon and `README.md` with a Cloudflare Pages deploy guide + post-setup checklist.

Verified: `npx vitest run` (9/9 pass), `npx astro check` (0 errors), `npm run build` (Astro + Pagefind succeed), and a `npm run preview` smoke test of all routes (home, productions + filter, product detail, blog + pagination, post + Giscus, tag page, search, about, privacy, RSS, sitemap, OG image, 404).

**Owner-supplied configuration still required** (placeholders left in place): Giscus repo/category IDs (`src/components/Giscus.astro`), Cloudflare Web Analytics token (`src/components/BaseHead.astro`), production domain (`astro.config.mjs` `site`), social links (`Header`/`Footer`), and the real `public/og-default.png` share image.
