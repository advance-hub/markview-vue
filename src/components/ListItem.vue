<template>
  <li class="md-list-item" :class="{ 'md-list-item--task': isTask }">
    <Checkbox v-if="isTask" :modelValue="checked" :disabled="true" class="md-list-item__checkbox" />
    <span :class="{ 'md-list-item__content': isTask, 'md-list-item__content--checked': isTask && checked }">
      <slot />
    </span>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Checkbox } from '../base';

const props = defineProps<{
  checked?: boolean | null;
}>();

// 只有 checked 是明确的布尔值时才显示为任务列表
const isTask = computed(() => typeof props.checked === 'boolean');
</script>

<style scoped lang="scss">
.md-list-item {
  &--task {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    list-style: none;
    margin-left: -24px;
    padding-left: 0;
  }

  &__checkbox {
    margin-top: 4px;
  }

  &__content {
    flex: 1;
    
    &--checked {
      text-decoration: line-through;
      color: var(--md-color-text-tertiary, #9ca3af);
    }
  }
}
</style>
