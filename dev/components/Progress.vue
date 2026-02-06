<template>
  <div class="custom-progress">
    <div class="custom-progress__info" v-if="showInfo">
      <span class="custom-progress__label">{{ label }}</span>
      <span class="custom-progress__percent">{{ percent }}%</span>
    </div>
    <div class="custom-progress__track">
      <div 
        class="custom-progress__bar" 
        :class="`custom-progress__bar--${status}`"
        :style="{ width: percent + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  percent: number;
  label?: string;
  status?: 'normal' | 'success' | 'warning' | 'danger';
  showInfo?: boolean;
}

withDefaults(defineProps<Props>(), {
  status: 'normal',
  showInfo: true,
});
</script>

<style scoped>
.custom-progress {
  margin: 16px 0;
}

.custom-progress__info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
}

.custom-progress__label {
  font-weight: 500;
}

.custom-progress__percent {
  font-variant-numeric: tabular-nums;
  color: #6b7280;
}

.custom-progress__track {
  height: 8px;
  background: #f3f4f6;
  border-radius: 100px;
  overflow: hidden;
}

.custom-progress__bar {
  height: 100%;
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-progress__bar--normal {
  background: linear-gradient(90deg, #0064fa 0%, #0078ff 100%);
}

.custom-progress__bar--success {
  background: linear-gradient(90deg, #38a140 0%, #5ac262 100%);
}

.custom-progress__bar--warning {
  background: linear-gradient(90deg, #cc6b0b 0%, #fa8c16 100%);
}

.custom-progress__bar--danger {
  background: linear-gradient(90deg, #d92d2d 0%, #f53f3f 100%);
}
</style>
