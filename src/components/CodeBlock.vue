<template>
  <!-- Mermaid 图表：检测到 mermaid 语言时渲染为图表 -->
  <Mermaid v-if="isMermaid" :code="rawCode" />
  <!-- 普通代码块 -->
  <div v-else class="md-code-block" :class="{ 'md-code-block--expanded': isExpanded }">
    <BlockHeader :label="displayLanguage" copyable @copy="handleCopy">
      <template #extra v-if="isCollapsible">
        <button class="md-code-block__toggle" @click="handleToggle" :title="isExpanded ? '收起' : '展开'">
          <Icon :name="isExpanded ? 'chevron-up' : 'chevron-down'" :size="14" />
        </button>
      </template>
    </BlockHeader>
    <div ref="bodyRef" class="md-code-block__body" :style="bodyStyle">
      <div v-if="showLineNumbers" class="md-code-block__lines" aria-hidden="true">
        <span v-for="line in lineCount" :key="line" class="md-code-block__line-number">{{ line }}</span>
      </div>
      <div class="md-code-block__code" v-html="highlightedHtml"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useSlots, watch, inject } from 'vue';
import BlockHeader from './BlockHeader.vue';
import Mermaid from './Mermaid.vue';
import { toast, Icon } from '../base';
import { extractTextFromVNode, extractLanguageFromVNode, normalizeLanguage, trimCodeLines, copyToClipboard, highlightCode } from '../utils';
import { MarkdownThemeKey } from '../injection-keys';

const props = withDefaults(defineProps<{
  className?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean | 'auto';
  maxHeight?: number;
  maxLines?: number;
  defaultExpanded?: boolean;
}>(), {
  showLineNumbers: false,
  collapsible: 'auto',
  maxHeight: 400,
  maxLines: 15,
  defaultExpanded: false,
});

const slots = useSlots();
const bodyRef = ref<HTMLElement>();
const highlightedHtml = ref('');
const rawCode = ref('');
const detectedLang = ref('text');
const lineCount = ref(1);
const isExpanded = ref(props.defaultExpanded);
const themeMode = inject(MarkdownThemeKey, ref<'light' | 'dark'>('light'));

const displayLanguage = computed(() => detectedLang.value || 'text');

const isMermaid = computed(() => detectedLang.value === 'mermaid');

const isCollapsible = computed(() => {
  if (props.collapsible === true) return true;
  if (props.collapsible === false) return false;
  return lineCount.value > props.maxLines;
});

const bodyStyle = computed(() => {
  if (!isCollapsible.value || isExpanded.value) {
    return { maxHeight: 'none' };
  }
  return { maxHeight: `${props.maxHeight}px` };
});

const handleToggle = () => {
  isExpanded.value = !isExpanded.value;
};

async function highlight(code: string, lang: string): Promise<string> {
  const mappedLang = normalizeLanguage(lang);
  return highlightCode(code, mappedLang, themeMode.value);
}

async function processCode() {
  const content = slots.default?.();
  if (!content) return;
  
  let code = extractTextFromVNode(content);
  code = trimCodeLines(code);
  rawCode.value = code;
  lineCount.value = code.split('\n').length;
  
  let lang = extractLanguageFromVNode(content);
  if (lang === 'text' && props.className) {
    const match = props.className.match(/language-(\w+)/);
    if (match) lang = match[1];
  }
  
  detectedLang.value = lang;
  highlightedHtml.value = await highlight(code, lang);
}

onMounted(processCode);
watch(() => slots.default?.(), processCode, { deep: true });
watch(themeMode, () => {
  processCode();
});

async function handleCopy() {
  const success = await copyToClipboard(rawCode.value);
  if (success) {
    toast.success('复制成功');
  } else {
    toast.error('复制失败');
  }
}
</script>

<style scoped lang="scss">
@import '../styles/tokens.scss';

.md-code-block {
  position: relative;
  margin: $md-code-block-margin;
  border-radius: $md-code-block-radius;
  overflow: hidden;

  &__body {
    display: flex;
    overflow: auto;
    background: var(--#{$md-prefix}-code-body-bg, #{$md-code-body-bg});
    border: 1px solid var(--#{$md-prefix}-code-border, #{$md-code-body-border});
    border-top: none;
    border-radius: $md-code-body-radius;
    transition: max-height 0.25s ease;
    
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--#{$md-prefix}-scrollbar-thumb, #{$md-scrollbar-thumb-bg});
      border-radius: $md-scrollbar-radius;
      
      &:hover {
        background: var(--#{$md-prefix}-scrollbar-thumb-hover, #{$md-scrollbar-thumb-hover-bg});
      }
    }
    
    &::-webkit-scrollbar-track {
      background: var(--#{$md-prefix}-scrollbar-track, #{$md-scrollbar-track-bg});
    }
    
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }

  &__lines {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: $md-code-body-padding;
    padding-right: 0;
    background: var(--#{$md-prefix}-code-body-bg, #{$md-code-body-bg});
    border-right: 1px solid var(--#{$md-prefix}-color-border);
    user-select: none;
    position: sticky;
    left: 0;
    z-index: 1;
  }

  &__line-number {
    font-family: $md-code-font-family;
    font-size: $md-code-font-size;
    line-height: $md-code-line-height;
    color: var(--#{$md-prefix}-color-text-tertiary);
    text-align: right;
    min-width: 2em;
    padding-right: $spacing-3;
  }

  &__code {
    flex: 1;
    min-width: 0;
    overflow: visible;

    :deep(pre) {
      margin: 0;
      padding: $md-code-body-padding;
      background: transparent !important;
      overflow: visible;
      border: none;
    }

    :deep(code) {
      display: block;
      font-family: $md-code-font-family;
      font-size: $md-code-font-size;
      line-height: $md-code-line-height;
      color: var(--#{$md-prefix}-color-text);
      background: transparent !important;
      padding: 0;
      border: none;
      white-space: pre;
      tab-size: $md-code-tab-size;
    }

    :deep(.shiki),
    :deep(span) {
      background: transparent !important;
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

@media (max-width: 768px) {
  .md-code-block {
    &__body {
      border-radius: $radius-lg;
    }

    &__lines {
      padding: $spacing-3 $spacing-3;
    }

    &__line-number {
      font-size: $font-size-xs;
    }

    &__code {
      :deep(pre) {
        padding: $spacing-3 $spacing-4;
      }

      :deep(code) {
        font-size: $font-size-xs;
      }
    }
  }
}
</style>
