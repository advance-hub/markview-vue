<template>
  <div class="pg" :class="{ 'pg--dark': theme === 'dark' }">
    <!-- 噪点纹理层 -->
    <div class="pg__noise"></div>
    
    <!-- 顶部区域 - 不对称布局 -->
    <header class="pg__header">
      <div class="pg__brand">
        <h1 class="pg__title">Markview</h1>
        <p class="pg__tagline">写 Markdown，不折腾。</p>
      </div>
      
      <nav class="pg__links">
        <a href="https://www.npmjs.com/package/markview-vue" target="_blank" class="pg__link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0v24h24V0H0zm6.168 18.672H4.08V9.12h2.088v9.552zm6.672 0H6.912v-12H12v2.4H9.336v9.6h3.504v-12h6.24v12h-2.088V9.12h-4.152v9.552z"/>
          </svg>
          <span>npm</span>
        </a>
        <a href="https://github.com/advance-hub/markview-vue" target="_blank" class="pg__link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>源码</span>
        </a>
      </nav>
    </header>

    <!-- 控制面板 - 左对齐，紧凑 -->
    <aside class="pg__controls">
      <div class="pg__control-row">
        <button 
          class="pg__toggle" 
          :class="{ 'pg__toggle--active': theme === 'dark' }"
          @click="theme = theme === 'light' ? 'dark' : 'light'"
        >
          {{ theme === 'light' ? '日间' : '夜间' }}
        </button>
        
        <button 
          class="pg__toggle" 
          :class="{ 'pg__toggle--active': showToc }"
          @click="showToc = !showToc"
        >
          目录{{ showToc ? ' ✓' : '' }}
        </button>

        <button 
          class="pg__toggle" 
          :class="{ 'pg__toggle--active': showBackTop }"
          @click="showBackTop = !showBackTop"
        >
          回顶{{ showBackTop ? ' ✓' : '' }}
        </button>
      </div>
      
      <div class="pg__control-row">
        <select v-model="tocMode" class="pg__select">
          <option value="sidebar">目录在右边</option>
          <option value="embedded">目录嵌在里面</option>
        </select>
        
        <select v-model="heightMode" class="pg__select">
          <option value="auto">高度随内容</option>
          <option value="fixed">锁死高度</option>
          <option value="max">最高600px</option>
        </select>
      </div>
    </aside>

    <!-- 内容区 - 偏左 -->
    <main class="pg__content">
      <MarkdownRender
        :raw="demoMd"
        :theme="theme"
        :show-toc="showToc"
        :toc-mode="tocMode"
        :show-back-top="showBackTop"
        :height="computedHeight"
        :max-height="computedMaxHeight"
        :components="customComponents"
        @rendered="onRendered"
        @toc-change="onTocChange"
      />
    </main>

    <!-- 底部 - 简洁 -->
    <footer class="pg__footer">
      <p>Vue 3 组件，渲染 Markdown 用的。</p>
      <p class="pg__footer-sub">Shiki 高亮 / KaTeX 公式 / GFM 扩展</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MarkdownRender from '../src/MarkdownRender.vue';
import '../src/styles/index.scss';
import demoMd from './content/demo.md?raw';
// import componentDemoMd from './content/component-demo.md?raw'; // 切换到组件演示
import * as CustomComponents from './components';

const theme = ref<'light' | 'dark'>('light');
const showToc = ref(true);
const showBackTop = ref(true);
const tocMode = ref<'sidebar' | 'embedded'>('sidebar');
const heightMode = ref<'auto' | 'fixed' | 'max'>('auto');

// 注册所有自定义组件
const customComponents = CustomComponents;

const computedHeight = computed(() => {
  if (heightMode.value === 'fixed') {
    return 'calc(100vh - 240px)';
  }
  return undefined;
});

const computedMaxHeight = computed(() => {
  if (heightMode.value === 'max') {
    return '600px';
  }
  return undefined;
});

const onRendered = () => {
  console.log('渲染完了');
};

const onTocChange = (toc: any[]) => {
  console.log('目录更新:', toc.length, '个');
};
</script>

<style>
/* 基础重置 */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
}

/* 页面容器 */
.pg {
  min-height: 100vh;
  position: relative;
  background: 
    linear-gradient(175deg, #faf9f7 0%, #f0ede8 40%, #e8e4dd 100%);
  color: #2d2a26;
}

.pg--dark {
  background: 
    linear-gradient(175deg, #1a1918 0%, #242220 40%, #1f1d1b 100%);
  color: #e8e4dd;
}

/* 噪点纹理 */
.pg__noise {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
}

.pg--dark .pg__noise {
  opacity: 0.05;
}

/* 头部 */
.pg__header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 32px 40px 24px;
  max-width: 1400px;
}

.pg__brand {
  /* 不完美对齐 */
  transform: rotate(-0.5deg);
}

.pg__title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #1a1816;
  margin-bottom: 4px;
}

.pg--dark .pg__title {
  color: #f5f2ed;
}

.pg__tagline {
  font-size: 1rem;
  color: #6b635a;
  font-weight: 400;
}

.pg--dark .pg__tagline {
  color: #a39e96;
}

/* 链接 */
.pg__links {
  display: flex;
  gap: 16px;
  padding-top: 8px;
}

.pg__link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(45, 42, 38, 0.06);
  color: #4a453e;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.pg__link:hover {
  background: rgba(45, 42, 38, 0.1);
  border-color: rgba(45, 42, 38, 0.15);
  transform: translateY(-1px);
}

.pg--dark .pg__link {
  background: rgba(255, 255, 255, 0.08);
  color: #c9c4bc;
}

.pg--dark .pg__link:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.1);
}

/* 控制面板 */
.pg__controls {
  position: relative;
  z-index: 1;
  padding: 0 40px 20px;
  max-width: 1400px;
}

.pg__control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.pg__control-row:last-child {
  margin-bottom: 0;
}

.pg__toggle {
  padding: 6px 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #5c564e;
  background: transparent;
  border: 1.5px solid #d4cfc6;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.pg__toggle:hover {
  border-color: #a39990;
  color: #3d3832;
}

.pg__toggle--active {
  background: #3d3832;
  border-color: #3d3832;
  color: #faf9f7;
}

.pg--dark .pg__toggle {
  color: #a39e96;
  border-color: #4a453e;
}

.pg--dark .pg__toggle:hover {
  border-color: #6b635a;
  color: #d4cfc6;
}

.pg--dark .pg__toggle--active {
  background: #f5f2ed;
  border-color: #f5f2ed;
  color: #1a1816;
}

.pg__select {
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #5c564e;
  background: #faf9f7;
  border: 1.5px solid #d4cfc6;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.pg__select:hover {
  border-color: #a39990;
}

.pg--dark .pg__select {
  background: #2a2725;
  color: #a39e96;
  border-color: #4a453e;
}

.pg--dark .pg__select:hover {
  border-color: #6b635a;
}

/* 内容区 */
.pg__content {
  position: relative;
  z-index: 1;
  padding: 0 40px 40px;
  max-width: 1400px;
}

.pg__content :deep(.md-render) {
  background: #fff;
  border-radius: 12px;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.pg--dark .pg__content :deep(.md-render) {
  background: #252321;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.06);
}

/* 底部 */
.pg__footer {
  position: relative;
  z-index: 1;
  padding: 32px 40px;
  text-align: left;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.pg--dark .pg__footer {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.pg__footer p {
  font-size: 0.875rem;
  color: #6b635a;
  margin-bottom: 4px;
}

.pg__footer-sub {
  font-size: 0.75rem !important;
  color: #a39990 !important;
}

.pg--dark .pg__footer p {
  color: #6b635a;
}

.pg--dark .pg__footer-sub {
  color: #4a453e !important;
}

/* 响应式 */
@media (max-width: 768px) {
  .pg__header {
    flex-direction: column;
    gap: 16px;
    padding: 24px 20px 16px;
  }
  
  .pg__brand {
    transform: none;
  }
  
  .pg__title {
    font-size: 1.75rem;
  }
  
  .pg__controls {
    padding: 0 20px 16px;
  }
  
  .pg__content {
    padding: 0 20px 24px;
  }
  
  .pg__footer {
    padding: 24px 20px;
  }
}
</style>
