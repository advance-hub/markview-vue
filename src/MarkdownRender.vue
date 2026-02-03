<template>
  <div :class="wrapperClass" :style="style">
    <div :class="{ 'md-render-layout': showToc }">
      <!-- 主内容区 -->
      <div ref="contentRef" class="md-render-content">
        <Skeleton v-if="isLoading" />
        <component v-else :is="mdxComponent" v-bind="{ components: mergedComponents }" />
      </div>

      <!-- 右侧 TOC -->
      <aside v-if="showToc && tocItems.length > 0" class="md-render-toc">
        <div class="md-render-toc-inner">
          <div class="md-render-toc-title">{{ tocTitle }}</div>
          <nav class="md-render-toc-nav">
            <a
              v-for="item in tocItems"
              :key="item.id"
              :href="`#${item.id}`"
              class="md-render-toc-item"
              :class="[
                `md-render-toc-level-${item.level}`,
                { active: activeId === item.id }
              ]"
              @click="handleTocClick(item.id, $event)"
            >
              {{ item.text }}
            </a>
          </nav>
        </div>
      </aside>
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick, h } from 'vue';
import { evaluate } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import * as runtime from 'vue/jsx-runtime';
import type { PluggableList } from '@mdx-js/mdx/lib/core';
import type { MDXProps } from 'mdx/types';
import * as MarkdownComponents from './components';
import { CodeBlock, Table, Blockquote, ul, ol, li, hr, strong, em, del } from './components';
import { Skeleton, provideHeadingCollapse } from './base';
import './styles/index.scss';
import 'katex/dist/katex.min.css';

provideHeadingCollapse();

/** TOC 目录项类型 */
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
  /** 是否显示 TOC */
  showToc?: boolean;
  /** TOC 最小层级 */
  tocMinLevel?: number;
  /** TOC 最大层级 */
  tocMaxLevel?: number;
  /** TOC 标题 */
  tocTitle?: string;
  /** 是否显示回到顶部按钮 */
  showBackTop?: boolean;
  /** 回到顶部按钮显示阈值（滚动距离） */
  backTopThreshold?: number;
}

const props = withDefaults(defineProps<MarkdownRenderProps>(), {
  format: 'mdx',
  remarkGfm: true,
  raw: '',
  components: () => ({}),
  prefix: 'md',
  theme: 'light',
  showToc: false,
  tocMinLevel: 2,
  tocMaxLevel: 3,
  tocTitle: '目录',
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

// TOC 相关
const contentRef = ref<HTMLElement | null>(null);
const tocItems = ref<TocItem[]>([]);
const activeId = ref('');

// 回到顶部相关
const showBackTopButton = ref(false);

const wrapperClass = computed(() => {
  const classes = [cssPrefix.value];
  if (props.theme === 'dark') classes.push(`${cssPrefix.value}--dark`);
  if (props.className) classes.push(props.className);
  return classes.join(' ');
});

const mergedComponents = computed(() => {
  const wrapped: Record<string, any> = {
    pre: CodeBlock,
    table: Table,
    blockquote: Blockquote,
    ul,
    ol,
    li,
    hr,
    strong,
    em,
    del,
  };
  
  const all: Record<string, any> = { ...MarkdownComponents, ...props.components };
  
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
  rehypeList.push(rehypeKatex);
  
  return {
    remarkPlugins: remarkList,
    rehypePlugins: rehypeList,
    format: props.format,
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
    const result = await evaluate(mdxRaw, { ...getCompileOptions(), ...runtime });
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
        // 确保标题有 id
        let id = heading.id;
        if (!id) {
          id = (heading.textContent || '')
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u4e00-\u9fa5-]/g, '');
          heading.id = id;
        }
        
        items.push({
          level,
          text: heading.textContent || '',
          id,
        });
      }
    });
    
    tocItems.value = items;
    emit('toc-change', items);
    emit('rendered');
  });
}

// 处理滚动事件
function handleScroll() {
  const scrollTop = window.scrollY;
  
  // 更新回到顶部按钮显示状态
  if (props.showBackTop) {
    showBackTopButton.value = scrollTop > props.backTopThreshold;
  }
  
  // 更新 TOC 激活状态
  if (!props.showToc || tocItems.value.length === 0) return;
  
  const headings = tocItems.value
    .map((item) => document.getElementById(item.id))
    .filter(Boolean) as HTMLElement[];
  
  let currentId = '';
  for (const heading of headings) {
    if (heading.offsetTop <= scrollTop + 100) {
      currentId = heading.id;
    } else {
      break;
    }
  }
  
  activeId.value = currentId || (headings[0]?.id ?? '');
}

// 点击 TOC 项
function handleTocClick(id: string, event: Event) {
  event.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeId.value = id;
    history.replaceState(null, '', `#${id}`);
    
    // 触发事件
    const item = tocItems.value.find(t => t.id === id);
    if (item) {
      emit('toc-click', item);
    }
  }
}

// 回到顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  emit('scroll-to-top');
}

// 渲染完成后提取 TOC
watch(isLoading, (loading) => {
  if (!loading) {
    extractToc();
  }
});

onMounted(() => {
  compileAndRender(props.raw);
  
  if (props.showToc || props.showBackTop) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(() => props.raw, compileAndRender);
</script>
