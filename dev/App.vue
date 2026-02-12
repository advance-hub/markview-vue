<template>
  <div class="pg" :class="{ 'pg--dark': theme === 'dark' }">
    <!-- 顶栏 -->
    <header class="pg__header">
      <div class="pg__brand">
        <h1 class="pg__title">Markview</h1>
        <span class="pg__tagline">写 Markdown，不折腾。</span>
      </div>

      <div class="pg__toolbar">
        <button
          class="pg__btn"
          :class="{ 'pg__btn--active': theme === 'dark' }"
          @click="theme = theme === 'light' ? 'dark' : 'light'"
        >{{ theme === 'light' ? '日间' : '夜间' }}</button>
        <button
          class="pg__btn"
          :class="{ 'pg__btn--active': showToc }"
          @click="showToc = !showToc"
        >目录{{ showToc ? ' ✓' : '' }}</button>
        <select v-model="tocMode" class="pg__sel">
          <option value="sidebar">目录侧边</option>
          <option value="embedded">目录嵌入</option>
        </select>
        <select v-model="currentFormat" class="pg__sel">
          <option value="mdx">MDX</option>
          <option value="md">MD</option>
        </select>
        <a href="https://www.npmjs.com/package/markview-vue" target="_blank" class="pg__link">npm</a>
        <a href="https://github.com/advance-hub/markview-vue" target="_blank" class="pg__link">GitHub</a>
      </div>
    </header>

    <!-- 主体：左右分栏 -->
    <main class="pg__main">
      <!-- 左侧编辑器 -->
      <section class="pg__editor" :style="{ flexBasis: splitPercent + '%' }">
        <div class="pg__panel-bar">
          <span class="pg__panel-label">Markdown</span>
          <span class="pg__panel-info">{{ editorContent.length }} chars</span>
        </div>
        <textarea
          ref="editorRef"
          class="pg__textarea"
          v-model="editorContent"
          spellcheck="false"
          placeholder="在这里输入 Markdown / MDX ..."
        />
      </section>

      <!-- 拖拽分隔条 -->
      <div class="pg__divider" @mousedown="startResize">
        <div class="pg__divider-line" />
      </div>

      <!-- 右侧预览 -->
      <section class="pg__preview" :style="{ flexBasis: (100 - splitPercent) + '%' }">
        <div class="pg__panel-bar">
          <span class="pg__panel-label">Preview</span>
        </div>
        <div class="pg__preview-body">
          <MarkdownRender
            :raw="editorContent"
            :format="currentFormat"
            :theme="theme"
            :show-toc="showToc"
            :toc-mode="tocMode"
            :components="customComponents"
            @rendered="onRendered"
            @toc-change="onTocChange"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import MarkdownRender from '../src/MarkdownRender.vue';
import '../src/styles/index.scss';
import demoMd from './content/demo.md?raw';
import * as CustomComponents from './components';

const theme = ref<'light' | 'dark'>('light');
const showToc = ref(false);
const tocMode = ref<'sidebar' | 'embedded'>('sidebar');
const currentFormat = ref<'md' | 'mdx'>('mdx');
const editorContent = ref(demoMd);
const splitPercent = ref(42);

// 注册所有自定义组件
const customComponents = CustomComponents;

// --- 拖拽分隔条 ---
let dragging = false;

function startResize(e: MouseEvent) {
  e.preventDefault();
  dragging = true;
  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
}

function onResize(e: MouseEvent) {
  if (!dragging) return;
  const main = document.querySelector('.pg__main') as HTMLElement;
  if (!main) return;
  const rect = main.getBoundingClientRect();
  let pct = ((e.clientX - rect.left) / rect.width) * 100;
  pct = Math.max(20, Math.min(80, pct));
  splitPercent.value = pct;
}

function stopResize() {
  dragging = false;
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
}

onUnmounted(() => stopResize());

const onRendered = () => {
  console.log('渲染完了');
};
const onTocChange = (toc: any[]) => {
  console.log('目录更新:', toc.length, '个');
};
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* ---- 页面 ---- */
.pg {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #f5f3f0;
  color: #2d2a26;
}
.pg--dark {
  background: #1a1918;
  color: #e8e4dd;
}

/* ---- 顶栏 ---- */
.pg__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 52px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0,0,0,.08);
  background: rgba(255,255,255,.6);
  backdrop-filter: blur(12px);
}
.pg--dark .pg__header {
  background: rgba(30,28,26,.7);
  border-bottom-color: rgba(255,255,255,.06);
}
.pg__brand { display: flex; align-items: baseline; gap: 10px; }
.pg__title { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; }
.pg--dark .pg__title { color: #f5f2ed; }
.pg__tagline { font-size: 0.8rem; color: #8a8480; }

.pg__toolbar { display: flex; align-items: center; gap: 8px; }

.pg__btn {
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #5c564e;
  background: transparent;
  border: 1.5px solid #d4cfc6;
  border-radius: 100px;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.pg__btn:hover { border-color: #a39990; color: #3d3832; }
.pg__btn--active { background: #3d3832; border-color: #3d3832; color: #faf9f7; }
.pg--dark .pg__btn { color: #a39e96; border-color: #4a453e; }
.pg--dark .pg__btn:hover { border-color: #6b635a; color: #d4cfc6; }
.pg--dark .pg__btn--active { background: #f5f2ed; border-color: #f5f2ed; color: #1a1816; }

.pg__sel {
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #5c564e;
  background: #faf9f7;
  border: 1.5px solid #d4cfc6;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
}
.pg--dark .pg__sel { background: #2a2725; color: #a39e96; border-color: #4a453e; }

.pg__link {
  font-size: 0.75rem;
  color: #6b635a;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color .15s;
}
.pg__link:hover { color: #2d2a26; }
.pg--dark .pg__link { color: #8a8480; }
.pg--dark .pg__link:hover { color: #e8e4dd; }

/* ---- 主体分栏 ---- */
.pg__main {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* ---- 编辑器 ---- */
.pg__editor {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}
.pg__panel-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 34px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0,0,0,.06);
  background: rgba(255,255,255,.4);
}
.pg--dark .pg__panel-bar {
  background: rgba(30,28,26,.5);
  border-bottom-color: rgba(255,255,255,.05);
}
.pg__panel-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: #8a8480; }
.pg__panel-info { font-size: 0.65rem; color: #b0aaa2; font-variant-numeric: tabular-nums; }

.pg__textarea {
  flex: 1;
  width: 100%;
  padding: 20px;
  border: none;
  outline: none;
  resize: none;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', Menlo, Consolas, monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: #2d2a26;
  background: #faf9f7;
  tab-size: 2;
}
.pg--dark .pg__textarea {
  background: #1e1c1a;
  color: #d4cfc6;
}
.pg__textarea::placeholder { color: #c0bab2; }
.pg--dark .pg__textarea::placeholder { color: #4a453e; }

/* ---- 分隔条 ---- */
.pg__divider {
  width: 8px;
  flex-shrink: 0;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background .15s;
  z-index: 2;
}
.pg__divider:hover,
.pg__divider:active {
  background: rgba(0,0,0,.04);
}
.pg--dark .pg__divider:hover,
.pg--dark .pg__divider:active {
  background: rgba(255,255,255,.04);
}
.pg__divider-line {
  width: 2px;
  height: 32px;
  border-radius: 1px;
  background: #d4cfc6;
  transition: background .15s, height .15s;
}
.pg__divider:hover .pg__divider-line {
  background: #a39990;
  height: 48px;
}
.pg--dark .pg__divider-line { background: #4a453e; }
.pg--dark .pg__divider:hover .pg__divider-line { background: #6b635a; }

/* ---- 预览 ---- */
.pg__preview {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}
.pg__preview-body {
  flex: 1;
  overflow-y: auto;
  background: #fff;
}
.pg--dark .pg__preview-body {
  background: #252321;
}
.pg__preview-body :deep(.md-render) {
  border-radius: 0;
  box-shadow: none;
  border: none;
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .pg__main { flex-direction: column; }
  .pg__editor, .pg__preview { flex-basis: 50% !important; }
  .pg__divider { width: 100%; height: 8px; cursor: row-resize; }
  .pg__divider-line { width: 32px; height: 2px; }
  .pg__header { flex-wrap: wrap; height: auto; padding: 10px 16px; gap: 8px; }
  .pg__toolbar { flex-wrap: wrap; }
}
</style>
