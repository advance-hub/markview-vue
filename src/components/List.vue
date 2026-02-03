<template>
  <component :is="tag" class="md-list" :class="`md-list--${tag}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  ordered?: boolean;
}>(), {
  ordered: false,
});

const tag = props.ordered ? 'ol' : 'ul';
</script>

<style scoped lang="scss">
.md-list {
  margin: 12px 0;
  padding-left: 24px;
  color: var(--md-color-text, #1f2937);

  &--ul {
    list-style-type: disc;
    
    :deep(.md-list--ul) {
      list-style-type: circle;
      
      .md-list--ul {
        list-style-type: square;
      }
    }
  }

  &--ol {
    list-style-type: decimal;
    
    :deep(.md-list--ol) {
      list-style-type: lower-alpha;
      
      .md-list--ol {
        list-style-type: lower-roman;
      }
    }
  }

  :deep(li) {
    margin: 4px 0;
    line-height: 1.7;
    
    &::marker {
      color: var(--md-color-text-tertiary, #9ca3af);
    }
  }
}
</style>
