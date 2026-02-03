<template>
  <div class="md-image" :class="{ 'md-image--error': hasError }" :style="containerStyle">
    <img v-if="!hasError" :src="src" :alt="alt" :style="imageStyle" @load="hasError = false" @error="hasError = true" />
    <div v-else class="md-image__fallback">
      <svg viewBox="0 0 1024 1024" width="48" height="48">
        <path d="M304.128 456.192c48.64 0 88.064-39.424 88.064-88.064s-39.424-88.064-88.064-88.064-88.064 39.424-88.064 88.064 39.424 88.064 88.064 88.064zm0-116.224c15.36 0 28.16 12.288 28.16 28.16s-12.288 28.16-28.16 28.16-28.16-12.288-28.16-28.16 12.288-28.16 28.16-28.16z" fill="currentColor" />
        <path d="M887.296 159.744H136.704C96.768 159.744 64 192.512 64 232.448v559.104c0 39.936 32.768 72.704 72.704 72.704h750.592c39.936 0 72.704-32.768 72.704-72.704V232.448c0-39.936-32.768-72.704-72.704-72.704zm-748.544 71.68h748.544c0.512 0 0.512 0.512 0.512 0.512v346.624L778.24 469.504c-24.064-24.064-63.488-24.064-87.552 0L531.456 628.736 360.96 458.24c-24.064-24.064-63.488-24.064-87.552 0L135.68 596.48V232.448c0-0.512 0.512-0.512 1.024-0.512z" fill="currentColor" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
}>(), {
  fit: 'cover',
});

const hasError = ref(false);

const containerStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.width) style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  if (props.height) style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  return style;
});

const imageStyle = computed(() => ({
  objectFit: props.fit,
  width: '100%',
  height: '100%',
}));
</script>

<style scoped lang="scss">
.md-image {
  position: relative;
  display: inline-block;
  overflow: hidden;

  img { display: block; }

  &__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 120px;
    background: #f5f5f5;
    color: #a3a3a3;
  }

  &--error {
    border: 1px dashed #e5e5e5;
    border-radius: 8px;
  }
}
</style>
