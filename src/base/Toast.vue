<template>
  <Teleport to="body">
    <Transition name="md-toast">
      <div v-if="visible" class="md-toast" :class="toastClass">
        <div class="md-toast__content">
          <span class="md-toast__icon">
            <svg v-if="type === 'success'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <svg v-else-if="type === 'error'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </span>
          <span class="md-toast__text">{{ content }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

const visible = ref(false);
const content = ref('');
const type = ref<ToastType>('info');
let timer: ReturnType<typeof setTimeout> | null = null;

const toastClass = computed(() => `md-toast--${type.value}`);

function show(msg: string, toastType: ToastType = 'info', duration = 3000) {
  if (timer) clearTimeout(timer);
  content.value = msg;
  type.value = toastType;
  visible.value = true;
  timer = setTimeout(() => { visible.value = false; }, duration);
}

function hide() {
  visible.value = false;
  if (timer) clearTimeout(timer);
}

defineExpose({ show, hide });
</script>

<style scoped lang="scss">
.md-toast {
  position: fixed;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1010;
  pointer-events: none;

  &__content {
    pointer-events: all;
    display: inline-flex;
    align-items: flex-start;
    padding: 8px 16px;
    margin: 8px;
    background-color: var(--md-color-bg, #fff);
    border-radius: 6px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    font-weight: 600;
    color: var(--md-color-text, #1c1f23);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__text {
    margin-left: 8px;
    margin-right: 8px;
    text-align: left;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 24px;
  }

  &--success .md-toast__icon { color: #0ba05d; }
  &--warning .md-toast__icon { color: #ff7d00; }
  &--error .md-toast__icon { color: #f82c2c; }
  &--info .md-toast__icon { color: #3370ff; }
}

.md-toast-enter-active {
  animation: md-toast-show 0.2s ease-out forwards;
}

.md-toast-leave-active {
  animation: md-toast-hide 0.2s ease-in forwards;
}

@keyframes md-toast-show {
  0% { opacity: 0; transform: translateX(-50%) translateY(-100%); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes md-toast-hide {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-100%); }
}
</style>
