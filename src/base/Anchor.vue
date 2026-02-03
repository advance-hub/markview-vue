<template>
  <span class="md-anchor" @click="handleClick">
    <Tooltip :content="copied ? '已复制' : '复制链接'" position="top">
      <span class="md-anchor__icon" :class="{ 'md-anchor__icon--visible': alwaysVisible }">
        <Icon name="link" :size="14" />
      </span>
    </Tooltip>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tooltip from './Tooltip.vue';
import Icon from './Icon.vue';
import { copyToClipboard } from '../utils';
import { toast } from './useToast';

const props = defineProps<{
  href: string;
  alwaysVisible?: boolean;
}>();

const copied = ref(false);

async function handleClick(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  
  const url = `${window.location.origin}${window.location.pathname}#${props.href}`;
  const success = await copyToClipboard(url);
  
  if (success) {
    copied.value = true;
    toast.success('链接已复制');
    setTimeout(() => { copied.value = false; }, 2000);
  } else {
    toast.error('复制失败');
  }
}
</script>

<style scoped lang="scss">
.md-anchor {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  
  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--md-color-text-tertiary, #94a3b8);
    opacity: 0;
    transition: opacity 0.15s, color 0.15s;
    cursor: pointer;
    border-radius: 4px;
    
    &:hover {
      color: var(--md-color-link, #2563eb);
      background: var(--md-color-bg-spotlight, #f1f5f9);
    }
    
    &--visible {
      opacity: 1;
    }
  }
  
  *:hover > & &__icon,
  &:hover &__icon {
    opacity: 1;
  }
}
</style>
