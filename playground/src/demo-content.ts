export const demoMarkdown = `# Markview Vue 功能演示

这是一个完整的 **Markview Vue** 组件功能演示，展示了 Markdown 渲染器支持的各种特性。

## 基础文本格式

Markdown 支持多种文本格式化方式：

- **粗体文本** 使用双星号
- *斜体文本* 使用单星号
- ~~删除线~~ 使用双波浪号
- \`行内代码\` 使用反引号
- ==高亮文本== 使用双等号（需要扩展支持）

还可以组合使用，如 ***粗斜体*** 或 **带有 \`代码\` 的粗体**。

## 标题层级

文档支持六级标题，TOC 会自动提取 H2-H4 级别的标题。

### 三级标题示例

这是三级标题下的内容。

#### 四级标题示例

这是四级标题下的内容，TOC 默认会包含到这一级。

##### 五级标题示例

五级标题不会出现在默认 TOC 中。

## 列表展示

### 无序列表

- 苹果
- 香蕉
  - 小米蕉
  - 芭蕉
  - 皇帝蕉
- 橘子
  - 砂糖橘
    - 广西砂糖橘
    - 福建砂糖橘

### 有序列表

1. 第一步：准备材料
2. 第二步：开始制作
   1. 切菜
   2. 调料
   3. 下锅
3. 第三步：出锅装盘

### 任务列表

- [x] 完成项目初始化
- [x] 实现基础组件
- [ ] 编写单元测试
- [ ] 部署到生产环境

## 代码高亮

### JavaScript 示例

\`\`\`javascript
// 使用 Shiki 进行语法高亮
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 测试斐波那契数列
const result = Array.from({ length: 10 }, (_, i) => fibonacci(i));
console.log('Fibonacci:', result);
// 输出: Fibonacci: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

### Vue 组件示例

\`\`\`vue
<template>
  <div class="counter">
    <p>计数: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const increment = () => count.value++;
const decrement = () => count.value--;
</script>

<style scoped>
.counter {
  padding: 20px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
}
</style>
\`\`\`

### TypeScript 示例

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json();
}

// 使用示例
const user = await fetchUser(123);
console.log(\`Hello, \${user.name}!\`);
\`\`\`

### JSON 配置示例

\`\`\`json
{
  "name": "markview-vue",
  "version": "0.1.1",
  "description": "Vue 3 Markdown/MDX 渲染器",
  "features": [
    "代码高亮",
    "数学公式",
    "GFM 扩展",
    "TOC 目录"
  ]
}
\`\`\`

### Shell 命令

\`\`\`bash
# 安装依赖
npm install markview-vue

# 或使用 pnpm
pnpm add markview-vue
\`\`\`

## 数学公式

Markview Vue 使用 KaTeX 渲染数学公式。

### 行内公式

爱因斯坦的质能方程 $E = mc^2$ 是物理学中最著名的公式之一。

圆的面积公式为 $A = \\pi r^2$，周长为 $C = 2\\pi r$。

### 块级公式

欧拉公式：

$$
e^{i\\pi} + 1 = 0
$$

高斯分布（正态分布）的概率密度函数：

$$
f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}
$$

矩阵运算示例：

$$
\\begin{bmatrix}
a & b \\\\
c & d
\\end{bmatrix}
\\times
\\begin{bmatrix}
e & f \\\\
g & h
\\end{bmatrix}
=
\\begin{bmatrix}
ae+bg & af+bh \\\\
ce+dg & cf+dh
\\end{bmatrix}
$$

## 表格

### 基础表格

| 功能 | 描述 | 状态 |
|------|------|------|
| Markdown 渲染 | 支持标准 Markdown 语法 | ✅ |
| GFM 扩展 | 表格、任务列表、删除线等 | ✅ |
| 代码高亮 | 使用 Shiki 进行语法高亮 | ✅ |
| 数学公式 | 支持 KaTeX 渲染 LaTeX | ✅ |
| TOC 目录 | 自动提取标题生成目录 | ✅ |

### 对齐示例

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 文本 | 文本 | 文本 |
| 较长的文本内容 | 较长的文本内容 | 较长的文本内容 |
| 1 | 2 | 3 |

## 引用

> 这是一段引用文本。引用可以包含多个段落。
>
> 第二段引用内容，可以包含 **格式化文本** 和 \`代码\`。

### 嵌套引用

> 一级引用
>
> > 二级嵌套引用
> >
> > > 三级嵌套引用

## 链接与图片

### 链接

- [Markview Vue GitHub](https://github.com/advance-hub/markview-vue)
- [Vue.js 官网](https://vuejs.org/)
- [MDX 文档](https://mdxjs.com/)

### 图片

![Vue.js Logo](https://vuejs.org/images/logo.png)

## 分隔线

使用三个或更多连字符创建分隔线：

---

分隔线上面是一段内容，下面是另一段内容。

---

## 高级特性

### 脚注 (GFM)

这是一个带有脚注的句子[^1]。这里还有另一个脚注[^2]。

[^1]: 这是第一个脚注的内容。
[^2]: 这是第二个脚注，支持多行内容。

### 自动链接

直接输入 URL 会自动转换为链接：https://github.com

邮箱地址也会自动转换：contact@example.com

## 总结

Markview Vue 是一个功能强大的 Vue 3 Markdown/MDX 渲染组件，支持：

1. 完整的 Markdown 语法
2. GFM（GitHub Flavored Markdown）扩展
3. 使用 Shiki 的代码语法高亮
4. 使用 KaTeX 的数学公式渲染
5. 自动生成 TOC 目录
6. 深色模式支持
7. 可折叠标题
8. 回到顶部按钮

---

*感谢使用 Markview Vue！如有问题，欢迎在 GitHub 提交 Issue。*
`;

export const simpleMarkdown = `# 简单示例

这是一个简单的 Markdown 示例。

## 代码

\`\`\`javascript
console.log('Hello, Markview Vue!');
\`\`\`

## 列表

- 项目一
- 项目二
- 项目三
`;
