<template>
  <div :class="['md-container', containerClass]" role="alert">
    <div class="md-container__icon">
      <Icon :name="iconName" :size="16" :stroke-width="2.5" />
    </div>
    <div class="md-container__main">
      <div class="md-container__header">{{ displayTitle }}</div>
      <div class="md-container__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon, type IconName } from '../base';

export type ContainerType = 'tip' | 'warning' | 'danger' | 'info';

interface Props {
  type?: ContainerType;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
});

const containerClass = computed(() => `md-container--${props.type}`);

const iconName = computed<IconName>(() => {
  const icons: Record<ContainerType, IconName> = {
    tip: 'lightbulb',
    warning: 'alert-triangle',
    danger: 'alert-circle',
    info: 'info',
  };
  return icons[props.type] || 'info';
});

const displayTitle = computed(() => {
  if (props.title) return props.title;
  const titles: Record<ContainerType, string> = {
    tip: '提示',
    warning: '注意',
    danger: '警告',
    info: '信息',
  };
  return titles[props.type] || '信息';
});
</script>

<style scoped lang="scss">
@import '../styles/tokens.scss';

// Semi Design 官方 Banner 样式
.md-container {
  position: relative;
  margin: 16px 0;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  line-height: 20px;
  
  &__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-top: 2px;
  }
  
  &__main {
    flex: 1;
    min-width: 0;
    padding-top: 4px;
  }
  
  &__header {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 8px;
  }
  
  &__content {
    font-size: 14px;
    line-height: 20px;
    
    :deep(> *:first-child) { margin-top: 0; }
    :deep(> *:last-child) { margin-bottom: 0; }
    :deep(p) { 
      margin: 0 0 8px; 
      &:last-child { margin-bottom: 0; } 
    }
    :deep(code) { 
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 13px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    }
  }
  
  // Tip/Success 样式
  &--tip {
    background: rgb(236, 247, 236);
    border: 1px solid rgb(208, 240, 209);
    
    .md-container__icon { 
      background: rgb(90, 194, 98);
      color: #fff;
    }
    
    .md-container__header {
      color: rgb(29, 33, 41);
    }
    
    .md-container__content {
      color: rgba(29, 33, 41, 0.8);
      
      :deep(code) { 
        background: rgb(208, 240, 209);
        color: rgb(56, 158, 13);
      }
    }
  }
  
  // Warning 样式
  &--warning {
    background: rgb(254, 245, 233);
    border: 1px solid rgb(253, 231, 197);
    
    .md-container__icon { 
      background: rgb(250, 140, 22);
      color: #fff;
    }
    
    .md-container__header {
      color: rgb(29, 33, 41);
    }
    
    .md-container__content {
      color: rgba(29, 33, 41, 0.8);
      
      :deep(code) { 
        background: rgb(253, 231, 197);
        color: rgb(204, 107, 11);
      }
    }
  }
  
  // Danger 样式
  &--danger {
    background: rgb(254, 240, 240);
    border: 1px solid rgb(254, 220, 220);
    
    .md-container__icon { 
      background: rgb(245, 63, 63);
      color: #fff;
    }
    
    .md-container__header {
      color: rgb(29, 33, 41);
    }
    
    .md-container__content {
      color: rgba(29, 33, 41, 0.8);
      
      :deep(code) { 
        background: rgb(254, 220, 220);
        color: rgb(217, 45, 45);
      }
    }
  }
  
  // Info 样式
  &--info {
    background: rgb(234, 245, 255);
    border: 1px solid rgb(203, 231, 254);
    
    .md-container__icon { 
      background: rgb(59, 130, 246);
      color: #fff;
    }
    
    .md-container__header {
      color: rgb(29, 33, 41);
    }
    
    .md-container__content {
      color: rgba(29, 33, 41, 0.8);
      
      :deep(code) { 
        background: rgb(203, 231, 254);
        color: rgb(0, 98, 214);
      }
    }
  }
  
  // 暗色主题
  :global(.md-render--dark) & {
    &--tip {
      background: rgba(56, 158, 13, 0.12);
      border-color: rgba(90, 194, 98, 0.25);
      
      .md-container__icon { 
        background: rgb(90, 194, 98);
        color: #000;
      }
      
      .md-container__header { color: rgba(255, 255, 255, 0.95); }
      
      .md-container__content {
        color: rgba(255, 255, 255, 0.75);
        :deep(code) { 
          background: rgba(90, 194, 98, 0.2);
          color: rgb(208, 240, 209);
        }
      }
    }
    
    &--warning {
      background: rgba(204, 107, 11, 0.12);
      border-color: rgba(250, 140, 22, 0.25);
      
      .md-container__icon { 
        background: rgb(250, 140, 22);
        color: #000;
      }
      
      .md-container__header { color: rgba(255, 255, 255, 0.95); }
      
      .md-container__content {
        color: rgba(255, 255, 255, 0.75);
        :deep(code) { 
          background: rgba(250, 140, 22, 0.2);
          color: rgb(253, 231, 197);
        }
      }
    }
    
    &--danger {
      background: rgba(217, 45, 45, 0.12);
      border-color: rgba(245, 63, 63, 0.25);
      
      .md-container__icon { 
        background: rgb(245, 63, 63);
        color: #fff;
      }
      
      .md-container__header { color: rgba(255, 255, 255, 0.95); }
      
      .md-container__content {
        color: rgba(255, 255, 255, 0.75);
        :deep(code) { 
          background: rgba(245, 63, 63, 0.2);
          color: rgb(254, 220, 220);
        }
      }
    }
    
    &--info {
      background: rgba(0, 98, 214, 0.12);
      border-color: rgba(59, 130, 246, 0.25);
      
      .md-container__icon { 
        background: rgb(59, 130, 246);
        color: #fff;
      }
      
      .md-container__header { color: rgba(255, 255, 255, 0.95); }
      
      .md-container__content {
        color: rgba(255, 255, 255, 0.75);
        :deep(code) { 
          background: rgba(59, 130, 246, 0.2);
          color: rgb(203, 231, 254);
        }
      }
    }
  }
}
</style>
