import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist',
      staticImport: true,
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MarkviewVue',
    },
    rollupOptions: {
      external: ['vue', 'vue/jsx-runtime'],
      output: [
        {
          format: 'es',
          entryFileNames: 'index.js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'style.css';
            return 'assets/[name]-[hash][extname]';
          },
          globals: { vue: 'Vue' },
        },
        {
          format: 'cjs',
          entryFileNames: 'index.cjs',
          chunkFileNames: 'assets/[name]-[hash].cjs',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'style.css';
            return 'assets/[name]-[hash][extname]';
          },
          globals: { vue: 'Vue' },
        },
      ],
    },
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
});
