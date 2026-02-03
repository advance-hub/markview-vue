<template>
  <component 
    ref="headingRef"
    :is="tag" 
    :id="headingId"
    class="md-heading"
    :class="[headingClass, { 'md-heading--collapsed': isCollapsed }]"
    v-bind="$attrs"
  >
    <span class="md-heading__toggle" @click.stop.prevent="handleToggle">
      <Icon :name="isCollapsed ? 'chevron-right' : 'chevron-down'" :size="14" />
    </span>
    <span class="md-heading__text">
      <slot />
    </span>
    <Anchor v-if="showAnchor" :href="headingId" />
  </component>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, useSlots } from 'vue';
import { Icon, Anchor } from '../base';
import { useHeadingCollapse, generateHeadingId, collapseHeadingContent } from '../base/useHeadingCollapse';
import { extractTextFromVNode } from '../utils';

const props = withDefaults(defineProps<{
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  showAnchor?: boolean;
}>(), {
  level: 1,
  showAnchor: false,
});

defineOptions({ inheritAttrs: false });

const slots = useSlots();
const headingRef = ref<HTMLElement>();
const collapseState = useHeadingCollapse();

const tag = computed(() => `h${props.level}`);
const headingClass = computed(() => `md-heading--h${props.level}`);

// 生成唯一 ID（带随机 hash，确保唯一性）
const headingId = (() => {
  const content = slots.default?.();
  const text = content ? extractTextFromVNode(content) : '';
  return generateHeadingId(text);
})();

const isCollapsed = computed(() => {
  if (!collapseState) return false;
  return collapseState.isCollapsed(headingId);
});

function handleToggle() {
  if (!collapseState || !headingRef.value) return;
  
  collapseState.toggle(headingId);
  
  nextTick(() => {
    if (headingRef.value) {
      collapseHeadingContent(headingRef.value, props.level, collapseState.isCollapsed(headingId));
    }
  });
}

watch(isCollapsed, (collapsed) => {
  nextTick(() => {
    if (headingRef.value) {
      collapseHeadingContent(headingRef.value, props.level, collapsed);
    }
  });
});
</script>

<style scoped lang="scss">
@import '../styles/tokens.scss';

.md-heading {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: -24px;
  padding-left: 24px;

  &:hover .md-heading__toggle,
  &:hover :deep(.md-anchor__icon) {
    opacity: 1;
  }

  &--collapsed .md-heading__toggle {
    opacity: 1;
  }

  &__toggle {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--#{$md-prefix}-color-text-tertiary);
    opacity: 0;
    transition: opacity 0.15s, color 0.15s, background 0.15s;
    cursor: pointer;
    border-radius: 4px;
    
    &:hover {
      color: var(--#{$md-prefix}-color-text-secondary);
      background: var(--#{$md-prefix}-color-bg-spotlight);
    }
  }

  &__text {
    flex: 1;
  }
}
</style>
