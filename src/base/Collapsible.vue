<template>
  <div 
    class="md-collapsible"
    :class="{ 'md-collapsible--transitioning': isTransitioning }"
    :style="wrapperStyle"
    @transitionend="handleTransitionEnd"
  >
    <div ref="contentRef" class="md-collapsible__content">
      <slot v-if="shouldRender" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = withDefaults(defineProps<{
  isOpen?: boolean;
  duration?: number;
  keepDOM?: boolean;
  collapseHeight?: number;
}>(), {
  isOpen: false,
  duration: 250,
  keepDOM: false,
  collapseHeight: 0,
});

const emit = defineEmits<{ motionEnd: [] }>();

const contentRef = ref<HTMLElement>();
const contentHeight = ref(0);
const isTransitioning = ref(false);
const visible = ref(props.isOpen);
const hasRendered = ref(false);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (contentRef.value) {
    contentHeight.value = contentRef.value.scrollHeight;
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) contentHeight.value = entry.target.scrollHeight;
    });
    resizeObserver.observe(contentRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

const wrapperStyle = computed(() => ({
  height: `${props.isOpen ? contentHeight.value : props.collapseHeight}px`,
  transitionDuration: isTransitioning.value ? `${props.duration}ms` : '0ms',
}));

const shouldRender = computed(() => {
  if (props.keepDOM && hasRendered.value) return true;
  if (props.collapseHeight > 0) return true;
  return visible.value || props.isOpen;
});

watch(() => props.isOpen, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    isTransitioning.value = true;
    if (newVal) visible.value = true;
    nextTick(() => {
      if (contentRef.value) contentHeight.value = contentRef.value.scrollHeight;
    });
  }
});

watch(shouldRender, (val) => {
  if (val && !hasRendered.value) hasRendered.value = true;
});

function handleTransitionEnd() {
  isTransitioning.value = false;
  if (!props.isOpen) visible.value = false;
  emit('motionEnd');
}
</script>

<style scoped lang="scss">
.md-collapsible {
  overflow: hidden;

  &--transitioning {
    transition-property: height;
    transition-timing-function: ease;
  }

  &__content {
    overflow: hidden;
  }
}
</style>
