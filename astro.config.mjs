import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkWiki from './src/lib/remark-wiki.mjs';

const site = new URL(process.env.SITE_URL ?? 'https://wiki.guisso.dev/');
const base = '/' + (process.env.PUBLIC_BASE_PATH ?? process.env.BASE_PATH ?? site.pathname)
  .replace(/^\/+|\/+$/g, '');

export default defineConfig({
  site: site.origin,
  base,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (url) => !new URL(url).pathname.endsWith('/404/') })],
  markdown: {
    smartypants: false,
    remarkPlugins: [[remarkWiki, { base }]],
    shikiConfig: {
      themes: { light: 'github-light-high-contrast', dark: 'github-dark' },
      defaultColor: false,
      wrap: false,
    },
  },
});
