<template>
  <span :class="['custom-badge', `custom-badge--${type}`]">
    {{ text }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
}

withDefaults(defineProps<Props>(), {
  type: 'info',
});
</script>

<style scoped>
.custom-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
}

.custom-badge--info {
  background: #eaf6ff;
  color: #0062d6;
}

.custom-badge--success {
  background: #ecf7ec;
  color: #389e0d;
}

.custom-badge--warning {
  background: #fef5e9;
  color: #cc6b0b;
}

.custom-badge--danger {
  background: #fef0f0;
  color: #d92d2d;
}
</style>
