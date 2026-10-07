import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  site: 'https://www.stelau.com', output: 'static', trailingSlash: 'always',
  i18n: { defaultLocale: 'fr', locales: ['fr', 'en'], routing: { prefixDefaultLocale: false } },
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, wrap: true } },
  vite: { plugins: [tailwindcss()] },
});
