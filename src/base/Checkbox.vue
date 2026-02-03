<template>
  <span 
    class="md-checkbox" 
    :class="{ 
      'md-checkbox--checked': modelValue, 
      'md-checkbox--disabled': disabled,
      'md-checkbox--indeterminate': indeterminate
    }"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed' : modelValue"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @click="handleClick"
    @keydown.space.prevent="handleClick"
    @keydown.enter="handleClick"
  >
    <span class="md-checkbox__inner">
      <svg v-if="modelValue && !indeterminate" class="md-checkbox__icon" viewBox="0 0 16 16" fill="none">
        <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else-if="indeterminate" class="md-checkbox__icon" viewBox="0 0 16 16" fill="none">
        <path d="M4 8H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </span>
    <span v-if="$slots.default" class="md-checkbox__label">
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
}>(), {
  modelValue: false,
  disabled: false,
  indeterminate: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [checked: boolean];
}>();

function handleClick() {
  if (props.disabled) return;
  const newValue = !props.modelValue;
  emit('update:modelValue', newValue);
  emit('change', newValue);
}
</script>

<style scoped lang="scss">
.md-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  
  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 2px solid var(--md-color-border, #d1d5db);
    border-radius: 4px;
    background: var(--md-color-bg, #fff);
    transition: all 0.15s;
    flex-shrink: 0;
  }

  &--checked &__inner,
  &--indeterminate &__inner {
    background: var(--md-color-primary, #2563eb);
    border-color: var(--md-color-primary, #2563eb);
  }

  &:not(&--disabled):hover &__inner {
    border-color: var(--md-color-primary, #2563eb);
  }

  &__icon {
    width: 12px;
    height: 12px;
    color: #fff;
  }

  &__label {
    font-size: 14px;
    color: var(--md-color-text, #1f2937);
    line-height: 1.5;
  }

  &--checked &__label {
    text-decoration: line-through;
    color: var(--md-color-text-tertiary, #9ca3af);
  }
}
</style>
