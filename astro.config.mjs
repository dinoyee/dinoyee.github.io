import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://dinoyee.github.io',
  output: 'static',
  integrations: [react(), mdx(), tailwind()],
});
