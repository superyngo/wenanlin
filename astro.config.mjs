import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.turkeyang.net',
  output: 'static',
  integrations: [sitemap()],
});
