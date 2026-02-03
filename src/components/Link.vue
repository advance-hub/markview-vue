<template>
  <a 
    class="md-link" 
    :class="{ 'md-link--external': isExternal }"
    :href="href" 
    :target="target" 
    :rel="rel" 
    v-bind="$attrs"
  >
    <slot />
    <Icon v-if="isExternal && showExternalIcon" name="external-link" :size="12" class="md-link__icon" />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '../base';

const props = withDefaults(defineProps<{
  href?: string;
  showExternalIcon?: boolean;
}>(), {
  showExternalIcon: true,
});

defineOptions({ inheritAttrs: false });

const isExternal = computed(() => {
  if (!props.href) return false;
  return props.href.startsWith('http://') || props.href.startsWith('https://');
});

const target = computed(() => isExternal.value ? '_blank' : undefined);
const rel = computed(() => isExternal.value ? 'noopener noreferrer' : undefined);
</script>

<style scoped lang="scss">
.md-link {
  color: var(--md-color-link, #2563eb);
  text-decoration: none;
  transition: color 0.15s;
  
  &:hover {
    color: var(--md-color-link-hover, #1d4ed8);
    text-decoration: underline;
  }

  &--external {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  &__icon {
    opacity: 0.7;
    flex-shrink: 0;
  }
}
</style>
