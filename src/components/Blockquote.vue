<template>
  <blockquote 
    ref="blockquoteRef"
    class="md-blockquote"
    :class="{ 
      'md-blockquote--collapsible': isCollapsible,
      'md-blockquote--collapsed': isCollapsible && !isExpanded
    }"
  >
    <div class="md-blockquote__content" :style="contentStyle">
      <slot />
    </div>
    
    <div v-if="isCollapsible" class="md-blockquote__toggle" @click="handleToggle">
      <span>{{ isExpanded ? '收起' : '展开更多' }}</span>
      <Icon :name="isExpanded ? 'chevron-up' : 'chevron-down'" :size="16" />
    </div>
  </blockquote>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { Icon } from '../base';

const props = withDefaults(defineProps<{
  collapsible?: boolean | 'auto';
  maxHeight?: number;
  defaultExpanded?: boolean;
}>(), {
  collapsible: 'auto',
  maxHeight: 150,
  defaultExpanded: false,
});

const blockquoteRef = ref<HTMLElement>();
const contentHeight = ref(0);
const isExpanded = ref(props.defaultExpanded);

const isCollapsible = computed(() => {
  if (props.collapsible === true) return true;
  if (props.collapsible === false) return false;
  return contentHeight.value > props.maxHeight;
});

const contentStyle = computed(() => {
  if (!isCollapsible.value || isExpanded.value) return {};
  return { maxHeight: `${props.maxHeight}px`, overflow: 'hidden' };
});

onMounted(() => {
  nextTick(() => {
    if (blockquoteRef.value) {
      const content = blockquoteRef.value.querySelector('.md-blockquote__content');
      if (content) contentHeight.value = content.scrollHeight;
    }
  });
});

function handleToggle() {
  isExpanded.value = !isExpanded.value;
}
</script>

<style scoped lang="scss">
@import '../styles/tokens.scss';

.md-blockquote {
  position: relative;
  margin: $spacing-4 0;
  padding: $spacing-3 $spacing-4;
  border-left: 3px solid var(--#{$md-prefix}-color-link, #6366f1);
  border-radius: 0 $radius-md $radius-md 0;
  background: linear-gradient(to right, rgba(99, 102, 241, 0.06), transparent 80%);
  color: var(--#{$md-prefix}-color-text-secondary, #64748b);
  font-size: $md-quote-font-size;
  line-height: $md-quote-line-height;
  font-style: italic;

  &--collapsible { padding-bottom: $spacing-1; }

  &--collapsed &__content {
    -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  }

  &__content { transition: max-height 0.3s ease; }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px 0 4px;
    font-size: 13px;
    font-style: normal;
    color: var(--#{$md-prefix}-color-link, #6366f1);
    cursor: pointer;
    
    &:hover { opacity: 0.8; }
  }

  :deep(> .md-blockquote__content > *:first-child) { margin-top: 0; }
  :deep(> .md-blockquote__content > *:last-child) { margin-bottom: 0; }
  :deep(p) { margin: 0 0 $spacing-2; &:last-child { margin-bottom: 0; } }
  :deep(strong) { font-weight: $font-weight-semibold; font-style: normal; color: var(--#{$md-prefix}-color-text); }
  :deep(code) { padding: $md-code-inline-padding; font-size: $md-code-inline-font-size; font-style: normal; background: $md-code-inline-bg; border-radius: $md-code-inline-radius; }
  :deep(a) { color: var(--#{$md-prefix}-color-link, #6366f1); text-decoration: none; &:hover { text-decoration: underline; } }
  :deep(.md-blockquote) { margin: $spacing-3 0; border-left-color: var(--#{$md-prefix}-color-border, #e2e8f0); background: rgba(0, 0, 0, 0.02); }
}
</style>
