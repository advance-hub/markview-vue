<template>
  <div class="md-block-header">
    <span class="md-block-header__label">{{ label }}</span>
    <div class="md-block-header__actions">
      <slot name="extra" />
      <slot name="actions" />
      <button v-if="copyable" class="md-block-header__btn" :title="copied ? '已复制' : '复制'" @click="handleCopy">
        <Icon v-if="!copied" name="copy" :size="14" />
        <Icon v-else name="check" :size="14" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '../base';

defineProps<{
  label: string;
  copyable?: boolean;
}>();

const emit = defineEmits<{ copy: [] }>();
const copied = ref(false);

function handleCopy() {
  emit('copy');
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}

defineExpose({ copied });
</script>

<style scoped lang="scss">
@import '../styles/tokens.scss';

.md-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $md-code-header-height;
  padding: $md-code-header-padding;
  background: var(--#{$md-prefix}-code-header-bg, #{$md-code-header-bg});
  border: 1px solid var(--#{$md-prefix}-code-border, #{$md-code-header-border});
  border-bottom: none;
  border-radius: $md-code-header-radius;

  &__label {
    font-size: $md-code-lang-font-size;
    font-weight: $md-code-lang-font-weight;
    color: var(--#{$md-prefix}-color-text-secondary);
    text-transform: lowercase;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $spacing-2;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: $md-btn-size;
    height: $md-btn-size;
    padding: 0;
    border: none;
    border-radius: $md-btn-radius;
    background: transparent;
    color: var(--#{$md-prefix}-color-text-tertiary);
    cursor: pointer;
    transition: background $md-btn-transition, color $md-btn-transition;

    &:hover {
      background: var(--#{$md-prefix}-color-bg-spotlight);
      color: var(--#{$md-prefix}-color-text);
    }
  }
}
</style>
