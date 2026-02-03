<template>
  <del class="md-del"><slot /></del>
</template>

<style scoped lang="scss">
.md-del {
  text-decoration: line-through;
  color: var(--md-color-text-tertiary, #9ca3af);
}
</style>
