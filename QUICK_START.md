# 快速开始指南

## 开发者速查

### 本地开发（推荐）

```bash
# 1. 启动开发服务器
pnpm dev

# 访问 http://localhost:3002
# 修改 src/ 下的文件，浏览器自动更新
```

### 构建

```bash
# 构建 npm 库（发布用）
pnpm build
# 输出：dist/

# 构建演示站点（部署用）
pnpm build:demo
# 输出：demo-dist/

# 预览演示站点
pnpm preview
# 访问 http://localhost:3002
```

### 部署演示站点

```bash
# 自动构建并部署到 GitHub Pages
pnpm deploy:demo
```

---

## 目录结构速查

```
packages/markview-vue/
├── src/                    # 📦 库源码（发布到 npm）
│   ├── components/         # 核心组件
│   │   ├── Container.vue   # 自定义容器
│   │   ├── CodeBlock.vue   # 代码块
│   │   └── ...
│   ├── utils/              
│   │   └── remarkContainer.ts  # 容器语法处理
│   └── index.ts            # 导出入口
│
├── dev/                    # 🛠️ 开发环境（实时预览）
│   ├── components/         # 演示用的自定义组件
│   │   ├── CustomButton.vue
│   │   ├── Card.vue
│   │   ├── Counter.vue
│   │   ├── Badge.vue
│   │   ├── Progress.vue
│   │   └── Tabs.vue
│   ├── content/            # Markdown 演示文档
│   │   ├── demo.md         # 主要演示
│   │   └── component-demo.md  # 组件演示
│   ├── index.html          # 入口页面
│   ├── main.ts             # 入口脚本
│   └── App.vue             # 主应用
│
├── dist/                   # 📤 构建输出（npm 包）
│   ├── index.js            # ES Module
│   ├── index.cjs           # CommonJS
│   ├── index.d.ts          # TypeScript 类型
│   └── style.css           # 样式文件
│
└── demo-dist/              # 🌐 演示站点（可部署）
    ├── index.html
    └── assets/             # 静态资源
```

---

## 命令速查表

| 命令 | 用途 | 输出 | 端口 |
|------|------|------|------|
| `pnpm dev` | 开发服务器 | - | 3002 |
| `pnpm build` | 构建库 | `dist/` | - |
| `pnpm build:demo` | 构建演示 | `demo-dist/` | - |
| `pnpm build:watch` | Watch 构建库 | `dist/` | - |
| `pnpm preview` | 预览演示 | - | 3002 |
| `pnpm deploy:demo` | 部署演示 | GitHub Pages | - |

---

## 工作流速查

### 开发新功能

```bash
# 1. 启动开发服务器
pnpm dev

# 2. 修改源码
vim src/components/Container.vue

# 3. 保存后浏览器自动更新
# 4. 测试通过后提交
git add .
git commit -m "feat: 添加新功能"
```

### 测试自定义组件

```bash
# 1. 在 dev/components/ 创建组件
vim dev/components/MyTest.vue

# 2. 在 dev/components/index.ts 导出
export { default as MyTest } from './MyTest.vue';

# 3. 在 dev/content/demo.md 使用
<MyTest />

# 4. 浏览器自动显示
```

### 发布新版本

```bash
# 1. 确保所有测试通过
pnpm dev  # 手动测试

# 2. 构建并检查
pnpm build:check

# 3. 更新版本号
npm version patch  # 或 minor / major

# 4. 发布到 npm
pnpm publish

# 5. 部署演示站点
pnpm deploy:demo
```

---

## 常用代码片段

### 基础用法

```vue
<template>
  <MarkdownRender :raw="content" />
</template>

<script setup>
import { MarkdownRender } from 'markview-vue'
import 'markview-vue/style.css'

const content = '# Hello World'
</script>
```

### 带自定义组件

```vue
<template>
  <MarkdownRender :raw="content" :components="{ MyButton }" />
</template>

<script setup>
import { MarkdownRender } from 'markview-vue'
import MyButton from './MyButton.vue'

const content = '<MyButton text="Click" />'
</script>
```

### 完整配置

```vue
<template>
  <MarkdownRender 
    :raw="content"
    :theme="theme"
    :show-toc="true"
    :show-back-top="true"
  />
</template>
```

---

## 问题排查

### 服务器启动失败

```bash
# 清理缓存
rm -rf node_modules/.vite

# 重新安装
pnpm install

# 重启
pnpm dev
```

### 打包失败

```bash
# 检查类型错误
pnpm build:check

# 清理并重建
rm -rf dist/ demo-dist/
pnpm build
```

### HMR 不工作

```bash
# 硬刷新浏览器
Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

# 或重启服务器
Ctrl+C
pnpm dev
```

---

## 更多信息

- 完整文档：[README.md](./README.md)
- 开发指南：[DEVELOPMENT.md](./DEVELOPMENT.md)
- 自定义组件：[CUSTOM_COMPONENTS.md](./CUSTOM_COMPONENTS.md)
- 更新日志：[CHANGELOG.md](./CHANGELOG.md)
