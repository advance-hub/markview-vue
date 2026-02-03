<template>
  <aside :class="tocClass">
    <div class="md-toc-inner">
      <!-- 目录导航 - Delight Anchor 风格 -->
      <nav class="md-toc-nav">
        <a
          v-for="(item, index) in filteredItems"
          :key="item.id"
          :href="`#${item.id}`"
          :class="[
            'md-toc-link',
            { 'md-toc-link--active': activeId === item.id }
          ]"
          :title="item.text"
          @click="handleClick(item, $event)"
        >
          <span class="md-toc-link-text">{{ index + 1 }}、{{ item.text }}</span>
        </a>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';

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
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    internalActiveId.value = item.id;
    emit('update:activeId', item.id);
    emit('click', item);
    
    // 更新 URL hash（静默更新，不触发跳转）
    history.replaceState(null, '', `#${item.id}`);
  }
}

// 获取滚动目标（容器或 window）
function getScrollTarget(): HTMLElement | Window {
  return props.scrollContainer || window;
}

// 获取容器顶部偏移（用于计算激活项）
function getContainerOffset(): number {
  if (props.scrollContainer) {
    return props.scrollContainer.getBoundingClientRect().top;
  }
  return 0;
}

// 滚动监听：自动更新激活项
function handleScroll() {
  if (filteredItems.value.length === 0) return;
  
  const headings = filteredItems.value
    .map((item) => document.getElementById(item.id))
    .filter(Boolean) as HTMLElement[];
  
  if (headings.length === 0) return;
  
  // 计算偏移量：容器模式下需要考虑容器位置
  const containerOffset = getContainerOffset();
  const offset = 80 + containerOffset; // 顶部偏移量
  
  let currentId = headings[0]?.id || '';
  
  for (const heading of headings) {
    const rect = heading.getBoundingClientRect();
    // 如果标题顶部已经滚过了视口顶部（考虑偏移），则认为是当前激活项
    if (rect.top <= offset) {
      currentId = heading.id;
    } else {
      break;
    }
  }
  
  if (currentId !== internalActiveId.value) {
    internalActiveId.value = currentId;
    emit('update:activeId', currentId);
  }
}

// 当前滚动目标
let currentScrollTarget: HTMLElement | Window | null = null;

// 绑定滚动监听
function bindScrollListener() {
  const target = getScrollTarget();
  if (currentScrollTarget === target) return;
  
  // 解绑旧的
  if (currentScrollTarget) {
    currentScrollTarget.removeEventListener('scroll', handleScroll);
  }
  
  // 绑定新的
  currentScrollTarget = target;
  target.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// 监听 scrollContainer 变化
watch(
  () => props.scrollContainer,
  () => {
    bindScrollListener();
  }
);

onMounted(() => {
  bindScrollListener();
});

onUnmounted(() => {
  if (currentScrollTarget) {
    currentScrollTarget.removeEventListener('scroll', handleScroll);
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
