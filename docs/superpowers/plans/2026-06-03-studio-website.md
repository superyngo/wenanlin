# Studio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimalist editorial studio website with productions showcase, a Markdown/git blog (Giscus comments, Pagefind search, tags, pagination), about & privacy pages, RSS, dark mode, and SEO/OG — deployed as a static site on Cloudflare Pages.

**Architecture:** Astro 5 static site. Content lives in `src/content/` as Markdown managed via git. Pure data helpers (`src/lib/`) are unit-tested with Vitest; pages are verified via `astro build` + `astro check`. Decorative stats (GitHub stars, App Store version) are fetched at build time with graceful fallback to frontmatter baseline values. No backend.

**Tech Stack:** Astro 5, TypeScript, Vitest, Pagefind, Giscus, `@astrojs/rss`, `@astrojs/sitemap`, `astro-og-canvas`, Fontsource, Cloudflare Pages + Cloudflare Web Analytics.

**Spec:** `docs/superpowers/specs/2026-06-03-studio-website-design.md`

---

## File Structure

```
package.json                         scripts + deps
astro.config.mjs                     site config, sitemap integration
tsconfig.json                        strict TS
vitest.config.ts                     test config
.gitignore                           node/astro ignores

src/
  content.config.ts                  blog + productions collection schemas (zod)
  content/
    blog/                            *.md posts
    productions/                     *.md products
  styles/
    tokens.css                       design tokens (colors, spacing, type)
    global.css                       base/reset + element styling
  lib/
    blog.ts                          pure helpers: filterDrafts, sortPostsByDate, getAllTags
    stats.ts                         build-time GitHub/App Store fetch with fallback
  components/
    BaseHead.astro                   meta, OG, RSS autodiscovery, theme no-flash script
    Header.astro                     desktop nav + mobile drawer + theme toggle
    Footer.astro                     contact/social links, privacy link
    ThemeToggle.astro                dark/light toggle button + Giscus sync
    Pagination.astro                 page-number nav
    PostCard.astro                   blog list item
    ProductionCard.astro             productions grid item
    Giscus.astro                     comments embed
    Search.astro                     Pagefind UI mount
  layouts/
    BaseLayout.astro                 html shell: head + header + slot + footer
  pages/
    index.astro                      home: featured productions + latest posts
    about.astro
    privacy.astro
    404.astro
    productions/index.astro          grid + type filter
    productions/[slug].astro         product detail (build-time stats)
    blog/[...page].astro             paginated list (page 1 = /blog)
    blog/[slug].astro                post + Giscus
    blog/tags/[tag]/[...page].astro  paginated tag list
    rss.xml.ts                       RSS feed
    og/[...route].ts                 per-post OG image generation

tests/
  blog.test.ts
  stats.test.ts
```

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "wenanlin-studio",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
*.log
.env
```

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to the production domain when DNS is set up.
export default defineConfig({
  site: 'https://wenanlin.pages.dev',
  output: 'static',
  integrations: [sitemap()],
});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Install dependencies**

Run:
```bash
npm install astro@^5 @astrojs/rss @astrojs/sitemap astro-og-canvas @fontsource/inter @fontsource/newsreader @fontsource/noto-sans-tc
npm install -D @astrojs/check typescript vitest pagefind @pagefind/default-ui
```
Expected: installs without error; `node_modules/` created.

- [ ] **Step 6: Verify Astro recognizes the project**

Run: `npx astro check`
Expected: completes (0 errors; "no content" warnings acceptable since pages not yet created).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "chore: scaffold Astro project"
```

---

## Task 2: Vitest config

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 2: Verify the runner starts with no tests**

Run: `npx vitest run`
Expected: exits cleanly reporting "No test files found" (no error).

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "chore: add vitest config"
```

---

## Task 3: Content collection schemas

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/hello-world.md` (sample)
- Create: `src/content/productions/sample-cli.md` (sample)

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

const productions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productions' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['github', 'appstore']),
    repo: z.string().optional(),
    appStoreId: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    // Decorative baseline values; refreshed from API at build, fall back to these.
    stars: z.number().optional(),
    version: z.string().optional(),
  }),
});

export const collections = { blog, productions };
```

- [ ] **Step 2: Create sample post `src/content/blog/hello-world.md`**

```markdown
---
title: Hello World
date: 2026-06-03
tags: [meta, astro]
description: First post on the new site.
draft: false
---

Welcome to the studio blog.
```

- [ ] **Step 3: Create sample product `src/content/productions/sample-cli.md`**

```markdown
---
title: Sample CLI
description: A command-line tool.
type: github
repo: octocat/Hello-World
featured: true
order: 1
stars: 0
version: v0.0.0
---

## Overview

Detailed description of the product goes here.
```

- [ ] **Step 4: Verify schemas compile**

Run: `npx astro sync && npx astro check`
Expected: 0 errors; collection types generated under `.astro/`.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: add blog and productions content collections"
```

---

## Task 4: Blog data helpers (TDD)

**Files:**
- Create: `src/lib/blog.ts`
- Test: `tests/blog.test.ts`

These are pure functions over post-shaped objects so they're testable without the Astro runtime.

- [ ] **Step 1: Write the failing test `tests/blog.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { filterDrafts, sortPostsByDate, getAllTags } from '../src/lib/blog';

type Post = { data: { date: Date; tags: string[]; draft: boolean } };

const make = (date: string, tags: string[], draft = false): Post => ({
  data: { date: new Date(date), tags, draft },
});

describe('filterDrafts', () => {
  it('removes drafts', () => {
    const posts = [make('2026-01-01', [], false), make('2026-01-02', [], true)];
    expect(filterDrafts(posts)).toHaveLength(1);
  });
});

describe('sortPostsByDate', () => {
  it('sorts newest first', () => {
    const posts = [make('2026-01-01', []), make('2026-03-01', []), make('2026-02-01', [])];
    const sorted = sortPostsByDate(posts);
    expect(sorted.map((p) => p.data.date.getMonth())).toEqual([2, 1, 0]);
  });

  it('does not mutate the input array', () => {
    const posts = [make('2026-01-01', []), make('2026-03-01', [])];
    sortPostsByDate(posts);
    expect(posts[0].data.date.getMonth()).toBe(0);
  });
});

describe('getAllTags', () => {
  it('counts tags and sorts by count then name', () => {
    const posts = [make('2026-01-01', ['a', 'b']), make('2026-01-02', ['a'])];
    expect(getAllTags(posts)).toEqual([
      { tag: 'a', count: 2 },
      { tag: 'b', count: 1 },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/blog.test.ts`
Expected: FAIL — cannot resolve `../src/lib/blog`.

- [ ] **Step 3: Implement `src/lib/blog.ts`**

```ts
type WithDate = { data: { date: Date } };
type WithTags = { data: { tags: string[] } };
type WithDraft = { data: { draft: boolean } };

export function filterDrafts<T extends WithDraft>(posts: T[]): T[] {
  return posts.filter((p) => !p.data.draft);
}

export function sortPostsByDate<T extends WithDate>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getAllTags<T extends WithTags>(posts: T[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/blog.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/blog.ts tests/blog.test.ts
git commit -m "feat: add blog data helpers"
```

---

## Task 5: Build-time stats helpers (TDD)

**Files:**
- Create: `src/lib/stats.ts`
- Test: `tests/stats.test.ts`

`fetch` is injected so the fallback behavior is testable. Spec requires: build never breaks, API values are decorative, on failure use frontmatter baseline.

- [ ] **Step 1: Write the failing test `tests/stats.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { fetchGithubStats, fetchAppStoreStats } from '../src/lib/stats';

describe('fetchGithubStats', () => {
  it('returns live stars on success', async () => {
    const fakeFetch = async () =>
      ({ ok: true, json: async () => ({ stargazers_count: 42 }) }) as Response;
    const result = await fetchGithubStats('a/b', { stars: 1, version: 'v0' }, fakeFetch);
    expect(result.stars).toBe(42);
  });

  it('falls back to baseline on non-ok response', async () => {
    const fakeFetch = async () => ({ ok: false, status: 403 }) as Response;
    const result = await fetchGithubStats('a/b', { stars: 7, version: 'v1' }, fakeFetch);
    expect(result).toEqual({ stars: 7, version: 'v1' });
  });

  it('falls back to baseline when fetch throws', async () => {
    const fakeFetch = async () => {
      throw new Error('network down');
    };
    const result = await fetchGithubStats('a/b', { stars: 3, version: 'v2' }, fakeFetch);
    expect(result).toEqual({ stars: 3, version: 'v2' });
  });
});

describe('fetchAppStoreStats', () => {
  it('returns live version/rating on success', async () => {
    const fakeFetch = async () =>
      ({
        ok: true,
        json: async () => ({ results: [{ version: '2.1', averageUserRating: 4.5 }] }),
      }) as Response;
    const result = await fetchAppStoreStats('123', { rating: null, version: '1.0' }, fakeFetch);
    expect(result).toEqual({ rating: 4.5, version: '2.1' });
  });

  it('falls back when results are empty', async () => {
    const fakeFetch = async () => ({ ok: true, json: async () => ({ results: [] }) }) as Response;
    const result = await fetchAppStoreStats('123', { rating: 3.0, version: '1.0' }, fakeFetch);
    expect(result).toEqual({ rating: 3.0, version: '1.0' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/stats.test.ts`
Expected: FAIL — cannot resolve `../src/lib/stats`.

- [ ] **Step 3: Implement `src/lib/stats.ts`**

```ts
type Fetch = typeof fetch;

export interface GithubFallback {
  stars: number | null;
  version: string | null;
}
export interface GithubStats {
  stars: number | null;
  version: string | null;
}

export async function fetchGithubStats(
  repo: string,
  fallback: GithubFallback,
  fetchFn: Fetch = fetch,
): Promise<GithubStats> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'wenanlin-studio',
    };
    const token = import.meta.env?.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetchFn(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = (await res.json()) as { stargazers_count?: number };
    return {
      stars: json.stargazers_count ?? fallback.stars,
      version: fallback.version,
    };
  } catch {
    return { stars: fallback.stars, version: fallback.version };
  }
}

export interface AppStoreFallback {
  rating: number | null;
  version: string | null;
}
export interface AppStoreStats {
  rating: number | null;
  version: string | null;
}

export async function fetchAppStoreStats(
  appStoreId: string,
  fallback: AppStoreFallback,
  fetchFn: Fetch = fetch,
): Promise<AppStoreStats> {
  try {
    const res = await fetchFn(`https://itunes.apple.com/lookup?id=${appStoreId}`);
    if (!res.ok) throw new Error(`iTunes API ${res.status}`);
    const json = (await res.json()) as {
      results?: { version?: string; averageUserRating?: number }[];
    };
    const r = json.results?.[0];
    if (!r) throw new Error('app not found');
    return {
      rating: r.averageUserRating ?? fallback.rating,
      version: r.version ?? fallback.version,
    };
  } catch {
    return { rating: fallback.rating, version: fallback.version };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/stats.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/stats.ts tests/stats.test.ts
git commit -m "feat: add build-time stats fetchers with fallback"
```

---

## Task 6: Design tokens & global styles

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/tokens.css`**

```css
:root {
  --bg: #fafaf8;
  --text: #1a1a1a;
  --text-muted: #6b6b6b;
  --accent: #2d5bff;
  --border: #e5e3de;

  --font-serif: 'Newsreader', Georgia, serif;
  --font-sans: 'Inter', 'Noto Sans TC', system-ui, sans-serif;

  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 16px;
  --sp-4: 24px;
  --sp-5: 32px;
  --sp-6: 48px;
  --sp-7: 64px;
  --sp-8: 96px;

  --measure: 68ch;
}

:root[data-theme='dark'] {
  --bg: #16161a;
  --text: #ededed;
  --text-muted: #a1a1a1;
  --accent: #7aa2ff;
  --border: #2a2a30;
}
```

- [ ] **Step 2: Create `src/styles/global.css`**

```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/newsreader/500.css';
@import '@fontsource/noto-sans-tc/400.css';
@import './tokens.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3 {
  font-family: var(--font-serif);
  line-height: 1.2;
  font-weight: 500;
}

a {
  color: var(--accent);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 var(--sp-4);
}

.prose {
  max-width: var(--measure);
}

/* Ensure touch targets are >= 44px */
nav a,
button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add design tokens and global styles"
```

---

## Task 7: BaseHead component (meta, OG, RSS autodiscovery, no-flash theme)

**Files:**
- Create: `src/components/BaseHead.astro`

- [ ] **Step 1: Create `src/components/BaseHead.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
}
const { title, description, ogImage } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const og = new URL(ogImage ?? '/og-default.png', Astro.site);
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="canonical" href={canonical} />

<title>{title}</title>
<meta name="description" content={description} />

<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={og} />
<meta name="twitter:card" content="summary_large_image" />

<link rel="alternate" type="application/rss+xml" title="Blog RSS" href={new URL('/rss.xml', Astro.site)} />

<!-- Apply persisted theme before paint to avoid flash -->
<script is:inline>
  const stored = localStorage.getItem('theme');
  const theme = stored ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
</script>
```

- [ ] **Step 2: Add a placeholder default OG image**

Create `public/og-default.png` — a 1200x630 PNG (a plain dark canvas with the site name is fine as a starting asset; replace later). If generating one is not possible now, create the file as a 1x1 transparent PNG so the build does not 404 the asset.

Run: `ls public/og-default.png`
Expected: file exists.

- [ ] **Step 3: Commit**

```bash
git add src/components/BaseHead.astro public/og-default.png
git commit -m "feat: add BaseHead with SEO, OG, RSS autodiscovery, no-flash theme"
```

---

## Task 8: ThemeToggle component (with Giscus sync)

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Create `src/components/ThemeToggle.astro`**

```astro
---
---

<button id="theme-toggle" aria-label="Toggle dark mode" type="button">🌓</button>

<script is:inline>
  const btn = document.getElementById('theme-toggle');
  function syncGiscus(theme) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: theme === 'dark' ? 'dark' : 'light' } } },
      'https://giscus.app',
    );
  }
  btn?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    syncGiscus(next);
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "feat: add theme toggle with Giscus sync"
```

---

## Task 9: Header (desktop nav + mobile drawer) and Footer

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Header.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
const links = [
  { href: '/productions', label: 'Productions' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];
---

<header class="container site-header">
  <a href="/" class="brand">wenanlin</a>

  <button id="nav-toggle" class="nav-toggle" aria-label="Open menu" aria-expanded="false">☰</button>

  <nav id="site-nav" class="site-nav">
    {links.map((l) => <a href={l.href}>{l.label}</a>)}
    <ThemeToggle />
  </nav>
</header>

<style>
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--sp-4);
    padding-bottom: var(--sp-4);
    border-bottom: 1px solid var(--border);
  }
  .brand {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    color: var(--text);
  }
  .site-nav {
    display: flex;
    gap: var(--sp-4);
    align-items: center;
  }
  .site-nav a {
    color: var(--text);
  }
  .nav-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text);
    cursor: pointer;
  }
  @media (max-width: 640px) {
    .nav-toggle {
      display: inline-flex;
    }
    .site-nav {
      display: none;
      position: fixed;
      inset: 0;
      flex-direction: column;
      justify-content: center;
      background: var(--bg);
      gap: var(--sp-5);
      font-size: 1.5rem;
    }
    .site-nav.open {
      display: flex;
    }
  }
</style>

<script is:inline>
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
</script>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
const social = [
  { href: 'mailto:superyngo@gmail.com', label: 'Email' },
  { href: 'https://github.com/superyngo', label: 'GitHub' },
];
---

<footer class="container site-footer">
  <div class="links">
    {social.map((s) => <a href={s.href}>{s.label}</a>)}
    <a href="/privacy">Privacy</a>
  </div>
  <p>© {new Date().getFullYear()} wenanlin</p>
</footer>

<style>
  .site-footer {
    border-top: 1px solid var(--border);
    margin-top: var(--sp-8);
    padding-top: var(--sp-5);
    padding-bottom: var(--sp-6);
    color: var(--text-muted);
  }
  .links {
    display: flex;
    gap: var(--sp-4);
    margin-bottom: var(--sp-2);
  }
</style>
```

> Update the `social` and `Footer` links once the user supplies the final list (spec open detail).

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "feat: add header with mobile drawer and footer"
```

---

## Task 10: BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
}
const { title, description, ogImage } = Astro.props;
---

<!doctype html>
<html lang="zh-Hant">
  <head>
    <BaseHead title={title} description={description} ogImage={ogImage} />
  </head>
  <body>
    <Header />
    <main class="container">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add base layout"
```

---

## Task 11: About, Privacy, and 404 pages

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/privacy.astro`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About — wenanlin" description="About the studio.">
  <article class="prose">
    <h1>About</h1>
    <p>Replace this with the studio introduction.</p>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/privacy.astro`** (content from spec's privacy section)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Privacy Policy — wenanlin" description="Privacy policy.">
  <article class="prose">
    <h1>Privacy Policy</h1>
    <h2>Analytics</h2>
    <p>
      This site uses Cloudflare Web Analytics, which is anonymous, uses no cookies, and does not
      track individuals.
    </p>
    <h2>Comments</h2>
    <p>
      Blog comments are powered by Giscus, which loads resources from GitHub. Comments are stored
      publicly in GitHub Discussions and are subject to GitHub's privacy policy. A GitHub account is
      required to comment.
    </p>
    <h2>No other tracking</h2>
    <p>No other tracking or third-party data collection is performed.</p>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Not Found — wenanlin" description="Page not found.">
  <article class="prose">
    <h1>404</h1>
    <p>This page doesn't exist.</p>
    <p><a href="/">Back home</a> · <a href="/blog">Read the blog</a></p>
  </article>
</BaseLayout>
```

- [ ] **Step 4: Verify build**

Run: `npx astro build`
Expected: build succeeds; `dist/about/index.html`, `dist/privacy/index.html`, `dist/404.html` exist.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro src/pages/privacy.astro src/pages/404.astro
git commit -m "feat: add about, privacy, and 404 pages"
```

---

## Task 12: PostCard + paginated blog list

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/components/Pagination.astro`
- Create: `src/pages/blog/[...page].astro`

- [ ] **Step 1: Create `src/components/Pagination.astro`**

```astro
---
interface Props {
  prevUrl?: string;
  nextUrl?: string;
  currentPage: number;
  lastPage: number;
}
const { prevUrl, nextUrl, currentPage, lastPage } = Astro.props;
---

<nav class="pagination" aria-label="Pagination">
  {prevUrl ? <a href={prevUrl}>← Newer</a> : <span></span>}
  <span>{currentPage} / {lastPage}</span>
  {nextUrl ? <a href={nextUrl}>Older →</a> : <span></span>}
</nav>

<style>
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--sp-6);
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 2: Create `src/components/PostCard.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  date: Date;
  tags: string[];
  url: string;
}
const { title, description, date, tags, url } = Astro.props;
const formatted = date.toISOString().slice(0, 10);
---

<article class="post-card">
  <a href={url}><h2>{title}</h2></a>
  <p class="meta">
    <time datetime={formatted}>{formatted}</time>
    {tags.map((t) => <a class="tag" href={`/blog/tags/${t}`}>#{t}</a>)}
  </p>
  <p>{description}</p>
</article>

<style>
  .post-card {
    padding: var(--sp-4) 0;
    border-bottom: 1px solid var(--border);
  }
  .post-card h2 {
    color: var(--text);
    margin: 0 0 var(--sp-2);
  }
  .meta {
    color: var(--text-muted);
    font-size: 0.9rem;
    display: flex;
    gap: var(--sp-3);
    margin: 0 0 var(--sp-2);
  }
</style>
```

- [ ] **Step 3: Create `src/pages/blog/[...page].astro`**

```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import Pagination from '../../components/Pagination.astro';
import Search from '../../components/Search.astro';
import { filterDrafts, sortPostsByDate } from '../../lib/blog';

export const getStaticPaths = (async ({ paginate }) => {
  const posts = sortPostsByDate(filterDrafts(await getCollection('blog')));
  return paginate(posts, { pageSize: 10 });
}) satisfies GetStaticPaths;

const { page } = Astro.props;
---

<BaseLayout title="Blog — wenanlin" description="Writing from the studio.">
  <h1>Blog</h1>
  <Search />
  {
    page.data.map((post) => (
      <PostCard
        title={post.data.title}
        description={post.data.description}
        date={post.data.date}
        tags={post.data.tags}
        url={`/blog/${post.id}`}
      />
    ))
  }
  <Pagination
    prevUrl={page.url.prev}
    nextUrl={page.url.next}
    currentPage={page.currentPage}
    lastPage={page.lastPage}
  />
</BaseLayout>
```

> `Search.astro` is created in Task 16; until then comment out its import/usage or complete Task 16 first if building now.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.astro src/components/Pagination.astro src/pages/blog/[...page].astro
git commit -m "feat: add paginated blog list"
```

---

## Task 13: Blog post page + Giscus

**Files:**
- Create: `src/components/Giscus.astro`
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create `src/components/Giscus.astro`**

Fill the `data-repo`, `data-repo-id`, `data-category`, `data-category-id` from the Giscus setup at https://giscus.app after enabling Discussions on the site repo.

```astro
---
---

<section class="comments">
  <script
    src="https://giscus.app/client.js"
    data-repo="superyngo/REPO"
    data-repo-id="REPLACE_REPO_ID"
    data-category="Announcements"
    data-category-id="REPLACE_CATEGORY_ID"
    data-mapping="pathname"
    data-strict="1"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="top"
    data-theme="light"
    data-lang="zh-TW"
    data-loading="lazy"
    crossorigin="anonymous"
    async></script>
</section>

<style>
  .comments {
    margin-top: var(--sp-7);
  }
</style>
```

- [ ] **Step 2: Create `src/pages/blog/[slug].astro`**

```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Giscus from '../../components/Giscus.astro';
import { filterDrafts } from '../../lib/blog';

export const getStaticPaths = (async () => {
  const posts = filterDrafts(await getCollection('blog'));
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

const { post } = Astro.props;
const { Content } = await render(post);
const formatted = post.data.date.toISOString().slice(0, 10);
---

<BaseLayout
  title={`${post.data.title} — wenanlin`}
  description={post.data.description}
  ogImage={`/og/${post.id}.png`}
>
  <article class="prose" data-pagefind-body>
    <h1>{post.data.title}</h1>
    <p class="meta">
      <time datetime={formatted}>{formatted}</time>
      {post.data.tags.map((t) => <a href={`/blog/tags/${t}`}>#{t}</a>)}
    </p>
    <Content />
  </article>
  <Giscus />
</BaseLayout>

<style>
  .meta {
    color: var(--text-muted);
    display: flex;
    gap: var(--sp-3);
  }
</style>
```

- [ ] **Step 3: Verify build**

Run: `npx astro build`
Expected: succeeds; `dist/blog/hello-world/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add src/components/Giscus.astro src/pages/blog/[slug].astro
git commit -m "feat: add blog post page with Giscus"
```

---

## Task 14: Paginated tag pages

**Files:**
- Create: `src/pages/blog/tags/[tag]/[...page].astro`

- [ ] **Step 1: Create `src/pages/blog/tags/[tag]/[...page].astro`**

```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import BaseLayout from '../../../../layouts/BaseLayout.astro';
import PostCard from '../../../../components/PostCard.astro';
import Pagination from '../../../../components/Pagination.astro';
import { filterDrafts, sortPostsByDate, getAllTags } from '../../../../lib/blog';

export const getStaticPaths = (async ({ paginate }) => {
  const posts = sortPostsByDate(filterDrafts(await getCollection('blog')));
  const tags = getAllTags(posts);
  return tags.flatMap(({ tag }) => {
    const tagged = posts.filter((p) => p.data.tags.includes(tag));
    return paginate(tagged, { params: { tag }, pageSize: 10 });
  });
}) satisfies GetStaticPaths;

const { page } = Astro.props;
const { tag } = Astro.params;
---

<BaseLayout title={`#${tag} — wenanlin`} description={`Posts tagged ${tag}.`}>
  <h1>#{tag}</h1>
  {
    page.data.map((post) => (
      <PostCard
        title={post.data.title}
        description={post.data.description}
        date={post.data.date}
        tags={post.data.tags}
        url={`/blog/${post.id}`}
      />
    ))
  }
  <Pagination
    prevUrl={page.url.prev}
    nextUrl={page.url.next}
    currentPage={page.currentPage}
    lastPage={page.lastPage}
  />
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `npx astro build`
Expected: succeeds; `dist/blog/tags/meta/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/tags/
git commit -m "feat: add paginated tag pages"
```

---

## Task 15: RSS feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create `src/pages/rss.xml.ts`**

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { filterDrafts, sortPostsByDate } from '../lib/blog';

export async function GET(context: APIContext) {
  const posts = sortPostsByDate(filterDrafts(await getCollection('blog')));
  return rss({
    title: 'wenanlin — Blog',
    description: 'Writing from the studio.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
```

- [ ] **Step 2: Verify build**

Run: `npx astro build`
Expected: succeeds; `dist/rss.xml` exists and contains the sample post.

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed"
```

---

## Task 16: Pagefind search

**Files:**
- Create: `src/components/Search.astro`

The `build` script (Task 1) already runs `pagefind --site dist` after `astro build`. Post bodies are marked with `data-pagefind-body` (Task 13).

- [ ] **Step 1: Create `src/components/Search.astro`**

```astro
---
---

<div id="search"></div>

<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
<script>
  // @ts-expect-error - injected at build by Pagefind
  import { PagefindUI } from '@pagefind/default-ui';
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({ element: '#search', showSubResults: true });
  });
</script>
```

- [ ] **Step 2: Ensure Task 12's blog list imports/uses `Search` (uncomment if previously stubbed).**

- [ ] **Step 3: Verify full build with search index**

Run: `npm run build`
Expected: `astro build` then `pagefind` runs; `dist/pagefind/pagefind-ui.js` and `dist/pagefind/pagefind-ui.css` exist.

- [ ] **Step 4: Manually verify search**

Run: `npm run preview` then open the printed URL `/blog`, type "world" into the search box.
Expected: "Hello World" appears as a result.

- [ ] **Step 5: Commit**

```bash
git add src/components/Search.astro src/pages/blog/[...page].astro
git commit -m "feat: add Pagefind search to blog"
```

---

## Task 17: OG image generation for posts

**Files:**
- Create: `src/pages/og/[...route].ts`

Uses `astro-og-canvas` `OGImageRoute` to generate one OG image per blog post at build (route referenced by `[slug].astro` as `/og/<id>.png`).

- [ ] **Step 1: Create `src/pages/og/[...route].ts`**

```ts
import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { filterDrafts } from '../../lib/blog';

const posts = filterDrafts(await getCollection('blog'));

const pages = Object.fromEntries(posts.map((p) => [p.id, { title: p.data.title }]));

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page: { title: string }) => ({
    title: page.title,
    description: 'wenanlin',
    bgGradient: [[22, 22, 26]],
    fonts: [],
    padding: 80,
  }),
});
```

- [ ] **Step 2: Verify build generates OG images**

Run: `npx astro build`
Expected: succeeds; `dist/og/hello-world.png` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/og/[...route].ts
git commit -m "feat: generate per-post OG images"
```

---

## Task 18: Productions list + detail page

**Files:**
- Create: `src/components/ProductionCard.astro`
- Create: `src/pages/productions/index.astro`
- Create: `src/pages/productions/[slug].astro`

- [ ] **Step 1: Create `src/components/ProductionCard.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  type: 'github' | 'appstore';
  featured: boolean;
  url: string;
}
const { title, description, type, featured, url } = Astro.props;
---

<a class:list={['card', { featured }]} href={url} data-type={type}>
  <h3>{title}</h3>
  <p>{description}</p>
  <span class="badge">{type}</span>
</a>

<style>
  .card {
    display: block;
    padding: var(--sp-4);
    border: 1px solid var(--border);
    color: var(--text);
  }
  .card.featured {
    border-color: var(--accent);
  }
  .badge {
    color: var(--text-muted);
    font-size: 0.8rem;
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/productions/index.astro`** (grid + client-side type filter)

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProductionCard from '../../components/ProductionCard.astro';

const items = (await getCollection('productions')).sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout title="Productions — wenanlin" description="Products and open-source work.">
  <h1>Productions</h1>

  <div class="filters">
    <button data-filter="all" class="active">All</button>
    <button data-filter="github">GitHub</button>
    <button data-filter="appstore">App Store</button>
  </div>

  <div class="grid">
    {
      items.map((item) => (
        <ProductionCard
          title={item.data.title}
          description={item.data.description}
          type={item.data.type}
          featured={item.data.featured}
          url={`/productions/${item.id}`}
        />
      ))
    }
  </div>
</BaseLayout>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-4);
  }
  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 1024px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .filters {
    display: flex;
    gap: var(--sp-3);
    margin-bottom: var(--sp-4);
  }
  .filters button {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0 var(--sp-3);
    cursor: pointer;
  }
  .filters button.active {
    color: var(--text);
    border-color: var(--accent);
  }
</style>

<script is:inline>
  const buttons = document.querySelectorAll('.filters button');
  const cards = document.querySelectorAll('.grid [data-type]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      cards.forEach((c) => {
        c.style.display = f === 'all' || c.getAttribute('data-type') === f ? '' : 'none';
      });
    });
  });
</script>
```

- [ ] **Step 3: Create `src/pages/productions/[slug].astro`** (build-time stats)

```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { fetchGithubStats, fetchAppStoreStats } from '../../lib/stats';

export const getStaticPaths = (async () => {
  const items = await getCollection('productions');
  return Promise.all(
    items.map(async (item) => {
      let stars: number | null = item.data.stars ?? null;
      let version: string | null = item.data.version ?? null;
      let rating: number | null = null;

      if (item.data.type === 'github' && item.data.repo) {
        const s = await fetchGithubStats(item.data.repo, {
          stars: item.data.stars ?? null,
          version: item.data.version ?? null,
        });
        stars = s.stars;
        version = s.version;
      } else if (item.data.type === 'appstore' && item.data.appStoreId) {
        const s = await fetchAppStoreStats(item.data.appStoreId, {
          rating: null,
          version: item.data.version ?? null,
        });
        rating = s.rating;
        version = s.version;
      }

      return { params: { slug: item.id }, props: { item, stars, version, rating } };
    }),
  );
}) satisfies GetStaticPaths;

const { item, stars, version, rating } = Astro.props;
const { Content } = await render(item);
---

<BaseLayout title={`${item.data.title} — wenanlin`} description={item.data.description}>
  <article class="prose">
    <h1>{item.data.title}</h1>
    <p class="stats">
      {stars !== null && <span>★ {stars}</span>}
      {version && <span>{version}</span>}
      {rating !== null && <span>{rating.toFixed(1)} rating</span>}
      {item.data.repo && <a href={`https://github.com/${item.data.repo}`}>GitHub</a>}
      {
        item.data.appStoreId && (
          <a href={`https://apps.apple.com/app/id${item.data.appStoreId}`}>App Store</a>
        )
      }
    </p>
    <Content />
  </article>
</BaseLayout>

<style>
  .stats {
    display: flex;
    gap: var(--sp-3);
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 4: Verify build (network may fetch live stats; fallback on failure)**

Run: `npx astro build`
Expected: succeeds; `dist/productions/index.html` and `dist/productions/sample-cli/index.html` exist.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductionCard.astro src/pages/productions/
git commit -m "feat: add productions list and detail pages"
```

---

## Task 19: Home page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import ProductionCard from '../components/ProductionCard.astro';
import PostCard from '../components/PostCard.astro';
import { filterDrafts, sortPostsByDate } from '../lib/blog';

const featured = (await getCollection('productions'))
  .filter((p) => p.data.featured)
  .sort((a, b) => a.data.order - b.data.order);

const latest = sortPostsByDate(filterDrafts(await getCollection('blog'))).slice(0, 5);
---

<BaseLayout title="wenanlin — Studio" description="Studio of wenanlin: products and writing.">
  <section>
    <h1>wenanlin</h1>
    <p class="prose">Independent studio building software. Products and writing below.</p>
  </section>

  <section>
    <h2>Featured</h2>
    <div class="grid">
      {
        featured.map((item) => (
          <ProductionCard
            title={item.data.title}
            description={item.data.description}
            type={item.data.type}
            featured={item.data.featured}
            url={`/productions/${item.id}`}
          />
        ))
      }
    </div>
    <p><a href="/productions">All productions →</a></p>
  </section>

  <section>
    <h2>Latest posts</h2>
    {
      latest.map((post) => (
        <PostCard
          title={post.data.title}
          description={post.data.description}
          date={post.data.date}
          tags={post.data.tags}
          url={`/blog/${post.id}`}
        />
      ))
    }
    <p><a href="/blog">All posts →</a></p>
  </section>
</BaseLayout>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--sp-4);
  }
  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 1024px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  section {
    margin-bottom: var(--sp-7);
  }
</style>
```

- [ ] **Step 2: Verify build**

Run: `npx astro build`
Expected: succeeds; `dist/index.html` exists with featured products and latest posts.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page"
```

---

## Task 20: Cloudflare Web Analytics + deploy config

**Files:**
- Modify: `src/components/BaseHead.astro`
- Create: `README.md` (deploy notes)

- [ ] **Step 1: Add the Cloudflare Web Analytics beacon to `BaseHead.astro`**

Append before the closing of the component template (replace `REPLACE_TOKEN` with the token from the Cloudflare dashboard once the site exists):

```astro
<script
  is:inline
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "REPLACE_TOKEN"}'></script>
```

- [ ] **Step 2: Create `README.md`**

```markdown
# wenanlin studio website

Astro static site. Deployed to Cloudflare Pages.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # astro build + pagefind index
```

## Deploy (Cloudflare Pages)

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Optional env var `GITHUB_TOKEN` (read-only) if GitHub API rate limits are hit during build.

## Post-setup checklist

- Enable Discussions on the repo and configure Giscus IDs in `src/components/Giscus.astro`.
- Add the Cloudflare Web Analytics token in `src/components/BaseHead.astro`.
- Set the production domain in `astro.config.mjs` (`site`).
- Update social links in `src/components/Footer.astro` and `Header.astro`.
```

- [ ] **Step 3: Full verification**

Run:
```bash
npx vitest run
npx astro check
npm run build
```
Expected: tests pass; check reports 0 errors; build + pagefind succeed; `dist/` is complete.

- [ ] **Step 4: Commit**

```bash
git add src/components/BaseHead.astro README.md
git commit -m "feat: add Cloudflare Web Analytics and deploy docs"
```

---

## Final verification checklist

- [ ] `npx vitest run` — all unit tests pass (blog helpers, stats fallback)
- [ ] `npx astro check` — 0 type errors
- [ ] `npm run build` — Astro build + Pagefind index succeed
- [ ] `npm run preview` — manually confirm: home, productions grid + filter, product detail with stats, blog list + pagination, post page + Giscus loads, tag page, search returns results, dark mode toggle persists, 404 page
- [ ] `dist/rss.xml`, `dist/sitemap-index.xml`, `dist/og/hello-world.png` exist

---

## Post-implementation manual setup (requires accounts/secrets — outside the plan)

1. Create GitHub repo, enable Discussions, run https://giscus.app to get IDs → fill `Giscus.astro`.
2. Create Cloudflare Pages project, get Web Analytics token → fill `BaseHead.astro`.
3. Point production domain; update `site` in `astro.config.mjs`.
4. Replace `public/og-default.png` with the real default share image.
