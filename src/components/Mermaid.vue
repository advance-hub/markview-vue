<template>
  <div class="md-mermaid" :class="{ 'md-mermaid--error': hasError }">
    <BlockHeader label="mermaid" copyable @copy="handleCopy">
      <template #extra>
        <button
          v-if="!hasError"
          class="md-mermaid__toggle"
          @click="showSource = !showSource"
          :title="showSource ? '查看图表' : '查看源码'"
        >
          <Icon :name="showSource ? 'eye' : 'code-2'" :size="14" />
        </button>
      </template>
    </BlockHeader>
    <div v-if="showSource" class="md-mermaid__source">
      <pre><code>{{ code }}</code></pre>
    </div>
    <div v-else class="md-mermaid__body">
      <div v-if="isLoading" class="md-mermaid__loading">
        <span class="md-mermaid__spinner" />
      </div>
      <div
        v-else-if="hasError"
        class="md-mermaid__error-msg"
      >
        <p>Mermaid 渲染失败</p>
        <pre>{{ errorMsg }}</pre>
      </div>
      <div
        v-else
        ref="containerRef"
        class="md-mermaid__svg"
        v-html="svgContent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject, nextTick } from 'vue';
import BlockHeader from './BlockHeader.vue';
import { toast, Icon } from '../base';
import { copyToClipboard } from '../utils';
import { MarkdownThemeKey } from '../injection-keys';

const props = defineProps<{
  code: string;
}>();

const themeMode = inject(MarkdownThemeKey, ref<'light' | 'dark'>('light'));

const containerRef = ref<HTMLElement>();
const svgContent = ref('');
const isLoading = ref(true);
const hasError = ref(false);
const errorMsg = ref('');
const showSource = ref(false);

let mermaidId = 0;

function generateId(): string {
  return `mermaid-${Date.now()}-${mermaidId++}`;
}

async function renderMermaid() {
  if (!props.code) return;

  isLoading.value = true;
  hasError.value = false;
  errorMsg.value = '';

  try {
    const mermaid = (await import('mermaid')).default;

    mermaid.initialize({
      startOnLoad: false,
      theme: themeMode.value === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });

    const id = generateId();
    const { svg } = await mermaid.render(id, props.code.trim());
    svgContent.value = svg;
  } catch (err: any) {
    hasError.value = true;
    errorMsg.value = err?.message || String(err);
    console.error('Mermaid render error:', err);
  } finally {
    isLoading.value = false;
  }
}

async function handleCopy() {
  const success = await copyToClipboard(props.code);
  if (success) {
    toast.success('复制成功');
  } else {
    toast.error('复制失败');
  }
}

onMounted(renderMermaid);

watch(() => props.code, () => {
  nextTick(renderMermaid);
});

watch(themeMode, () => {
  nextTick(renderMermaid);
});
</script>

<style scoped lang="scss">
@import '../styles/tokens.scss';

.md-mermaid {
  position: relative;
  margin: $md-code-block-margin;
  border-radius: $md-code-block-radius;
  overflow: hidden;

  &__body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    padding: $spacing-4;
    background: var(--#{$md-prefix}-code-body-bg, #{$md-code-body-bg});
    border: 1px solid var(--#{$md-prefix}-code-border, #{$md-code-body-border});
    border-top: none;
    border-radius: $md-code-body-radius;
    overflow-x: auto;
  }

  &__svg {
    width: 100%;
    display: flex;
    justify-content: center;

    :deep(svg) {
      max-width: 100%;
      height: auto;
    }
  }

  &__source {
    background: var(--#{$md-prefix}-code-body-bg, #{$md-code-body-bg});
    border: 1px solid var(--#{$md-prefix}-code-border, #{$md-code-body-border});
    border-top: none;
    border-radius: $md-code-body-radius;
    overflow-x: auto;

    pre {
      margin: 0;
      padding: $md-code-body-padding;
      background: transparent;
      border: none;
    }

    code {
      font-family: $md-code-font-family;
      font-size: $md-code-font-size;
      line-height: $md-code-line-height;
      color: var(--#{$md-prefix}-color-text);
      background: transparent;
      border: none;
      white-space: pre;
    }
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-8;
  }

  &__spinner {
    width: 24px;
    height: 24px;
    border: 2px solid var(--#{$md-prefix}-color-border, #{$gray-200});
    border-top-color: var(--#{$md-prefix}-color-link, #{$blue-500});
    border-radius: 50%;
    animation: md-mermaid-spin 0.6s linear infinite;
  }

  &__error-msg {
    padding: $spacing-4;
    color: #dc2626;
    font-size: $font-size-sm;

    p {
      margin: 0 0 $spacing-2;
      font-weight: 600;
    }

    pre {
      margin: 0;
      padding: $spacing-2 $spacing-3;
      font-size: $font-size-xs;
      white-space: pre-wrap;
      word-break: break-all;
      background: rgba(220, 38, 38, 0.06);
      border-radius: $radius-md;
      border: none;
    }
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    color: var(--#{$md-prefix}-color-text-tertiary);
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      background: var(--#{$md-prefix}-color-bg-spotlight);
      color: var(--#{$md-prefix}-color-text);
    }
  }
}

@keyframes md-mermaid-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .md-mermaid {
    &__body {
      padding: $spacing-3;
      border-radius: $radius-lg;
    }

    &__svg :deep(svg) {
      max-width: 100%;
      height: auto;
    }

    &__source {
      border-radius: $radius-lg;

      pre {
        padding: $spacing-3 $spacing-4;
      }

      code {
        font-size: $font-size-xs;
      }
    }
  }
}
</style>
