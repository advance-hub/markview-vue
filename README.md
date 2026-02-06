# Markview Vue

现代化的 Vue 3 Markdown/MDX 渲染组件，提供完整的文档渲染解决方案。

## 特性

- **MDX 支持** - 在 Markdown 中嵌入 Vue 组件，支持完整的响应式交互
- **语法高亮** - 基于 Shiki 引擎，与 VS Code 共享相同的语法着色逻辑
- **数学公式** - KaTeX 渲染，支持 LaTeX 语法
- **GFM 扩展** - 表格、任务列表、删除线、自动链接等
- **自定义容器** - Semi Design 风格的提示框组件
- **主题系统** - 内置亮色/暗色主题，支持 CSS 变量定制
- **目录导航** - 自动提取标题生成 TOC，支持滚动高亮
- **交互增强** - 代码一键复制、图片点击预览、标题锚点链接
- **无障碍** - 遵循 ARIA 标准，支持键盘导航
- **TypeScript** - 完整的类型定义

## 技术栈

| 技术 | 用途 | 说明 |
|------|------|------|
| MDX | 编译引擎 | 支持在 Markdown 中嵌入组件 |
| Shiki | 代码高亮 | VS Code 同款引擎，支持 100+ 语言 |
| KaTeX | 数学公式 | 快速的 LaTeX 渲染引擎 |
| remark-gfm | GFM 扩展 | GitHub Flavored Markdown 支持 |
| Vue 3 | UI 框架 | Composition API + TypeScript |

## 安装

```bash
npm install markview-vue
# 或
pnpm add markview-vue
# 或
yarn add markview-vue
```

## 快速开始

### 基础用法

```vue
<template>
  <MarkdownRender :raw="content" />
</template>

<script setup>
import { MarkdownRender } from 'markview-vue'
import 'markview-vue/style.css'

const content = `
# Hello World

这是一段 **Markdown** 内容。

\`\`\`javascript
console.log('Hello Markview!');
\`\`\`
`
</script>
```

### 加载外部文件

```vue
<template>
  <MarkdownRender :raw="mdContent" />
</template>

<script setup>
import { MarkdownRender } from 'markview-vue'
import 'markview-vue/style.css'
import mdContent from './document.md?raw'
</script>
```

## 核心功能

### 1. 代码高亮

支持 100+ 编程语言的语法高亮，基于 Shiki 引擎：

```markdown
\`\`\`typescript
interface User {
  id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: 'Alice'
};
\`\`\`
```

特性：
- 代码块标题显示
- 一键复制功能
- 行号显示（可配置）
- 主题定制

### 2. 数学公式

支持 LaTeX 语法的数学公式渲染：

**行内公式：** 使用单个 `$` 符号

```markdown
当 $a \ne 0$ 时，方程 $ax^2 + bx + c = 0$ 的解为 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$。
```

**块级公式：** 使用双 `$$` 符号

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 3. 表格

支持 GFM 表格语法，包括对齐方式：

```markdown
| 列名 | 左对齐 | 居中对齐 | 右对齐 |
|------|:-------|:--------:|-------:|
| 数据 | 内容A  | 内容B    | 123    |
```

特性：
- 表头固定（可配置）
- 表格复制功能
- 响应式布局
- 斑马纹样式

### 4. 自定义容器

支持 VitePress 兼容的容器语法，采用 Semi Design 视觉风格：

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

自定义标题：

```markdown
::: tip 最佳实践
你可以自定义容器的标题文字。
:::
```

支持的类型：
- `tip` - 提示（绿色）
- `warning` - 警告（橙色）
- `danger` - 危险（红色）
- `info` - 信息（蓝色）

### 5. 自定义 Vue 组件

Markview Vue 基于 MDX，支持在 Markdown 中嵌入 Vue 组件。

#### 方式 1：预注册组件

```vue
<template>
  <MarkdownRender :raw="content" :components="{ MyButton, MyCard }" />
</template>

<script setup>
import { MarkdownRender } from 'markview-vue'
import MyButton from './components/MyButton.vue'
import MyCard from './components/MyCard.vue'
</script>
```

在 Markdown 中使用：

```markdown
# 文档标题

<MyButton text="点击我" />

<MyCard title="卡片标题">
卡片内容支持完整的 Markdown 语法。
</MyCard>
```

#### 方式 2：MDX 中直接定义

```mdx
export const Alert = ({ type, children }) => (
  <div class={`alert alert-${type}`}>
    {children}
  </div>
);

<Alert type="success">操作成功！</Alert>
```

#### 方式 3：组件嵌套

```markdown
::: tip
<MyButton text="容器内的按钮" />
:::
```

详细说明请参考 [自定义组件指南](./CUSTOM_COMPONENTS.md)。

### 6. 目录导航（TOC）

自动提取文档标题生成目录：

```vue
<MarkdownRender 
  :raw="content" 
  :show-toc="true"
  :toc-min-level="2"
  :toc-max-level="4"
  :toc-mode="'sidebar'"
  @toc-change="handleTocChange"
/>
```

特性：
- 自动提取 H1-H6 标题
- 滚动时高亮当前位置
- 点击跳转到对应章节
- 支持侧边栏和嵌入式两种布局

### 7. 图片预览

点击图片自动弹出预览窗口，支持缩放、旋转等操作。

### 8. 回到顶部

长文档自动显示回到顶部按钮：

```vue
<MarkdownRender 
  :raw="content" 
  :show-back-top="true"
  :back-top-threshold="300"
/>
```

## API 文档

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `raw` | `string` | `''` | Markdown/MDX 原始内容 |
| `format` | `'md' \| 'mdx'` | `'mdx'` | 内容格式 |
| `components` | `Record<string, Component>` | `{}` | 自定义组件映射表 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `remarkGfm` | `boolean` | `true` | 是否启用 GFM 扩展 |
| `remarkPlugins` | `PluggableList` | `[]` | 自定义 remark 插件 |
| `rehypePlugins` | `PluggableList` | `[]` | 自定义 rehype 插件 |
| `style` | `CSSProperties` | - | 自定义样式对象 |
| `className` | `string` | - | 自定义 CSS 类名 |
| `prefix` | `string` | `'md'` | CSS 类名前缀 |
| `height` | `string` | - | 固定高度（如 `'500px'`） |
| `maxHeight` | `string` | - | 最大高度（如 `'80vh'`） |
| `showToc` | `boolean` | `false` | 是否显示目录 |
| `tocMinLevel` | `number` | `2` | 目录最小层级（H2） |
| `tocMaxLevel` | `number` | `4` | 目录最大层级（H4） |
| `docTitle` | `string` | - | 文档标题（显示在 TOC 顶部） |
| `tocMode` | `'sidebar' \| 'embedded'` | `'sidebar'` | 目录布局模式 |
| `showBackTop` | `boolean` | `false` | 是否显示回到顶部按钮 |
| `backTopThreshold` | `number` | `300` | 回到顶部按钮显示阈值（像素） |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `rendered` | - | 渲染完成时触发 |
| `error` | `(error: Error)` | 渲染出错时触发 |
| `toc-change` | `(toc: TocItem[])` | 目录数据变化时触发 |
| `toc-click` | `(item: TocItem)` | 点击目录项时触发 |
| `scroll-to-top` | - | 点击回到顶部按钮时触发 |

### 类型定义

```typescript
interface TocItem {
  level: number;    // 标题层级 (1-6)
  text: string;     // 标题文本
  id: string;       // 锚点 ID
}

interface MarkdownRenderProps {
  raw?: string;
  format?: 'md' | 'mdx';
  components?: Record<string, any>;
  theme?: 'light' | 'dark';
  remarkGfm?: boolean;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  style?: Record<string, any>;
  className?: string;
  prefix?: string;
  height?: string;
  maxHeight?: string;
  showToc?: boolean;
  tocMinLevel?: number;
  tocMaxLevel?: number;
  docTitle?: string;
  tocMode?: 'sidebar' | 'embedded';
  showBackTop?: boolean;
  backTopThreshold?: number;
}
```

### 导出内容

```typescript
// 主组件
import { MarkdownRender } from 'markview-vue'

// 子组件（可选）
import { 
  CodeBlock, 
  Table, 
  Blockquote, 
  Container,
  Heading,
  Toc
} from 'markview-vue'

// 基础组件
import { 
  Icon, 
  Tooltip, 
  Toast, 
  ImagePreview,
  Tag
} from 'markview-vue'

// 工具函数
import { 
  toast,
  copyToClipboard,
  highlightCode,
  preprocessContainers
} from 'markview-vue'

// 类型定义
import type { 
  TocItem,
  MarkdownRenderProps,
  IconName,
  ContainerType
} from 'markview-vue'
```

## 高级用法

### 主题定制

通过 CSS 变量自定义主题：

```css
:root {
  /* 文本颜色 */
  --md-color-text: #1f2937;
  --md-color-text-secondary: #6b7280;
  
  /* 链接颜色 */
  --md-color-link: #0064fa;
  --md-color-link-hover: #005dd6;
  
  /* 代码块 */
  --md-code-header-bg: #f9fafb;
  --md-code-body-bg: #ffffff;
  --md-code-border: #e5e7eb;
  
  /* 表格 */
  --md-table-border: #e5e7eb;
  --md-table-header-bg: #f9fafb;
  --md-table-row-hover-bg: #f9fafb;
  
  /* 引用块 */
  --md-blockquote-border: #0064fa;
  --md-blockquote-bg: rgba(0, 100, 250, 0.06);
}
```

### 自定义插件

```vue
<script setup>
import { MarkdownRender } from 'markview-vue'
import remarkDirective from 'remark-directive'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const remarkPlugins = [remarkDirective]
const rehypePlugins = [rehypeAutolinkHeadings]
</script>

<template>
  <MarkdownRender 
    :raw="content"
    :remark-plugins="remarkPlugins"
    :rehype-plugins="rehypePlugins"
  />
</template>
```

### 响应式高度

```vue
<template>
  <!-- 固定高度，内部滚动 -->
  <MarkdownRender :raw="content" height="500px" />
  
  <!-- 最大高度，超出滚动 -->
  <MarkdownRender :raw="content" max-height="80vh" />
  
  <!-- 视口高度计算 -->
  <MarkdownRender :raw="content" height="calc(100vh - 60px)" />
</template>
```

### 目录配置

```vue
<template>
  <MarkdownRender 
    :raw="content"
    :show-toc="true"
    :toc-min-level="2"
    :toc-max-level="3"
    :doc-title="'文档标题'"
    :toc-mode="'sidebar'"
    @toc-change="handleTocChange"
    @toc-click="handleTocClick"
  />
</template>

<script setup>
const handleTocChange = (toc) => {
  console.log('目录更新:', toc)
}

const handleTocClick = (item) => {
  console.log('点击目录:', item)
}
</script>
```

### 完整配置示例

```vue
<template>
  <MarkdownRender 
    :raw="content"
    format="mdx"
    :components="customComponents"
    :theme="isDark ? 'dark' : 'light'"
    :remark-gfm="true"
    :remark-plugins="remarkPlugins"
    :rehype-plugins="rehypePlugins"
    :show-toc="true"
    :toc-min-level="2"
    :toc-max-level="4"
    :toc-mode="'sidebar'"
    :show-back-top="true"
    :back-top-threshold="300"
    height="calc(100vh - 80px)"
    class-name="custom-markdown"
    @rendered="onRendered"
    @error="onError"
    @toc-change="onTocChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MarkdownRender } from 'markview-vue'
import 'markview-vue/style.css'

const isDark = ref(false)
const customComponents = { /* 自定义组件 */ }
const remarkPlugins = []
const rehypePlugins = []

const onRendered = () => {
  console.log('渲染完成')
}

const onError = (error) => {
  console.error('渲染错误:', error)
}

const onTocChange = (toc) => {
  console.log('目录更新:', toc)
}
</script>
```

## 组件库导出

除主组件外，还导出以下可复用组件：

### 核心组件

```typescript
import { 
  CodeBlock,      // 代码块
  Table,          // 表格
  Blockquote,     // 引用块
  Container,      // 自定义容器
  Heading,        // 标题
  Toc,            // 目录
} from 'markview-vue'
```

### 基础组件

```typescript
import {
  Icon,           // 图标
  Tooltip,        // 工具提示
  Toast,          // 提示消息
  ImagePreview,   // 图片预览
  Tag,            // 标签
  Skeleton,       // 骨架屏
} from 'markview-vue'
```

### 工具函数

```typescript
import {
  toast,                  // 显示提示消息
  copyToClipboard,        // 复制到剪贴板
  highlightCode,          // 代码高亮
  preprocessContainers,   // 容器语法预处理
} from 'markview-vue'

// 使用示例
toast.success('操作成功')
await copyToClipboard('复制的内容')
```

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 性能优化

### 按需加载

Shiki 语言包采用动态 import，仅在使用时加载：

```typescript
// 预设语言：javascript, typescript, python, vue 等
// 其他语言首次使用时自动下载
```

### 虚拟滚动

大型文档（1000+ 行）建议启用虚拟滚动（规划中）。

### 缓存策略

MDX 编译结果会缓存，相同内容不会重复编译。

## 开发指南

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-repo/markview-vue.git
cd markview-vue

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
# 访问 http://localhost:3002
```

### 构建

```bash
# 构建库文件
pnpm build

# 构建演示站点
pnpm build:demo

# 预览演示站点
pnpm preview
```

### 项目结构

```
markview-vue/
├── src/                # 源代码
│   ├── components/     # 核心组件
│   ├── base/           # 基础组件
│   ├── utils/          # 工具函数
│   ├── styles/         # 样式文件
│   └── index.ts        # 入口文件
├── dev/                # 开发环境
│   ├── components/     # 演示组件
│   ├── content/        # 演示内容
│   └── App.vue         # 演示应用
├── dist/               # 构建输出
└── demo-dist/          # 演示站点输出
```

详细开发指南请参考 [DEVELOPMENT.md](./DEVELOPMENT.md)。

## 常见问题

### 1. 如何修改代码块主题？

目前使用 `github-light` 主题。自定义主题支持计划中。

### 2. 是否支持服务端渲染（SSR）？

暂不支持。MDX 编译依赖浏览器环境。

### 3. 如何处理大型文档？

建议：
- 使用 `height` 或 `maxHeight` 启用内部滚动
- 拆分文档为多个小文件
- 禁用不需要的功能（如 TOC）

### 4. 数学公式不显示？

确保引入了 KaTeX 样式：

```javascript
import 'markview-vue/style.css'  // 已包含 KaTeX 样式
```

### 5. 组件在 Markdown 中不工作？

检查：
- 是否设置 `format="mdx"`
- 组件名是否使用 PascalCase
- 组件是否通过 `components` prop 注册

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本历史。

## 贡献指南

欢迎提交 Issue 和 Pull Request。

贡献前请阅读：
- [开发指南](./DEVELOPMENT.md)
- [代码规范](./CODE_OF_CONDUCT.md)

## 许可证

MIT License

Copyright (c) 2024-present

## 相关链接

- [在线演示](https://your-demo-site.com)
- [GitHub 仓库](https://github.com/your-repo/markview-vue)
- [npm 包](https://www.npmjs.com/package/markview-vue)
- [问题反馈](https://github.com/your-repo/markview-vue/issues)

## 致谢

本项目基于以下优秀的开源项目：

- [MDX](https://mdxjs.com/) - Markdown 扩展格式
- [Shiki](https://shiki.style/) - 语法高亮引擎
- [KaTeX](https://katex.org/) - 数学公式渲染
- [remark](https://github.com/remarkjs/remark) - Markdown 处理器
- [rehype](https://github.com/rehypejs/rehype) - HTML 处理器
- [lucide-vue-next](https://lucide.dev/) - 图标库
- [Semi Design](https://semi.design/) - 设计系统参考

---

**如有问题或建议，欢迎提交 Issue。**
