<template>
  <p class="md-paragraph" v-bind="$attrs"><slot /></p>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<style scoped lang="scss">
.md-paragraph {
  margin: 12px 0;
  line-height: 1.8;
  color: var(--md-color-text, #374151);
  
  &:first-child {
    margin-top: 0;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
