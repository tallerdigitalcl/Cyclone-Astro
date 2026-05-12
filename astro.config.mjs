import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://cyclone-astro.pages.dev', // ← Cambia esto por tu dominio real
  integrations: [sitemap(), tailwind()],
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      sourcemap: true,
    },
  },
  image: {
    // Permite imágenes externas desde Sanity CDN
    domains: ['cdn.sanity.io'],
  },
});
