<template>
  <code class="md-inline-code"><slot /></code>
</template>

<style scoped lang="scss">
.md-inline-code {
  padding: 0.15em 0.4em;
  margin: 0 0.1em;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Consolas', monospace;
  font-size: 0.875em;
  line-height: 1.5;
  color: var(--md-color-code-text, #c7254e);
  background: var(--md-color-code-bg, #f8f4f4);
  border-radius: 4px;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
