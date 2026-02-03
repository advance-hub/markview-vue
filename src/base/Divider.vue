<template>
  <div 
    class="md-divider" 
    :class="[
      `md-divider--${layout}`,
      { 'md-divider--dashed': dashed, 'md-divider--with-text': hasText }
    ]"
    :style="dividerStyle"
    role="separator"
    :aria-orientation="layout"
  >
    <span v-if="hasText && layout === 'horizontal'" class="md-divider__text" :class="`md-divider__text--${align}`">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

const props = withDefaults(defineProps<{
  layout?: 'horizontal' | 'vertical';
  dashed?: boolean;
  align?: 'left' | 'center' | 'right';
  margin?: string | number;
}>(), {
  layout: 'horizontal',
  dashed: false,
  align: 'center',
});

const slots = useSlots();
const hasText = computed(() => !!slots.default);

const dividerStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.margin !== undefined) {
    const m = typeof props.margin === 'number' ? `${props.margin}px` : props.margin;
    if (props.layout === 'vertical') {
      style.marginLeft = m;
      style.marginRight = m;
    } else {
      style.marginTop = m;
      style.marginBottom = m;
    }
  }
  return style;
});
</script>

<style scoped lang="scss">
.md-divider {
  &--horizontal {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 16px 0;
    border-top: 1px solid var(--md-color-border, #e5e7eb);
    
    &.md-divider--dashed {
      border-top-style: dashed;
    }
    
    &.md-divider--with-text {
      border-top: none;
      
      &::before,
      &::after {
        content: '';
        flex: 1;
        border-top: 1px solid var(--md-color-border, #e5e7eb);
      }
      
      &.md-divider--dashed::before,
      &.md-divider--dashed::after {
        border-top-style: dashed;
      }
    }
  }

  &--vertical {
    display: inline-block;
    width: 1px;
    height: 1em;
    margin: 0 8px;
    vertical-align: middle;
    background: var(--md-color-border, #e5e7eb);
    
    &.md-divider--dashed {
      background: none;
      border-left: 1px dashed var(--md-color-border, #e5e7eb);
    }
  }

  &__text {
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--md-color-text-secondary, #64748b);
    white-space: nowrap;
    
    &--left {
      padding-left: 0;
      
      &::before { display: none; }
    }
    
    &--right {
      padding-right: 0;
      
      &::after { display: none; }
    }
  }
}
</style>
