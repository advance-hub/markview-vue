# Markview Vue 功能演示


这是一个完整的 **Markview Vue** 组件功能演示，展示了 Markdown 渲染器支持的各种特性。

## 基础文本格式

Markdown 支持多种文本格式化方式：

- **粗体文本** 使用双星号
- *斜体文本* 使用单星号
- ~~删除线~~ 使用双波浪号
- `行内代码` 使用反引号
- ==高亮文本== 使用双等号（需要扩展支持）

还可以组合使用，如 ***粗斜体*** 或 **带有 `代码` 的粗体**。

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
- 橙子
  - 脐橙
  - 血橙
  - 柑橘

### 有序列表

1. 第一步：准备材料
2. 第二步：开始制作
3. 第三步：检查成果
   1. 质量检验
   2. 功能测试

### 任务列表

- [x] 完成基础功能
- [x] 添加代码高亮
- [x] 实现 TOC 导航
- [ ] 添加更多主题
- [ ] 性能优化

## 引用块

> 这是一个简单的引用块。
>
> 引用块可以包含多个段落，以及 **格式化文本**。

> 引用块支持嵌套：
>
> > 这是第二层引用
> >
> > > 这是第三层引用，可以无限嵌套

## 代码展示

### 行内代码

使用 `console.log()` 输出信息，或者调用 `Array.prototype.map()` 方法。

### 代码块

```javascript
// JavaScript 示例
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

```typescript
// TypeScript 示例
interface User {
  id: number;
  name: string;
  email?: string;
}

const createUser = (name: string): User => ({
  id: Date.now(),
  name,
});
```

```python
# Python 示例
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))
```

```vue
<!-- Vue 组件示例 -->
<template>
  <div class="counter">
    <button @click="count--">-</button>
    <span>{{ count }}</span>
    <button @click="count++">+</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<style scoped>
.counter {
  display: flex;
  gap: 1rem;
}
</style>
```

## 表格展示

### 基础表格

| 姓名 | 年龄 | 职业 |
|------|------|------|
| 张三 | 28 | 工程师 |
| 李四 | 32 | 设计师 |
| 王五 | 25 | 产品经理 |

### 对齐表格

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容A | 内容B | 内容C |
| 长一点的内容 | 短 | 123456 |

### 复杂表格

| 功能 | 状态 | 优先级 | 负责人 |
|------|:----:|:------:|--------|
| 代码高亮 | ✅ | 高 | 张三 |
| 数学公式 | ✅ | 中 | 李四 |
| 图片预览 | ✅ | 低 | 王五 |
| 暗黑模式 | ✅ | 高 | 张三 |

## 数学公式

### 行内公式

当 $a \ne 0$ 时，方程 $ax^2 + bx + c = 0$ 的解为 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$。

### 块级公式

$$
\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } }
$$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 自定义容器

Markview Vue 支持 VitePress 风格的自定义容器语法，用于展示不同类型的提示信息。

::: tip
这是一个提示框，使用 `::: tip` 语法。提示框通常用于展示有用的建议或小技巧。
:::

::: warning
这是一个警告框，使用 `::: warning` 语法。警告框用于提醒用户注意某些重要事项。
:::

::: danger
这是一个危险提示框，使用 `::: danger` 语法。用于标记可能导致问题的操作或配置。
:::

::: info
这是一个信息框，使用 `::: info` 语法。用于展示一般性的补充信息。
:::

### 自定义标题

::: tip 小贴士
你可以在容器类型后面添加自定义标题，如 `::: tip 小贴士`。
:::

::: danger 请勿执行
这个操作可能会导致数据丢失，请确保已经备份。
:::

## 链接与图片

### 链接

这是一个 [普通链接](https://github.com)。

这是一个 [带标题的链接](https://github.com "GitHub 主页")。

自动链接：https://github.com

### 图片

![示例图片](https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=Markview+Vue)

## 分隔线

上面是内容。

---

下面是内容。

***

分隔线可以用不同的符号。

## 总结

Markview Vue 提供了：

1. **完整的 Markdown 支持** - 基于 MDX 编译
2. **美观的代码高亮** - Shiki 引擎，VS Code 同款
3. **数学公式渲染** - KaTeX 支持
4. **GFM 扩展** - 表格、任务列表、删除线等
5. **TOC 导航** - 自动提取标题，滚动高亮
6. **自定义容器** - VitePress 风格的提示框
7. **主题切换** - 亮色/暗色模式
8. **图片预览** - 点击放大查看

开始使用：

```bash
npm install markview-vue
```

```vue
<script setup>
import { MarkdownRender } from 'markview-vue'
import 'markview-vue/style.css'
</script>

<template>
  <MarkdownRender :raw="content" />
</template>
```
