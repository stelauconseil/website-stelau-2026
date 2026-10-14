import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  site: 'https://www.stelau.com', output: 'static', trailingSlash: 'always',
  i18n: { defaultLocale: 'fr', locales: ['fr', 'en'], routing: { prefixDefaultLocale: false } },
  integrations: [mdx(), react(), sitemap({filter:page=>!/^\/(expertises|en\/expertise)\/(conseil|audit|developpement)\/$/.test(new URL(page).pathname)})],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, wrap: true } },
  vite: { plugins: [tailwindcss()] },
});
