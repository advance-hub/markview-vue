<template>
  <span 
    v-if="visible"
    class="md-tag"
    :class="[
      `md-tag--${size}`,
      `md-tag--${type}`,
      `md-tag--${color}`,
      { 'md-tag--closable': closable }
    ]"
    :style="tagStyle"
    @click="$emit('click', $event)"
  >
    <span v-if="$slots.prefix" class="md-tag__prefix">
      <slot name="prefix" />
    </span>
    <span class="md-tag__content">
      <slot />
    </span>
    <span v-if="closable" class="md-tag__close" @click.stop="handleClose">
      <Icon name="x" :size="12" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Icon from './Icon.vue';

export type TagSize = 'small' | 'default' | 'large';
export type TagType = 'light' | 'solid' | 'ghost';
export type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const props = withDefaults(defineProps<{
  size?: TagSize;
  type?: TagType;
  color?: TagColor;
  closable?: boolean;
}>(), {
  size: 'default',
  type: 'light',
  color: 'default',
  closable: false,
});

const emit = defineEmits<{
  click: [e: MouseEvent];
  close: [];
}>();

const visible = ref(true);

const colorMap: Record<TagColor, { bg: string; text: string; border: string }> = {
  default: { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' },
  primary: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  success: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  warning: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  danger: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  info: { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' },
};

const tagStyle = computed(() => {
  const colors = colorMap[props.color];
  if (props.type === 'solid') {
    return { background: colors.text, color: '#fff', borderColor: colors.text };
  }
  if (props.type === 'ghost') {
    return { background: 'transparent', color: colors.text, borderColor: colors.text };
  }
  return { background: colors.bg, color: colors.text, borderColor: colors.border };
});

function handleClose() {
  emit('close');
  visible.value = false;
}
</script>

<style scoped lang="scss">
.md-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  white-space: nowrap;
  transition: all 0.15s;

  &--small {
    padding: 0 6px;
    font-size: 11px;
    height: 20px;
  }

  &--default {
    height: 24px;
  }

  &--large {
    padding: 0 10px;
    font-size: 13px;
    height: 28px;
  }

  &__prefix {
    display: flex;
    align-items: center;
  }

  &__content {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    margin-left: 2px;
    margin-right: -2px;
    border-radius: 2px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.15s, background 0.15s;

    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
