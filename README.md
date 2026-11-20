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

## Configuration

Site settings live in code: Giscus IDs in `src/components/Giscus.astro`, the Cloudflare Web Analytics token in `src/components/BaseHead.astro`, the production domain in `astro.config.mjs` (`site`), social links in `src/components/Footer.astro` and `Header.astro`, and the default share image at `public/og-default.png`.

Documentation index: [CONTEXT.md](CONTEXT.md).
