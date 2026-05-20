import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 4321,
  },
});
