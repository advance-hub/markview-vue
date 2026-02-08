<template>
  <div ref="wrapperRef" :class="wrapperClass" :style="computedStyle">
    <div :class="layoutClass">
      <!-- 主内容区 -->
      <div ref="contentRef" class="md-render-content">
        <Skeleton v-if="isLoading" />
        <component v-else :is="mdxComponent" v-bind="{ components: mergedComponents }" />
      </div>

      <!-- 右侧 TOC -->
      <Toc
        v-if="showToc && tocItems.length > 0"
        :items="tocItems"
        :doc-title="docTitle"
        :min-level="tocMinLevel"
        :max-level="tocMaxLevel"
        :active-id="activeId"
        :mode="tocMode"
        :sticky-top="tocStickyTop"
        :scroll-container="scrollContainer"
        @click="handleTocClick"
        @update:active-id="activeId = $event"
      />
    </div>

    <!-- 回到顶部按钮 -->
    <Transition name="md-fade">
      <button
        v-if="showBackTop && showBackTopButton"
        class="md-render-back-top"
        @click="scrollToTop"
        title="回到顶部"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, h, defineComponent } from 'vue';
import { evaluate } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import * as runtime from 'vue/jsx-runtime';
import type { PluggableList } from '@mdx-js/mdx/lib/core';
import type { MDXProps } from 'mdx/types';
import * as MarkdownComponents from './components';
import { CodeBlock, Table, Blockquote, Container, ul, ol, hr, strong, em, del, Toc } from './components';
import { Skeleton, provideHeadingCollapse, generateHeadingId } from './base';
import { preprocessContainers } from './utils';
import './styles/index.scss';
import 'katex/dist/katex.min.css';

provideHeadingCollapse();

export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export interface MarkdownRenderProps {
  /** Markdown/MDX 原始内容 */
  raw?: string;
  /** 自定义组件映射 */
  components?: MDXProps['components'];
  /** 内容格式 */
  format?: 'md' | 'mdx';
  /** remark 插件列表 */
  remarkPlugins?: PluggableList;
  /** rehype 插件列表 */
  rehypePlugins?: PluggableList;
  /** 是否启用 GFM 扩展 */
  remarkGfm?: boolean;
  /** 自定义样式 */
  style?: Record<string, any>;
  /** 自定义类名 */
  className?: string;
  /** CSS 类名前缀 */
  prefix?: string;
  /** 主题模式 */
  theme?: 'light' | 'dark';
  /** 固定高度（设置后启用内部滚动模式），如 '500px' 或 'calc(100vh - 60px)' */
  height?: string;
  /** 最大高度（设置后超出部分可滚动），如 '80vh' */
  maxHeight?: string;
  /** 是否显示 TOC */
  showToc?: boolean;
  /** TOC 最小层级（默认 2，即 H2） */
  tocMinLevel?: number;
  /** TOC 最大层级（默认 4，即 H4） */
  tocMaxLevel?: number;
  /** TOC 文档标题（H1 内容，显示在 TOC 顶部） */
  docTitle?: string;
  /** TOC 布局模式：sidebar 固定侧边栏 / embedded 嵌入式 */
  tocMode?: 'sidebar' | 'embedded';
  /** TOC sticky 定位的 top 偏移量（如页面有固定顶栏，需传入顶栏高度 + 间距），如 '77px' */
  tocStickyTop?: string;
  /** 是否显示回到顶部按钮 */
  showBackTop?: boolean;
  /** 回到顶部按钮显示阈值（滚动距离） */
  backTopThreshold?: number;
}

const props = withDefaults(defineProps<MarkdownRenderProps>(), {
  format: 'md',
  remarkGfm: true,
  raw: '',
  components: () => ({}),
  prefix: 'md',
  theme: 'light',
  showToc: false,
  tocMinLevel: 2,
  tocMaxLevel: 4,
  tocMode: 'sidebar',
  showBackTop: false,
  backTopThreshold: 300,
});

const emit = defineEmits<{
  /** 渲染完成 */
  rendered: [];
  /** 渲染错误 */
  error: [error: Error];
  /** TOC 目录变化 */
  'toc-change': [toc: TocItem[]];
  /** 点击回到顶部 */
  'scroll-to-top': [];
  /** 点击 TOC 项 */
  'toc-click': [item: TocItem];
}>();

const cssPrefix = computed(() => `${props.prefix}-render`);
const mdxComponent = ref<any>('div');
const isLoading = ref(true);

// 容器引用
const wrapperRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

// TOC 相关
const tocItems = ref<TocItem[]>([]);
const activeId = ref('');

// 回到顶部相关
const showBackTopButton = ref(false);

// 是否使用固定高度模式（内部滚动）
const isFixedHeight = computed(() => !!(props.height || props.maxHeight));

// 滚动容器：固定高度模式下是 wrapper，否则是 window
const scrollContainer = computed(() => isFixedHeight.value ? wrapperRef.value : null);

const wrapperClass = computed(() => {
  const classes = [cssPrefix.value];
  if (props.theme === 'dark') classes.push(`${cssPrefix.value}--dark`);
  if (isFixedHeight.value) classes.push(`${cssPrefix.value}--scrollable`);
  if (props.className) classes.push(props.className);
  return classes.join(' ');
});

const layoutClass = computed(() => {
  const classes: string[] = [];
  if (props.showToc) classes.push('md-render-layout');
  return classes;
});

// 合并样式（包含 height/maxHeight）
const computedStyle = computed(() => {
  const styles: Record<string, any> = { ...props.style };
  if (props.height) styles.height = props.height;
  if (props.maxHeight) styles.maxHeight = props.maxHeight;
  return styles;
});

const mergedComponents = computed(() => {
  const wrapped: Record<string, any> = {
    pre: CodeBlock,
    table: Table,
    blockquote: Blockquote,
    MdContainer: Container, // 自定义容器组件 (::: tip, ::: warning, ::: danger, ::: info)
    ul,
    ol,
    // li 使用原生元素，不做自定义映射
    hr,
    strong,
    em,
    del,
  };
  
  // 排除 li - 让 MDX 使用原生 li 元素，避免任务列表检测问题
  const { li: _li, ListItem: _ListItem, ...filteredComponents } = MarkdownComponents as any;
  const all: Record<string, any> = { ...filteredComponents, ...props.components };
  
  Object.keys(all).forEach(key => {
    const comp = all[key];
    if (typeof comp === 'function' && !comp.setup && !comp.render) {
      wrapped[key] = {
        name: `MDX${key.charAt(0).toUpperCase() + key.slice(1)}`,
        props: Object.keys(Object.getOwnPropertyDescriptors(comp)).length > 0 
          ? ['children', ...Object.keys(comp)] 
          : undefined,
        setup(p: any, { slots }: any) {
          return () => comp(p, { slots });
        }
      };
    } else if (!wrapped[key]) {
      wrapped[key] = comp;
    }
  });
  
  return wrapped;
});

function getCompileOptions() {
  const remarkList = [...(props.remarkPlugins ?? [])];
  if (props.remarkGfm) remarkList.unshift(remarkGfm);
  remarkList.push(remarkMath);
  
  const rehypeList = [...(props.rehypePlugins ?? [])];
  // format: 'md' 时需要 rehype-raw 才能渲染 markdown 中的 HTML 块（如 <div>, <img> 等）
  if (props.format === 'md') {
    rehypeList.push(rehypeRaw);
  }
  rehypeList.push(rehypeKatex);
  
  return {
    remarkPlugins: remarkList,
    rehypePlugins: rehypeList,
    format: props.format,
    // 禁用动态 import，所有组件通过 components prop 传入
    useDynamicImport: false,
    // baseUrl 用于解析相对路径（虽然已禁用动态 import，但某些场景可能需要）
    baseUrl: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
  };
}

async function compileAndRender(mdxRaw: string) {
  if (!mdxRaw) {
    mdxComponent.value = 'div';
    isLoading.value = false;
    emit('rendered');
    return;
  }
  
  isLoading.value = true;
  
  try {
    let processedContent = mdxRaw;

    if (props.format === 'mdx') {
      // MDX 模式：将 ::: 容器语法转换为 JSX 组件
      processedContent = preprocessContainers(processedContent);
    }
    
    const result = await evaluate(processedContent, { ...getCompileOptions(), ...runtime });
    mdxComponent.value = result.default;
  } catch (error) {
    console.error('Markdown 渲染错误:', error);
    const err = error instanceof Error ? error : new Error(String(error));
    emit('error', err);
    mdxComponent.value = () => h('div', { 
      style: 'padding: 20px; color: #dc2626; border: 1px solid #fecaca; border-radius: 8px; background: #fef2f2;' 
    }, [
      h('h3', { style: 'margin: 0 0 8px; font-size: 16px;' }, 'Markdown 渲染错误'),
      h('pre', { style: 'white-space: pre-wrap; font-size: 12px; margin: 0;' }, err.message)
    ]);
  } finally {
    isLoading.value = false;
  }
}

// 从 DOM 中提取 TOC
function extractToc() {
  if (!contentRef.value) return;
  
  nextTick(() => {
    const headings = contentRef.value?.querySelectorAll('h1, h2, h3, h4, h5, h6') || [];
    const items: TocItem[] = [];
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName[1], 10);
      if (level >= props.tocMinLevel && level <= props.tocMaxLevel) {
        // 优先使用已有的 id（Heading 组件已设置）
        let id = heading.id;
        
        // 提取文本内容：优先从 .md-heading__text 获取，避免包含 toggle icon
        const textSpan = heading.querySelector('.md-heading__text');
        const text = textSpan?.textContent?.trim() || heading.textContent?.trim() || '';
        
        // 如果没有 id，为非 Heading 组件的标题生成唯一 ID
        if (!id && text) {
          id = generateHeadingId(text);
          heading.id = id;
        }
        
        // 跳过没有有效 id 的标题
        if (!id) return;
        
        items.push({
          level,
          text,
          id,
        });
      }
    });
    
    tocItems.value = items;
    emit('toc-change', items);
    emit('rendered');
  });
}

// 获取滚动距离
function getScrollTop(): number {
  if (isFixedHeight.value && wrapperRef.value) {
    return wrapperRef.value.scrollTop;
  }
  return window.scrollY;
}

// 处理滚动事件（只处理回到顶部按钮，TOC 激活由 Toc 组件处理）
function handleScroll() {
  if (props.showBackTop) {
    showBackTopButton.value = getScrollTop() > props.backTopThreshold;
  }
}

// 点击 TOC 项（从 Toc 组件接收）
function handleTocClick(item: TocItem) {
  emit('toc-click', item);
}

// 回到顶部
function scrollToTop() {
  if (isFixedHeight.value && wrapperRef.value) {
    wrapperRef.value.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  emit('scroll-to-top');
}

// 渲染完成后提取 TOC
watch(isLoading, (loading) => {
  if (!loading) {
    extractToc();
  }
});

// 绑定滚动监听
function bindScrollListener() {
  if (props.showBackTop) {
    const target = isFixedHeight.value && wrapperRef.value ? wrapperRef.value : window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}

// 解绑滚动监听
function unbindScrollListener() {
  if (wrapperRef.value) {
    wrapperRef.value.removeEventListener('scroll', handleScroll);
  }
  window.removeEventListener('scroll', handleScroll);
}

onMounted(() => {
  compileAndRender(props.raw);
  
  nextTick(() => {
    bindScrollListener();
  });
});

onUnmounted(() => {
  unbindScrollListener();
});

watch(() => props.raw, compileAndRender);
</script>
