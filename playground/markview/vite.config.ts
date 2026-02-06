import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    dedupe: ['vue'],
  },
  optimizeDeps: {
    exclude: ['markview-vue'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    open: true,
    fs: {
      allow: ['..'],
    },
  },
});
