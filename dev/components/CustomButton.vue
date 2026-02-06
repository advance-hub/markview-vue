<template>
  <button :class="['custom-button', `custom-button--${type}`]" @click="handleClick">
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
  type?: 'primary' | 'secondary' | 'danger' | 'success';
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Button',
  type: 'primary',
});

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();

const handleClick = (e: MouseEvent) => {
  emit('click', e);
  console.log(`[${props.type}] Button clicked:`, props.text);
};
</script>

<style scoped>
.custom-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Primary - Semi Design 蓝色 */
.custom-button--primary {
  background: #0064fa;
  color: #fff;
}

.custom-button--primary:hover {
  background: #005dd6;
}

.custom-button--primary:active {
  background: #0052b3;
  transform: translateY(1px);
}

/* Secondary - 灰色 */
.custom-button--secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.custom-button--secondary:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.custom-button--secondary:active {
  background: #d1d5db;
  transform: translateY(1px);
}

/* Danger - Semi Design 红色 */
.custom-button--danger {
  background: #f53f3f;
  color: #fff;
}

.custom-button--danger:hover {
  background: #d92d2d;
}

.custom-button--danger:active {
  background: #b82020;
  transform: translateY(1px);
}

/* Success - Semi Design 绿色 */
.custom-button--success {
  background: #5ac262;
  color: #fff;
}

.custom-button--success:hover {
  background: #38a140;
}

.custom-button--success:active {
  background: #2d8734;
  transform: translateY(1px);
}
</style>
