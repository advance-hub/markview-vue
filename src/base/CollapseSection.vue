<template>
  <div class="md-collapse-section" :class="{ 'md-collapse-section--expanded': isExpanded }">
    <div 
      class="md-collapse-section__header"
      :class="{ 'md-collapse-section__header--clickable': clickable }"
      role="button"
      :tabindex="clickable ? 0 : -1"
      :aria-expanded="isExpanded"
      @click="handleToggle"
      @keydown.enter="handleToggle"
      @keydown.space.prevent="handleToggle"
    >
      <span v-if="showIcon" class="md-collapse-section__icon">
        <Icon :name="isExpanded ? 'chevron-down' : 'chevron-right'" :size="16" />
      </span>
      <div class="md-collapse-section__title">
        <slot name="header">{{ title }}</slot>
      </div>
      <div v-if="$slots.extra" class="md-collapse-section__extra">
        <slot name="extra" />
      </div>
    </div>
    
    <Collapsible 
      :isOpen="isExpanded" 
      :duration="duration"
      :keepDOM="keepDOM"
      :collapseHeight="collapseHeight"
      @motionEnd="$emit('motionEnd')"
    >
      <div class="md-collapse-section__content">
        <slot />
      </div>
    </Collapsible>
    
    <div v-if="collapseHeight > 0 && !isExpanded" class="md-collapse-section__expand-btn" @click="handleToggle">
      <span>{{ expandText }}</span>
      <Icon name="chevron-down" :size="16" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Collapsible from './Collapsible.vue';
import Icon from './Icon.vue';

const props = withDefaults(defineProps<{
  title?: string;
  defaultExpanded?: boolean;
  expanded?: boolean;
  duration?: number;
  showIcon?: boolean;
  clickable?: boolean;
  keepDOM?: boolean;
  collapseHeight?: number;
  expandText?: string;
}>(), {
  defaultExpanded: true,
  duration: 250,
  showIcon: true,
  clickable: true,
  keepDOM: false,
  collapseHeight: 0,
  expandText: '展开更多',
});

const emit = defineEmits<{
  'update:expanded': [value: boolean];
  'change': [expanded: boolean];
  'motionEnd': [];
}>();

const isExpanded = ref(props.expanded ?? props.defaultExpanded);

watch(() => props.expanded, (val) => {
  if (val !== undefined) isExpanded.value = val;
});

function handleToggle() {
  if (!props.clickable && props.collapseHeight === 0) return;
  
  const newValue = !isExpanded.value;
  if (props.expanded === undefined) isExpanded.value = newValue;
  
  emit('update:expanded', newValue);
  emit('change', newValue);
}
</script>

<style scoped lang="scss">
@import '../styles/tokens.scss';

.md-collapse-section {
  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    border-radius: 6px;
    user-select: none;
    color: var(--#{$md-prefix}-color-text);
    
    &--clickable {
      cursor: pointer;
      
      &:hover { background: var(--#{$md-prefix}-color-bg-spotlight); }
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--#{$md-prefix}-color-text-tertiary);
    flex-shrink: 0;
  }

  &__title {
    flex: 1;
    min-width: 0;
    font-weight: 500;
  }

  &__extra {
    flex-shrink: 0;
  }

  &__expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 0;
    font-size: 13px;
    color: var(--#{$md-prefix}-color-link);
    cursor: pointer;
    background: linear-gradient(to bottom, transparent, var(--#{$md-prefix}-color-bg) 30%);
    margin-top: -40px;
    position: relative;
    
    &:hover { color: var(--#{$md-prefix}-color-link-hover); }
  }
}
</style>
