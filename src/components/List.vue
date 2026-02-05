<template>
  <component :is="tag" class="md-list" :class="`md-list--${tag}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  ordered?: boolean;
}>(), {
  ordered: false,
});

const tag = props.ordered ? 'ol' : 'ul';
</script>

<style lang="scss">
.md-list {
  margin: 12px 0;
  padding-left: 24px;
  color: var(--md-color-text, #1f2937);

  &--ul {
    list-style-type: disc;
    
    .md-list--ul {
      list-style-type: circle;
      
      .md-list--ul {
        list-style-type: square;
      }
    }
  }

  &--ol {
    list-style-type: decimal;
    
    .md-list--ol {
      list-style-type: lower-alpha;
      
      .md-list--ol {
        list-style-type: lower-roman;
      }
    }
  }

  li {
    margin: 4px 0;
    line-height: 1.7;
    
    &::marker {
      color: var(--md-color-text-tertiary, #9ca3af);
    }
    
    // 任务列表项：包含 input[type=checkbox] 作为第一个子元素
    &:has(> input[type="checkbox"]:first-child) {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      list-style: none;
      margin-left: -24px;
      padding-left: 0;
    }
    
    // 美化任务列表的 checkbox
    > input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      min-width: 18px;
      margin: 3px 0 0 0;
      border: 2px solid var(--md-color-border, #d1d5db);
      border-radius: 4px;
      background: var(--md-color-bg, #fff);
      cursor: pointer;
      position: relative;
      transition: all 0.15s ease;
      
      &:checked {
        background: var(--md-color-primary, #3b82f6);
        border-color: var(--md-color-primary, #3b82f6);
        
        &::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
      
      &:hover:not(:checked) {
        border-color: var(--md-color-primary, #3b82f6);
      }
    }
  }
}
</style>
