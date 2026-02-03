<template>
  <span ref="triggerRef" class="md-tooltip-trigger" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @focus="handleFocus" @blur="handleBlur">
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="md-tooltip">
      <div v-if="visible" ref="tooltipRef" class="md-tooltip" :class="[`md-tooltip--${position}`, { 'md-tooltip--dark': theme === 'dark' }]" :style="tooltipStyle" role="tooltip">
        <div class="md-tooltip__content">{{ content }}</div>
        <div v-if="showArrow" class="md-tooltip__arrow"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const props = withDefaults(defineProps<{
  content: string;
  position?: TooltipPosition;
  trigger?: 'hover' | 'focus' | 'both';
  showArrow?: boolean;
  theme?: 'light' | 'dark';
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  disabled?: boolean;
}>(), {
  position: 'top',
  trigger: 'hover',
  showArrow: true,
  theme: 'dark',
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100,
  disabled: false,
});

const triggerRef = ref<HTMLElement>();
const tooltipRef = ref<HTMLElement>();
const visible = ref(false);
const tooltipPosition = ref({ top: 0, left: 0 });

let enterTimer: ReturnType<typeof setTimeout> | null = null;
let leaveTimer: ReturnType<typeof setTimeout> | null = null;

const tooltipStyle = computed(() => ({
  top: `${tooltipPosition.value.top}px`,
  left: `${tooltipPosition.value.left}px`,
}));

function calcPosition() {
  if (!triggerRef.value || !tooltipRef.value) return;
  
  const triggerRect = triggerRef.value.getBoundingClientRect();
  const tooltipRect = tooltipRef.value.getBoundingClientRect();
  const spacing = 8;
  
  let top = 0, left = 0;
  
  switch (props.position) {
    case 'top':
      top = triggerRect.top + window.scrollY - tooltipRect.height - spacing;
      left = triggerRect.left + window.scrollX + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      top = triggerRect.bottom + window.scrollY + spacing;
      left = triggerRect.left + window.scrollX + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      top = triggerRect.top + window.scrollY + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.left + window.scrollX - tooltipRect.width - spacing;
      break;
    case 'right':
      top = triggerRect.top + window.scrollY + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.right + window.scrollX + spacing;
      break;
  }
  
  tooltipPosition.value = { top, left };
}

function show() {
  if (props.disabled) return;
  if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
  enterTimer = setTimeout(() => { visible.value = true; }, props.mouseEnterDelay);
}

function hide() {
  if (enterTimer) { clearTimeout(enterTimer); enterTimer = null; }
  leaveTimer = setTimeout(() => { visible.value = false; }, props.mouseLeaveDelay);
}

function handleMouseEnter() {
  if (props.trigger === 'hover' || props.trigger === 'both') show();
}

function handleMouseLeave() {
  if (props.trigger === 'hover' || props.trigger === 'both') hide();
}

function handleFocus() {
  if (props.trigger === 'focus' || props.trigger === 'both') show();
}

function handleBlur() {
  if (props.trigger === 'focus' || props.trigger === 'both') hide();
}

watch(visible, (val) => {
  if (val) nextTick(calcPosition);
});

onUnmounted(() => {
  if (enterTimer) clearTimeout(enterTimer);
  if (leaveTimer) clearTimeout(leaveTimer);
});
</script>

<style scoped lang="scss">
.md-tooltip-trigger {
  display: inline-block;
}

.md-tooltip {
  position: absolute;
  z-index: 1060;
  max-width: 300px;
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 6px;
  pointer-events: none;
  
  &--dark {
    background: rgba(22, 22, 26, 0.9);
    color: #fff;
  }
  
  &--light {
    background: #fff;
    color: #1c1f23;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &__content {
    word-wrap: break-word;
  }

  &__arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
    transform: rotate(45deg);
  }

  &--top .md-tooltip__arrow {
    bottom: -4px;
    left: 50%;
    margin-left: -4px;
  }

  &--bottom .md-tooltip__arrow {
    top: -4px;
    left: 50%;
    margin-left: -4px;
  }

  &--left .md-tooltip__arrow {
    right: -4px;
    top: 50%;
    margin-top: -4px;
  }

  &--right .md-tooltip__arrow {
    left: -4px;
    top: 50%;
    margin-top: -4px;
  }
}

.md-tooltip-enter-active,
.md-tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.md-tooltip-enter-from,
.md-tooltip-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
