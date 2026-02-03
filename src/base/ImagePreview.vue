<template>
  <Teleport to="body">
    <Transition name="md-preview">
      <div v-if="visible" class="md-image-preview" @click.self="handleClose">
        <div class="md-image-preview__header">
          <span class="md-image-preview__title">{{ title }}</span>
          <button class="md-image-preview__close" @click="handleClose" title="关闭">
            <Icon name="x" :size="20" />
          </button>
        </div>

        <div class="md-image-preview__body">
          <img :src="src" :alt="title" :style="imageStyle" @wheel="handleWheel" draggable="false" />
        </div>

        <div class="md-image-preview__footer">
          <div class="md-image-preview__footer-content">
            <button @click="handleZoomOut" title="缩小" :disabled="scale <= 0.5">
              <Icon name="zoom-out" :size="18" />
            </button>
            <span class="md-image-preview__zoom">{{ Math.round(scale * 100) }}%</span>
            <button @click="handleZoomIn" title="放大" :disabled="scale >= 3">
              <Icon name="zoom-in" :size="18" />
            </button>
            <div class="md-image-preview__divider"></div>
            <button @click="handleReset" title="重置">
              <Icon name="refresh" :size="18" />
            </button>
            <button @click="handleRotate" title="旋转">
              <Icon name="rotate-cw" :size="18" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import Icon from './Icon.vue';

const props = defineProps<{
  visible: boolean;
  src: string;
  title?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const scale = ref(1);
const rotate = ref(0);

const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotate.value}deg)`,
  transition: 'transform 0.2s ease',
}));

watch(() => props.visible, (val) => {
  if (val) {
    scale.value = 1;
    rotate.value = 0;
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
}, { immediate: true });

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

function handleClose() {
  emit('close');
}

function handleZoomIn() {
  if (scale.value < 3) scale.value = Math.min(3, scale.value + 0.25);
}

function handleZoomOut() {
  if (scale.value > 0.5) scale.value = Math.max(0.5, scale.value - 0.25);
}

function handleReset() {
  scale.value = 1;
  rotate.value = 0;
}

function handleRotate() {
  rotate.value = (rotate.value + 90) % 360;
}

function handleWheel(e: WheelEvent) {
  e.preventDefault();
  e.deltaY < 0 ? handleZoomIn() : handleZoomOut();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) handleClose();
}
</script>

<style scoped lang="scss">
.md-image-preview {
  position: fixed;
  inset: 0;
  z-index: 1070;
  background: rgba(22, 22, 26, 0.88);
  display: flex;
  flex-direction: column;

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    color: #fff;
    z-index: 1;
  }

  &__title {
    flex: 1;
    font-size: 14px;
    opacity: 0.9;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s;

    &:hover { background: rgba(255, 255, 255, 0.1); }
  }

  &__body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      max-width: 90%;
      max-height: 80%;
      object-fit: contain;
      user-select: none;
    }
  }

  &__footer {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);

    &-content {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      background: rgba(22, 22, 26, 0.75);
      border-radius: 8px;
      backdrop-filter: blur(8px);
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: #fff;
      cursor: pointer;
      transition: background 0.2s;

      &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }
  }

  &__zoom {
    min-width: 48px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    user-select: none;
  }

  &__divider {
    width: 1px;
    height: 16px;
    margin: 0 8px;
    background: rgba(255, 255, 255, 0.2);
  }
}

.md-preview-enter-active,
.md-preview-leave-active {
  transition: opacity 0.2s ease;
}

.md-preview-enter-from,
.md-preview-leave-to {
  opacity: 0;
}
</style>
