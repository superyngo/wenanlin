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
- Replace `public/og-default.png` with the real default share image.
