# markview-vue

基于 Vue 3 的现代化 Markdown/MDX 渲染组件库。

## 背景

在构建技术文档、博客、知识库等内容驱动型应用时，Markdown 渲染是核心需求。然而现有方案普遍存在以下问题：

- **功能碎片化**：语法高亮、数学公式、GFM 扩展需要分别引入多个库
- **样式不统一**：各组件风格割裂，缺乏整体设计感
- **交互体验差**：缺少图片预览、代码复制、目录导航等现代化功能
- **暗黑模式支持弱**：主题切换需要大量手动适配

`vue-markdown-render` 旨在提供一个**开箱即用、功能完整、设计统一**的 Markdown 渲染解决方案。

## 技术栈

| 技术 | 用途 |
|------|------|
| **MDX** | 核心编译引擎，支持在 Markdown 中使用 JSX 组件 |
| **Shiki** | 代码语法高亮，支持 VS Code 主题 |
| **KaTeX** | 数学公式渲染，LaTeX 语法支持 |
| **remark-gfm** | GitHub Flavored Markdown 扩展（表格、任务列表等）|
| **remark-math + rehype-katex** | 数学公式处理管道 |
| **Vue 3 Composition API** | 组件实现 |
| **SCSS + CSS Variables** | 样式系统，支持主题定制 |

## 核心特性

### 渲染能力
- MDX 实时编译渲染
- Shiki 语法高亮（100+ 语言，多主题）
- KaTeX 数学公式（行内 + 块级）
- GFM 扩展（表格、任务列表、删除线、自动链接）

### 交互增强
- 代码块一键复制
- 表格内容复制
- 图片点击预览
- 标题锚点链接
- 标题折叠展开

### 导航功能
- **TOC 目录**：自动提取标题、滚动高亮、点击跳转
- **回到顶部**：滚动阈值控制、平滑滚动

### 主题系统
- 亮色 / 暗黑主题切换
- CSS Variables 全面定制
- 响应式设计

## 安装

```bash
npm install markview-vue
```

## 快速开始

```vue
<template>
  <MarkdownRender :raw="content" />
</template>

<script setup>
import { MarkdownRender } from 'markview-vue';
import 'markview-vue/style.css';

const content = `# Hello World\n\n这是一段 **Markdown** 内容。`;
</script>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `raw` | `string` | `''` | Markdown/MDX 原始内容 |
| `format` | `'md' \| 'mdx'` | `'mdx'` | 内容格式 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `remarkGfm` | `boolean` | `true` | 启用 GFM 扩展 |
| `remarkPlugins` | `PluggableList` | `[]` | 自定义 remark 插件 |
| `rehypePlugins` | `PluggableList` | `[]` | 自定义 rehype 插件 |
| `components` | `object` | `{}` | 自定义组件映射 |
| `className` | `string` | - | 自定义类名 |
| `style` | `object` | - | 自定义样式 |
| `prefix` | `string` | `'md'` | CSS 类名前缀 |

#### TOC 目录配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showToc` | `boolean` | `false` | 显示右侧目录 |
| `tocMinLevel` | `number` | `2` | 目录最小标题层级 |
| `tocMaxLevel` | `number` | `3` | 目录最大标题层级 |
| `tocTitle` | `string` | `'目录'` | 目录标题文字 |

#### 回到顶部配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showBackTop` | `boolean` | `false` | 显示回到顶部按钮 |
| `backTopThreshold` | `number` | `300` | 显示阈值（滚动距离 px）|

### Events

| 事件 | 回调参数 | 说明 |
|------|----------|------|
| `rendered` | - | Markdown 渲染完成 |
| `error` | `(error: Error)` | 渲染发生错误 |
| `toc-change` | `(toc: TocItem[])` | 目录数据变化 |
| `toc-click` | `(item: TocItem)` | 点击目录项 |
| `scroll-to-top` | - | 点击回到顶部按钮 |

### 类型定义

```typescript
import type { MarkdownRenderProps, TocItem } from 'markview-vue';

interface TocItem {
  level: number;  // 标题层级 1-6
  text: string;   // 标题文本
  id: string;     // 锚点 ID
}
```

## 导出内容

### 组件

| 组件 | 说明 |
|------|------|
| `MarkdownRender` | 主渲染组件 |
| `CodeBlock` | 代码块组件 |
| `Table` | 表格组件 |
| `Blockquote` | 引用块组件 |
| `Heading` / `h1-h6` | 标题组件 |

### 基础组件

| 组件 | 说明 |
|------|------|
| `Tooltip` | 提示框 |
| `Toast` | 轻提示 |
| `Icon` | 图标 |
| `Tag` | 标签 |
| `ImagePreview` | 图片预览 |

### 工具函数

| 函数 | 说明 |
|------|------|
| `toast` | 显示轻提示 |
| `copyToClipboard` | 复制到剪贴板 |
| `extractTextFromVNode` | 从 VNode 提取文本 |

## 样式定制

通过 CSS Variables 自定义主题：

```css
:root {
  /* 文本颜色 */
  --md-color-text: #171717;
  --md-color-link: #2563eb;
  
  /* 代码块 */
  --md-code-header-bg: #f0f0f2;
  --md-code-body-bg: #fafafa;
  
  /* 表格 */
  --md-table-border: #e5e5e5;
  --md-table-header-bg: #f9fafb;
  
  /* TOC 目录 */
  --md-toc-bg: #f9fafb;
  --md-toc-border: #e5e5e5;
  
  /* 回到顶部 */
  --md-back-top-bg: #ffffff;
  --md-back-top-border: #e5e5e5;
}
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## License

MIT
