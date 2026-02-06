import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';
  const isBuildDemo = mode === 'demo';
  
  return {
    plugins: [
      vue(),
      // 只在构建库时生成类型文件
      ...(!isDev && !isBuildDemo ? [dts({
        include: ['src/**/*.ts', 'src/**/*.vue'],
        outDir: 'dist',
        staticImport: true,
        insertTypesEntry: true,
        rollupTypes: true,
      })] : []),
    ],
    // dev 模式或构建 demo 时使用 dev/ 目录
    root: (isDev || isBuildDemo) ? resolve(__dirname, 'dev') : __dirname,
    // 演示站点使用相对路径，支持任意目录部署
    base: isBuildDemo ? './' : '/',
    build: isBuildDemo ? {
      // 构建演示站点（dev/ 打包成静态站点）
      outDir: resolve(__dirname, 'demo-dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'dev/index.html'),
      },
    } : {
      // 构建库文件（src/ 打包成 npm 包）
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
