<template>
  <component 
    :is="iconComponent" 
    :size="size" 
    :stroke-width="strokeWidth"
    :class="['md-icon', `md-icon--${name}`]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Copy, Check, X,
  ChevronRight, ChevronDown, ChevronUp, ChevronsUpDown,
  Expand, Shrink, Maximize2, Minimize2,
  RotateCw, RotateCcw, ZoomIn, ZoomOut, RefreshCw, Download, ExternalLink,
  CheckCircle, AlertCircle, AlertTriangle, Info, Lightbulb,
  Code, Code2, Table, Quote, Image, Link, Eye,
} from 'lucide-vue-next';

const iconMap = {
  copy: Copy,
  check: Check,
  close: X,
  x: X,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevrons-up-down': ChevronsUpDown,
  expand: Expand,
  shrink: Shrink,
  maximize: Maximize2,
  minimize: Minimize2,
  'rotate-cw': RotateCw,
  'rotate-ccw': RotateCcw,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
  refresh: RefreshCw,
  download: Download,
  'external-link': ExternalLink,
  success: CheckCircle,
  error: AlertCircle,
  'alert-circle': AlertCircle,
  warning: AlertTriangle,
  'alert-triangle': AlertTriangle,
  info: Info,
  lightbulb: Lightbulb,
  code: Code,
  'code-2': Code2,
  eye: Eye,
  table: Table,
  quote: Quote,
  image: Image,
  link: Link,
} as const;

export type IconName = keyof typeof iconMap;

const props = withDefaults(defineProps<{
  name: IconName;
  size?: number;
  strokeWidth?: number;
}>(), {
  size: 16,
  strokeWidth: 2,
});

const iconComponent = computed(() => iconMap[props.name]);
</script>

<style scoped>
.md-icon {
  flex-shrink: 0;
}
</style>
