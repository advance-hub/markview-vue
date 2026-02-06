# markview-vue

Vue 3 的 Markdown/MDX 渲染组件。

## 背景

我们在做文档站的时候，需要一个 Markdown 渲染方案。看了一圈 Vue 生态里的库，要么功能不全，要么渲染出来的效果不太行——代码块没有好看的高亮，表格样式很素，暗黑模式支持也差。

与其拼凑各种库再花时间调样式，不如自己写一个。基于 MDX 做编译，用 Shiki 做代码高亮（和 VS Code 同款引擎），数学公式用 KaTeX，再把交互体验（代码复制、图片预览、目录导航这些）都做进去。样式这块用 CSS Variables，方便主题定制。

## 技术选型

- **MDX** - 编译引擎，支持在 Markdown 里嵌入 Vue 组件
- **Shiki** - 代码高亮，VS Code 同款，支持上百种语言和多套主题
- **KaTeX** - 数学公式渲染
- **remark-gfm** - GitHub 风格扩展（表格、任务列表、删除线等）
- **CSS Variables** - 样式系统，便于主题定制和暗黑模式切换

## 功能

渲染层面，支持 MDX 编译、Shiki 语法高亮、KaTeX 公式、GFM 扩展。

交互层面，代码块和表格支持一键复制，图片可以点击预览，标题有锚点链接，长文章的标题还能折叠。

导航层面，提供 TOC 目录组件（自动提取标题、滚动时高亮当前位置）和回到顶部按钮。

主题层面，内置亮色和暗黑两套主题，通过 CSS Variables 可以自定义任意样式。

## 安装

```bash
npm install markview-vue
```

## 使用

```vue
<template>
  <MarkdownRender :raw="content" />
</template>

<script setup>
import { MarkdownRender } from 'markview-vue'
import 'markview-vue/style.css'

const content = `# Hello World\n\n这是一段 **Markdown** 内容。`
</script>
```

## 自定义容器

支持 VitePress 风格的自定义容器语法，用于展示不同类型的提示信息。

### 多行格式（推荐）

```markdown
::: tip
这是一个提示框。提示框通常用于展示有用的建议或小技巧。
:::

::: warning
这是一个警告框。警告框用于提醒用户注意某些重要事项。
:::

::: danger
这是一个危险提示框。用于标记可能导致问题的操作或配置。
:::

::: info
这是一个信息框。用于展示一般性的补充信息。
:::
```

### 自定义标题

```markdown
::: tip 自定义提示
你可以自定义容器的标题文字。
:::

::: warning 重要提醒
设置 title 参数来覆盖默认标题。
:::
```

### 单行格式

```markdown
::: tip 这是单行提示内容 :::

::: warning 这是单行警告内容 :::
```

### 支持的容器类型

- `tip` - 提示（绿色）
- `warning` - 警告（黄色）
- `danger` - 危险（红色）
- `info` - 信息（蓝色）

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `raw` | `string` | `''` | Markdown/MDX 内容 |
| `format` | `'md' \| 'mdx'` | `'mdx'` | 内容格式 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题 |
| `remarkGfm` | `boolean` | `true` | GFM 扩展 |
| `remarkPlugins` | `PluggableList` | `[]` | 自定义 remark 插件 |
| `rehypePlugins` | `PluggableList` | `[]` | 自定义 rehype 插件 |
| `components` | `object` | `{}` | 自定义组件映射 |
| `showToc` | `boolean` | `false` | 显示目录 |
| `tocMinLevel` | `number` | `2` | 目录最小层级 |
| `tocMaxLevel` | `number` | `3` | 目录最大层级 |
| `showBackTop` | `boolean` | `false` | 显示回到顶部按钮 |
| `backTopThreshold` | `number` | `300` | 按钮显示的滚动阈值 (px) |

### Events

| 事件 | 说明 |
|------|------|
| `rendered` | 渲染完成 |
| `error` | 渲染出错，回调参数 `(error: Error)` |
| `toc-change` | 目录数据变化，回调参数 `(toc: TocItem[])` |
| `toc-click` | 点击目录项，回调参数 `(item: TocItem)` |

### 导出

```ts
// 主组件
import { MarkdownRender, CodeBlock, Table, Blockquote, Heading } from 'markview-vue'

// 基础组件
import { Tooltip, Toast, Icon, Tag, ImagePreview } from 'markview-vue'

// 工具函数
import { toast, copyToClipboard } from 'markview-vue'

// 类型
interface TocItem {
  level: number
  text: string
  id: string
}
```

## 样式定制

通过覆盖 CSS Variables 来自定义主题：

```css
:root {
  --md-color-text: #171717;
  --md-color-link: #2563eb;
  --md-code-header-bg: #f0f0f2;
  --md-code-body-bg: #fafafa;
  --md-table-border: #e5e5e5;
  --md-table-header-bg: #f9fafb;
}
```

## License

MIT
