import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = import.meta.dirname;
const src = path.resolve(root, 'src');

export default defineConfig({
  base: '/wuttichai.github.io/',
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    tailwindcss(),
    react(),
  ],

  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': src,
      '@components': path.resolve(src, 'components'),
      '@store': path.resolve(src, 'store'),
      '@domain': path.resolve(src, 'domain'),
      '@lib': path.resolve(src, 'lib'),
      '@motion': path.resolve(src, 'motion'),
      '@routes': path.resolve(src, 'routes'),
      '@styles': path.resolve(src, 'styles'),
      '@types': path.resolve(src, 'types'),
      '@package': path.resolve(root, 'package.json'),
    },
  },
});
