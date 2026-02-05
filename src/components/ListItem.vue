<template>
  <li class="md-list-item">
    <slot />
  </li>
</template>

<script setup lang="ts">
// 简化的 ListItem - 只做包装
// 任务列表的 checkbox 由 MDX 直接渲染 input[type=checkbox]
// 用 CSS 来美化
</script>

<style lang="scss">
.md-list-item {
  // 任务列表项：包含 input[type=checkbox] 作为第一个子元素
  &:has(> input[type="checkbox"]) {
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

    // 已完成的任务，后面的文本添加删除线
    &:checked + * {
      text-decoration: line-through;
      color: var(--md-color-text-tertiary, #9ca3af);
    }
  }
}
</style>
