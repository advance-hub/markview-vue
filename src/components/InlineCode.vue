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
  color: var(--md-color-code-text, #dc2626);
  background: var(--md-color-code-bg, #f5f5f5);
  border-radius: 4px;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
