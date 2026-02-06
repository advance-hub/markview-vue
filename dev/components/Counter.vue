<template>
  <div class="counter">
    <div class="counter__display">{{ count }}</div>
    <div class="counter__controls">
      <button class="counter__btn" @click="decrement">-</button>
      <button class="counter__btn counter__btn--reset" @click="reset">重置</button>
      <button class="counter__btn" @click="increment">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const increment = () => count.value++;
const decrement = () => count.value--;
const reset = () => count.value = 0;
</script>

<style scoped>
.counter {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
}

.counter__display {
  font-size: 48px;
  font-weight: 700;
  color: #0064fa;
  font-variant-numeric: tabular-nums;
  min-width: 80px;
  text-align: center;
}

.counter__controls {
  display: flex;
  gap: 8px;
}

.counter__btn {
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.counter__btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.counter__btn:active {
  transform: scale(0.95);
}

.counter__btn--reset {
  width: auto;
  padding: 0 12px;
  font-size: 14px;
}
</style>
