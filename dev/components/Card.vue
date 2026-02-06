<template>
  <div class="custom-card">
    <div v-if="title" class="custom-card__title">{{ title }}</div>
    <div class="custom-card__body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

defineProps<Props>();
</script>

<style scoped>
.custom-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.custom-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.custom-card__title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.custom-card__body {
  color: #374151;
  line-height: 1.6;
}
</style>
