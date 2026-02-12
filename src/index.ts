import type { App, Plugin } from 'vue';
import MarkdownRender from './MarkdownRender.vue';

export { default as MarkdownRender } from './MarkdownRender.vue';
export type { MarkdownRenderProps, TocItem } from './MarkdownRender.vue';

export * from './components';
export * from './base';
export * from './utils';

// Highlighter plugin + composable
export { useHighlighter, createHighlighterPlugin } from './useHighlighter';
export type { UseHighlighterReturn, HighlighterPluginOptions } from './useHighlighter';

/**
 * Vue 插件安装方法，支持 app.use() 方式全局注册
 */
export const VueMarkdownRender: Plugin = {
  install(app: App) {
    app.component('MarkdownRender', MarkdownRender);
  },
};

export default VueMarkdownRender;
