import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  
  return {
    plugins: [
      vue(),
      // 只在 build 时生成类型文件
      ...(!isDev ? [dts({
        include: ['src/**/*.ts', 'src/**/*.vue'],
        outDir: 'dist',
        staticImport: true,
        insertTypesEntry: true,
        rollupTypes: true,
      })] : []),
    ],
    // dev 模式使用 dev/index.html
    root: isDev ? resolve(__dirname, 'dev') : __dirname,
    build: isDev ? {
      // dev 模式打包成静态站点
      outDir: resolve(__dirname, 'demo-dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'dev/index.html'),
      },
    } : {
      // 库模式打包
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'MarkviewVue',
        cssFileName: 'style',
      },
      rollupOptions: {
        external: ['vue', 'vue/jsx-runtime'],
        output: [
          {
            format: 'es',
            entryFileNames: 'index.js',
            chunkFileNames: 'assets/[name]-[hash].js',
            globals: { vue: 'Vue' },
          },
          {
            format: 'cjs',
            entryFileNames: 'index.cjs',
            chunkFileNames: 'assets/[name]-[hash].cjs',
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
    server: {
      port: 3002,
      open: true,
    },
  };
});
