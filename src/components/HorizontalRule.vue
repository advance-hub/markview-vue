<template>
  <hr class="md-hr" :class="{ 'md-hr--dashed': dashed }" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  dashed?: boolean;
}>(), {
  dashed: false,
});
</script>

<style scoped lang="scss">
.md-hr {
  margin: 24px 0;
  border: none;
  border-top: 1px solid var(--md-color-border, #e5e7eb);
  
  &--dashed {
    border-top-style: dashed;
  }
}
</style>
