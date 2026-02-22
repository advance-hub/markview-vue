<template>
  <div class="md-toc-mobile" v-if="items.length > 0">
    <!-- 浮动触发按钮 -->
    <button class="md-toc-mobile__trigger" @click="togglePanel" :title="isOpen ? '关闭目录' : '页面导航'">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="15" y2="12" />
        <line x1="3" y1="18" x2="9" y2="18" />
      </svg>
      <span class="md-toc-mobile__trigger-text">目录</span>
    </button>

    <!-- 遮罩层 -->
    <Transition name="md-toc-overlay">
      <div v-if="isOpen" class="md-toc-mobile__overlay" @click="closePanel" />
    </Transition>

    <!-- 弹出面板 -->
    <Transition name="md-toc-panel">
      <div v-if="isOpen" class="md-toc-mobile__panel">
        <div class="md-toc-mobile__header">
          <span class="md-toc-mobile__title">目录导航</span>
          <button class="md-toc-mobile__close" @click="closePanel" title="关闭">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav class="md-toc-mobile__nav">
          <a
            v-for="item in filteredItems"
            :key="item.id"
            :href="`#${item.id}`"
            :class="[
              'md-toc-mobile__link',
              `md-toc-mobile__link--level-${item.level}`,
              { 'md-toc-mobile__link--active': activeId === item.id }
            ]"
            :style="{ paddingLeft: `${16 + (item.level - minLevel) * 12}px` }"
            @click="handleClick(item, $event)"
          >
            {{ item.text }}
          </a>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { TocItem } from './Toc.vue';

const props = withDefaults(defineProps<{
  items: TocItem[];
  activeId?: string;
  minLevel?: number;
  maxLevel?: number;
}>(), {
  minLevel: 2,
  maxLevel: 4,
});

const emit = defineEmits<{
  click: [item: TocItem];
}>();

const isOpen = ref(false);

const filteredItems = computed(() =>
  props.items.filter(item => item.level >= props.minLevel && item.level <= props.maxLevel)
);

function togglePanel() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function closePanel() {
  isOpen.value = false;
  document.body.style.overflow = '';
}

function handleClick(item: TocItem, event: Event) {
  event.preventDefault();
  closePanel();

  const element = document.getElementById(item.id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${item.id}`);
  }

  emit('click', item);
}

// 视口变化时，如果回到大屏则自动关闭面板
function handleResize() {
  if (window.innerWidth > 1024 && isOpen.value) {
    closePanel();
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  document.body.style.overflow = '';
});
</script>

<style lang="scss">
@import '../styles/tokens.scss';

// 移动端 TOC 仅在 ≤1024px 显示
.md-toc-mobile {
  display: none;
}

@media (max-width: 1024px) {
  .md-toc-mobile {
    display: block;
  }
}

// 触发按钮 - 固定在内容区顶部
.md-toc-mobile__trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--#{$md-prefix}-color-text-secondary, #{$gray-500});
  background: var(--#{$md-prefix}-toc-mobile-trigger-bg, #{$gray-50});
  border: 1px solid var(--#{$md-prefix}-color-border, #{$gray-200});
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;

  &:hover {
    color: var(--#{$md-prefix}-color-text, #{$gray-900});
    background: var(--#{$md-prefix}-toc-mobile-trigger-hover-bg, #{$gray-100});
    border-color: var(--#{$md-prefix}-color-link, #{$blue-500});
  }
}

.md-toc-mobile__trigger-text {
  line-height: 1;
}

// 遮罩层
.md-toc-mobile__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
}

// 弹出面板 - 从底部滑入
.md-toc-mobile__panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 70vh;
  background: var(--#{$md-prefix}-container-bg, #ffffff);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  z-index: 201;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.md-toc-mobile__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--#{$md-prefix}-color-border, #{$gray-200});
  flex-shrink: 0;
}

.md-toc-mobile__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--#{$md-prefix}-color-text, #{$gray-900});
}

.md-toc-mobile__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--#{$md-prefix}-color-text-tertiary, #{$gray-400});
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: var(--#{$md-prefix}-color-bg-spotlight, #{$gray-100});
    color: var(--#{$md-prefix}-color-text, #{$gray-900});
  }
}

// 导航列表
.md-toc-mobile__nav {
  overflow-y: auto;
  padding: 8px 0 max(env(safe-area-inset-bottom, 20px), 20px);
  -webkit-overflow-scrolling: touch;
}

.md-toc-mobile__link {
  display: block;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--#{$md-prefix}-color-text-secondary, #{$gray-500}) !important;
  text-decoration: none !important;
  transition: all 0.15s;
  border-left: 2px solid transparent;

  &:hover {
    color: var(--#{$md-prefix}-color-text, #{$gray-900}) !important;
    background: var(--#{$md-prefix}-color-bg-spotlight, #{$gray-50});
  }

  &--active {
    color: var(--#{$md-prefix}-color-link, #{$blue-500}) !important;
    font-weight: 500;
    border-left-color: var(--#{$md-prefix}-color-link, #{$blue-500});
    background: rgba($blue-500, 0.04);
  }
}

// 过渡动画 - 遮罩层
.md-toc-overlay-enter-active,
.md-toc-overlay-leave-active {
  transition: opacity 0.25s ease;
}

.md-toc-overlay-enter-from,
.md-toc-overlay-leave-to {
  opacity: 0;
}

// 过渡动画 - 面板
.md-toc-panel-enter-active,
.md-toc-panel-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.md-toc-panel-enter-from,
.md-toc-panel-leave-to {
  transform: translateY(100%);
}

// 暗黑模式
.md-render--dark {
  .md-toc-mobile__trigger {
    background: var(--#{$md-prefix}-toc-mobile-trigger-bg, #{$gray-800});
    border-color: var(--#{$md-prefix}-color-border, #{$gray-700});
    color: var(--#{$md-prefix}-color-text-secondary, #{$gray-400});

    &:hover {
      background: var(--#{$md-prefix}-toc-mobile-trigger-hover-bg, #{$gray-700});
      color: var(--#{$md-prefix}-color-text, #{$gray-100});
    }
  }

  .md-toc-mobile__panel {
    background: var(--#{$md-prefix}-container-bg, #1a1a1a);
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
  }

  .md-toc-mobile__overlay {
    background: rgba(0, 0, 0, 0.6);
  }

  .md-toc-mobile__link {
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    &--active {
      background: rgba($blue-500, 0.08);
    }
  }
}
</style>
