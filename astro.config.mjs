import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to the production domain when DNS is set up.
export default defineConfig({
  site: 'https://wenanlin.pages.dev',
  output: 'static',
  integrations: [sitemap()],
});
