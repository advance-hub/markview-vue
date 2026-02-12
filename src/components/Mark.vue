<template>
  <mark class="md-mark"><slot /></mark>
</template>

<style scoped lang="scss">
.md-mark {
  background: var(--md-mark-bg, linear-gradient(120deg, #fef08a 0%, #fde047 100%));
  padding: 0.1em 0.3em;
  border-radius: 3px;
  color: var(--md-color-text, #1f2937);
}
</style>
