<template>
  <div class="md-table">
    <BlockHeader label="表格" copyable @copy="handleCopy" />
    <div class="md-table__body" ref="tableRef">
      <table>
        <slot />
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BlockHeader from './BlockHeader.vue';
import { toast } from '../base';
import { copyToClipboard } from '../utils';

const tableRef = ref<HTMLElement>();

async function handleCopy() {
  if (!tableRef.value) return;
  
  const table = tableRef.value.querySelector('table');
  if (!table) return;
  
  const rows = Array.from(table.querySelectorAll('tr'));
  const text = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('th, td'));
    return cells.map(cell => cell.textContent?.trim() || '').join('\t');
  }).join('\n');
  
  const success = await copyToClipboard(text);
  if (success) {
    toast.success('复制成功');
  } else {
    toast.error('复制失败');
  }
}
</script>

<style scoped lang="scss">
@import '../styles/tokens.scss';

.md-table {
  border-radius: $md-table-radius;
  overflow: hidden;
  margin: $md-table-margin;

  &__body {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    background: var(--#{$md-prefix}-table-bg, #{$md-table-bg});
    border: 1px solid var(--#{$md-prefix}-table-border, #{$md-table-border});
    border-top: none;
    border-radius: 0 0 $radius-xl $radius-xl;
    scrollbar-width: thin;
    scrollbar-color: var(--#{$md-prefix}-scrollbar-thumb, #{$md-scrollbar-thumb-bg}) var(--#{$md-prefix}-scrollbar-track, #{$md-scrollbar-track-bg});

    &::-webkit-scrollbar {
      height: $md-scrollbar-height;
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
  }
}

:deep(table) {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  font-size: $md-table-font-size;
  line-height: $md-table-line-height;

  th, td {
    padding: $md-table-cell-padding;
    text-align: left;
    border-bottom: 1px solid var(--#{$md-prefix}-table-border, #{$md-table-border});
    color: var(--#{$md-prefix}-color-text);
    word-break: break-word;

    &:not(:last-child) {
      border-right: 1px solid var(--#{$md-prefix}-table-border, #{$md-table-border});
    }
  }

  thead th {
    font-weight: $md-table-th-font-weight;
    font-size: $md-table-th-font-size;
    background: var(--#{$md-prefix}-table-header-bg, #{$md-table-th-bg});
    color: var(--#{$md-prefix}-color-text);
    white-space: nowrap;
  }

  tbody {
    tr:last-child td {
      border-bottom: none;
    }

    tr:nth-child(even) td {
      background: var(--#{$md-prefix}-table-stripe-bg, transparent);
    }

    tr:hover td {
      background: var(--#{$md-prefix}-table-hover-bg, #{$md-table-row-hover-bg});
    }
  }
}

// 移动端：允许横向滚动，自适应宽度
@media (max-width: 768px) {
  :deep(table) {
    th, td {
      padding: $spacing-2 $spacing-3;
      font-size: $font-size-xs;
    }

    thead th {
      font-size: $font-size-xs;
    }
  }
}

@media (max-width: 480px) {
  :deep(table) {
    font-size: 11px;

    th, td {
      padding: $spacing-1 $spacing-2;
    }
  }
}
</style>
