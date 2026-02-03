<template>
  <aside :class="tocClass">
    <div class="md-toc-inner">
      <!-- 目录导航 - Delight Anchor 风格 -->
      <nav class="md-toc-nav">
        <a
          v-for="item in filteredItems"
          :key="item.id"
          :href="`#${item.id}`"
          :class="[
            'md-toc-link',
            `md-toc-link--level-${item.level}`,
            { 'md-toc-link--active': activeId === item.id }
          ]"
          :style="{ paddingLeft: `${(item.level - props.minLevel) * 12}px` }"
          :title="item.text"
          @click="handleClick(item, $event)"
        >
          <span class="md-toc-link-text">{{ item.text }}</span>
        </a>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';

/** TOC 目录项类型 */
export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export interface TocProps {
  /** 目录项列表 */
  items: TocItem[];
  /** 文档标题（H1） */
  docTitle?: string;
  /** 最小层级，默认 2 */
  minLevel?: number;
  /** 最大层级，默认 4 */
  maxLevel?: number;
  /** 当前激活项 ID */
  activeId?: string;
  /** 布局模式：sidebar 固定侧边栏 / embedded 嵌入式 */
  mode?: 'sidebar' | 'embedded';
  /** 自定义类名 */
  className?: string;
  /** 滚动容器（默认 window，固定高度模式下传入容器元素） */
  scrollContainer?: HTMLElement | null;
}

const props = withDefaults(defineProps<TocProps>(), {
  minLevel: 2,
  maxLevel: 4,
  mode: 'sidebar',
});

const emit = defineEmits<{
  /** 点击目录项 */
  click: [item: TocItem];
  /** 激活项变化 */
  'update:activeId': [id: string];
}>();

// 过滤后的目录项（只保留 H2-H4）
const filteredItems = computed(() => {
  return props.items.filter(
    (item) => item.level >= props.minLevel && item.level <= props.maxLevel
  );
});

// 组件类名
const tocClass = computed(() => {
  const classes = ['md-toc', `md-toc-${props.mode}`];
  if (props.className) classes.push(props.className);
  return classes;
});

// 内部激活状态
const internalActiveId = ref(props.activeId || '');

// 同步外部 activeId
watch(
  () => props.activeId,
  (val) => {
    if (val !== undefined) {
      internalActiveId.value = val;
    }
  }
);

// 计算属性：当前激活 ID
const activeId = computed(() => internalActiveId.value);

// 点击目录项
function handleClick(item: TocItem, event: Event) {
  event.preventDefault();
  
  const element = document.getElementById(item.id);
  if (element) {
    // 立即更新激活状态（不等 IntersectionObserver）
    internalActiveId.value = item.id;
    emit('update:activeId', item.id);
    emit('click', item);
    
    // 滚动到目标位置
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 更新 URL hash（静默更新，不触发跳转）
    history.replaceState(null, '', `#${item.id}`);
  }
}

// IntersectionObserver 实例
let observer: IntersectionObserver | null = null;

// 记录每个标题的 intersectionRatio（用于判断哪个最可见）
const headingVisibility = ref<Map<string, number>>(new Map());

// 设置 IntersectionObserver
function setupObserver() {
  // 清理旧的 observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  
  if (filteredItems.value.length === 0) return;
  
  // 创建 observer
  observer = new IntersectionObserver(
    (entries) => {
      // 更新标题可见性（只记录是否可见，不记录位置）
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          headingVisibility.value.set(id, 1);
        } else {
          headingVisibility.value.delete(id);
        }
      });
      
      // 找到应该激活的标题
      let activeHeading: TocItem | null = null;
      
      // 策略：从上往下遍历，找到最后一个"已经滚过视口顶部"的标题
      // 这样可以确保：向下滚动时逐个激活，向上滚动时也能正确回退
      for (const item of filteredItems.value) {
        const element = document.getElementById(item.id);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        
        // 如果标题在视口顶部以上或刚进入顶部区域（100px 阈值）
        if (rect.top <= 100) {
          activeHeading = item;
          // 继续找，直到找到最后一个满足条件的
        } else {
          // 标题还在下方，不再继续
          break;
        }
      }
      
      // 如果没找到（页面刚加载或滚到最顶部），激活第一个
      if (!activeHeading && filteredItems.value.length > 0) {
        activeHeading = filteredItems.value[0];
      }
      
      // 更新激活状态
      if (activeHeading && internalActiveId.value !== activeHeading.id) {
        internalActiveId.value = activeHeading.id;
        emit('update:activeId', activeHeading.id);
      }
    },
    {
      root: props.scrollContainer || null,
      // 观察整个视口，这样可以准确获取所有标题的位置
      rootMargin: '0px',
      threshold: 0,
    }
  );
  
  // 观察所有标题元素
  filteredItems.value.forEach((item) => {
    const element = document.getElementById(item.id);
    if (element && observer) {
      observer.observe(element);
    }
  });
}

// 监听 scrollContainer 变化
watch(
  () => props.scrollContainer,
  () => {
    nextTick(() => {
      setupObserver();
    });
  }
);

// 监听 items 变化，重新设置 observer
watch(
  () => props.items,
  () => {
    nextTick(() => {
      setupObserver();
    });
  },
  { deep: true, flush: 'post' }
);

onMounted(() => {
  nextTick(() => {
    setupObserver();
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<style lang="scss">
// TOC 组件样式 - Delight Anchor 风格

// CSS 变量 - 使用者可通过覆盖这些变量自定义
.md-toc {
  --toc-width: 160px;
  --toc-top: 16px;
  --toc-max-height: calc(100vh - 76px);
  --toc-text: #646a73;
  --toc-text-hover: #1f2329;
  --toc-text-active: #1f2329;
  --toc-rail: #e5e6eb;
  --toc-rail-active: #3370ff;
}

// 暗黑模式
[data-theme="dark"] .md-toc,
.md-render--dark .md-toc {
  --toc-text: #8f959e;
  --toc-text-hover: #f0f1f2;
  --toc-text-active: #f0f1f2;
  --toc-rail: #3d3d3f;
  --toc-rail-active: #4e83fd;
}

// ====== 固定侧边栏模式 ======
.md-toc-sidebar {
  position: sticky;
  top: var(--toc-top);
  flex-shrink: 0;
  width: var(--toc-width);
  max-height: var(--toc-max-height);
  padding-bottom: 20px;
  overflow: auto;
  
  // 隐藏滚动条
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.md-toc-inner {
  padding: 0;
}

// 目录导航
.md-toc-nav {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  
  // 左侧轨道线
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--toc-rail);
    border-radius: 1px;
  }
}

// 目录链接 - 使用 a.md-toc-link 提高优先级，覆盖 .md-render a 的样式
a.md-toc-link {
  position: relative;
  display: block;
  padding: 4px 0;
  color: var(--toc-text) !important; // 覆盖全局 a 标签样式
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  text-decoration: none !important; // 覆盖全局 a 标签样式
  cursor: pointer;
  transition: color 0.2s;
  
  // 左侧激活指示条
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 4px;
    bottom: 4px;
    width: 2px;
    background: transparent;
    border-radius: 1px;
    transition: background 0.2s;
  }
  
  &:hover {
    color: var(--toc-text-hover) !important;
    text-decoration: none !important;
  }
}

// 链接文本
.md-toc-link-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 激活态 - 文字变深色，左侧指示条变蓝
a.md-toc-link--active {
  color: var(--toc-text-active) !important;
  font-weight: 500;
  
  &::before {
    background: var(--toc-rail-active);
  }
  
  &:hover {
    color: var(--toc-text-active) !important;
  }
}

// ====== 嵌入式模式 ======
.md-toc-embedded {
  margin: 0 0 24px;
  
  .md-toc-nav {
    padding-left: 0;
    
    &::before {
      display: none;
    }
  }
  
  .md-toc-link {
    &::before {
      display: none;
    }
    
    &:hover {
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }
}

// ====== 响应式 ======
@media (max-width: 1024px) {
  .md-toc-sidebar {
    display: none;
  }
}
</style>
