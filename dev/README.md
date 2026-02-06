# Dev 开发环境

这是 Markview Vue 的开发和演示环境，用于实时预览和测试组件功能。

## 📁 目录结构

```
dev/
├── components/          # 自定义 Vue 组件示例
│   ├── CustomButton.vue # 按钮组件（4种类型）
│   ├── Card.vue         # 卡片组件
│   ├── Counter.vue      # 计数器组件（响应式）
│   ├── Badge.vue        # 徽章组件
│   ├── Progress.vue     # 进度条组件
│   └── Tabs.vue         # 选项卡组件
├── content/             # Markdown 演示内容
│   ├── demo.md          # 主要功能演示
│   └── component-demo.md # 自定义组件演示
├── index.html           # 入口 HTML
├── main.ts              # 入口 JS
├── App.vue              # 主应用组件
└── README.md            # 本文件
```

## 🚀 开发命令

### 启动开发服务器

```bash
pnpm dev
```

- 端口：`http://localhost:3002/`
- 实时热更新
- 修改 `src/` 源码立即生效

### 构建演示站点

```bash
pnpm build:demo
```

- 输出目录：`demo-dist/`
- 可部署到 GitHub Pages 等静态托管

### 预览构建结果

```bash
pnpm preview
```

- 本地预览构建后的站点
- 端口：`http://localhost:3002/`

### 部署到 GitHub Pages

```bash
pnpm deploy:demo
```

- 自动构建并部署到 `gh-pages` 分支

## 🎨 添加自定义组件

### 步骤 1：创建组件

在 `components/` 目录下创建 Vue 组件：

```vue
<!-- components/MyComponent.vue -->
<template>
  <div class="my-component">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<style scoped>
.my-component {
  padding: 12px;
  background: #f0f9ff;
  border-radius: 4px;
}
</style>
```

### 步骤 2：注册组件

在 `App.vue` 中导入并注册：

```typescript
import MyComponent from './components/MyComponent.vue';

const customComponents = {
  // ... 其他组件
  MyComponent,
};
```

### 步骤 3：在 Markdown 中使用

在 `content/demo.md` 中使用：

```markdown
<MyComponent text="Hello World" />
```

保存后浏览器自动更新！

## 📝 编辑演示内容

### 修改主演示

编辑 `content/demo.md` 查看各种功能。

### 修改组件演示

编辑 `content/component-demo.md` 专注测试自定义组件。

### 切换演示内容

在 `App.vue` 中修改导入：

```typescript
import demoMd from './content/component-demo.md?raw';  // 切换到组件演示
```

## 🔧 配置说明

### Vite 配置

- 开发模式：使用 `dev/` 作为根目录
- 构建模式：
  - `--mode production`：构建库文件到 `dist/`
  - `--mode development`：构建演示站点到 `demo-dist/`

### 环境变量

开发时 `command === 'serve'` 自动切换配置。

## 💡 使用技巧

### 实时开发

1. 运行 `pnpm dev`
2. 修改 `src/components/Container.vue` 等源文件
3. 保存后浏览器自动热更新

### 测试自定义组件

1. 在 `components/` 创建新组件
2. 在 `App.vue` 注册
3. 在 `content/demo.md` 使用
4. 实时查看效果

### 调试样式

在浏览器开发工具中调试，找到合适的样式后复制到源码。

## 📦 部署

构建后的 `demo-dist/` 目录可以直接部署到：

- GitHub Pages
- Vercel
- Netlify
- 任何静态托管服务

## 🎯 与 playground 的区别

| 特性 | dev/ | playground/ |
|------|------|-------------|
| 用途 | 开发组件 | 完整 Demo |
| 启动速度 | 快 | 慢 |
| 组件注册 | 简单 | 复杂 |
| 适用场景 | 快速迭代 | 展示所有功能 |

**推荐：日常开发用 `dev/`，最终展示用 `playground/`**
