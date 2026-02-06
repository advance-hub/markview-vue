# Markview Vue 技术演示文档

本文档全面展示 Markview Vue 渲染引擎的各项功能特性，包括基础 Markdown 语法、扩展功能、自定义组件集成等。

## 1. 自定义 Vue 组件集成

Markview Vue 基于 MDX 技术栈，原生支持在 Markdown 文档中嵌入 Vue 组件。组件通过 `components` 属性注册后，可在文档中直接使用。

### 1.1 按钮组件

按钮组件支持四种视觉样式，分别用于不同的交互场景：

<CustomButton text="Primary Button" type="primary" />
<CustomButton text="Secondary Button" type="secondary" />
<CustomButton text="Success Button" type="success" />
<CustomButton text="Danger Button" type="danger" />

### 1.2 响应式计数器

下方计数器组件展示了 Vue 响应式系统在 MDX 环境中的完整功能：

<Counter />

用户交互触发的状态变更会实时反映在视图层，无需额外配置。

### 1.3 徽章标记

徽章组件用于标注状态信息。示例：新增功能 <Badge text="NEW" type="success" />、实验性特性 <Badge text="Beta" type="warning" />、已废弃接口 <Badge text="Deprecated" type="danger" />、常规标签 <Badge text="Stable" type="info" />。

### 1.4 进度指示器

进度条组件支持动态百分比展示和状态着色：

<Progress percent={30} label="数据处理进度" status="normal" />

<Progress percent={60} label="文件上传进度" status="success" />

<Progress percent={85} label="磁盘使用率" status="warning" />

<Progress percent={95} label="内存占用率" status="danger" />

### 1.5 选项卡容器

选项卡组件实现了内容分组与切换功能：

<Tabs />

### 1.6 卡片布局

卡片组件提供了内容分组的视觉容器：

<Card title="技术架构">

本项目采用 **MDX** 作为编译引擎，**Shiki** 用于语法高亮，**KaTeX** 处理数学公式渲染。

核心特性包括：按需加载语言包、主题定制、暗色模式支持、无障碍优化等。

</Card>

<Card title="性能优化">

- 代码分割：动态 import 语言包，减少初始加载体积
- 虚拟滚动：大型文档支持高效渲染
- 缓存机制：编译结果缓存，避免重复计算
- Tree-shaking：仅打包使用的模块

</Card>

---

## 2. 自定义容器语法

Markview Vue 实现了 VitePress 兼容的容器语法，用于渲染具有语义化类型的提示信息块。

### 2.1 基础容器类型

提示类型容器，用于展示辅助性建议：

::: tip
本系统采用标准的 Markdown 语法，并扩展支持 GitHub Flavored Markdown 特性。建议使用语义化的文档结构以提升可读性。
:::

警告类型容器，用于强调注意事项：

::: warning
修改配置文件前请务必备份原始文件。错误的配置可能导致系统功能异常。
:::

危险类型容器，用于标识高风险操作：

::: danger
执行删除操作前请仔细确认。数据删除后无法恢复，可能造成不可逆的损失。
:::

信息类型容器，用于补充说明：

::: info
系统默认使用 UTF-8 编码。如需支持其他编码格式，请在配置文件中显式声明。
:::

### 2.2 自定义标题

容器支持自定义标题文本：

::: tip 最佳实践
建议将相关文档组织在同一目录下，使用清晰的命名规范。文档标题应简洁明了，避免使用过于技术化的术语。
:::

::: warning 版本兼容性
当前版本要求 Vue 3.3.0 或更高版本。低版本可能存在 API 不兼容问题。
:::

::: danger 安全提醒
生产环境部署前，务必移除所有调试代码和敏感信息。建议进行完整的安全审计。
:::

### 2.3 容器嵌套组件

容器内部可嵌入自定义 Vue 组件：

::: info 交互演示
点击按钮查看控制台输出：

<CustomButton text="触发事件" type="primary" />

组件事件会在浏览器控制台中记录详细信息。
:::

---

## 3. 文本格式化

### 3.1 内联格式

Markdown 支持多种内联文本格式：**粗体文本**（双星号）、*斜体文本*（单星号）、~~删除线文本~~（双波浪号）、`内联代码片段`（反引号）。

格式可以组合使用：***粗斜体组合***、**包含 `代码` 的粗体文本**。

### 3.2 段落与换行

段落之间使用空行分隔。  
行尾添加两个空格可实现软换行。

这是第一段内容，包含技术说明。段落结束后插入空行开始新段落。

这是第二段内容。Markdown 会自动处理段落间距和排版。

---

## 4. 标题层级系统

文档支持六级标题结构。目录组件（TOC）默认提取 H2-H4 级别的标题构建导航树。

### 4.1 三级标题示例

三级标题用于次级分组。此级别的标题会出现在默认的 TOC 导航中。

#### 4.1.1 四级标题示例

四级标题用于更细粒度的内容组织。这是 TOC 默认包含的最深层级。

##### 4.1.1.1 五级标题示例

五级标题用于极度细分的内容。默认不出现在 TOC 中，但可通过配置调整。

###### 4.1.1.1.1 六级标题示例

六级标题是 Markdown 支持的最深层级，通常用于非常具体的技术细节。

---

## 5. 列表结构

### 5.1 无序列表

无序列表用于项目顺序不重要的场景：

- 核心功能
  - MDX 编译引擎
  - Shiki 语法高亮
  - KaTeX 数学渲染
- 扩展功能
  - GFM 语法支持
  - 自定义容器
  - Vue 组件集成
- 开发工具
  - TypeScript 类型支持
  - HMR 热更新
  - Source Map

### 5.2 有序列表

有序列表用于需要明确顺序的内容：

1. 初始化项目环境
   1. 安装 Node.js 运行时
   2. 配置包管理器
   3. 克隆代码仓库
2. 安装项目依赖
   1. 执行 `pnpm install` 命令
   2. 等待依赖下载完成
   3. 验证安装结果
3. 启动开发服务器
   1. 运行 `pnpm dev` 命令
   2. 访问本地服务地址
   3. 验证功能正常

### 5.3 任务列表

任务列表用于项目管理和进度跟踪：

- [x] 实现基础 Markdown 渲染
- [x] 集成 Shiki 代码高亮引擎
- [x] 添加 KaTeX 数学公式支持
- [x] 实现 GFM 扩展功能
- [x] 开发自定义容器组件
- [x] 添加 Vue 组件支持
- [ ] 优化大文档渲染性能
- [ ] 实现虚拟滚动功能
- [ ] 添加更多主题选项
- [ ] 完善无障碍支持

### 5.4 定义列表

术语定义使用 HTML 语法：

<dl>
  <dt>MDX</dt>
  <dd>Markdown 扩展格式，支持在 Markdown 中嵌入 JSX 组件。</dd>
  
  <dt>Shiki</dt>
  <dd>基于 TextMate 语法的代码高亮引擎，与 VS Code 共享相同的高亮逻辑。</dd>
  
  <dt>KaTeX</dt>
  <dd>快速的数学公式渲染库，兼容 LaTeX 语法。</dd>
</dl>

---

## 6. 引用块

### 6.1 基础引用

引用块用于标记引用内容或重要说明：

> 良好的文档是项目成功的关键因素之一。文档应当简洁、准确、易于理解。
>
> 技术文档的核心价值在于降低知识传递成本，提升团队协作效率。

### 6.2 嵌套引用

引用块支持多层嵌套：

> 第一层引用：这是主要引用内容。
>
> > 第二层引用：这是对主要内容的补充说明。
> >
> > > 第三层引用：这是更深层次的注释信息。
> > >
> > > 嵌套深度理论上无限制，但建议控制在三层以内以保持可读性。

### 6.3 引用内容格式化

引用块内可使用完整的 Markdown 格式：

> **重要说明：** 本系统采用 *语义化版本* 管理方案。
>
> 版本号格式为 `MAJOR.MINOR.PATCH`：
>
> - `MAJOR`：不兼容的 API 变更
> - `MINOR`：向后兼容的功能新增
> - `PATCH`：向后兼容的问题修复
>
> 详见 [语义化版本规范](https://semver.org/lang/zh-CN/)。

---

## 7. 代码展示

### 7.1 行内代码

文档中使用 `console.log()` 输出调试信息，通过 `Array.prototype.map()` 方法遍历数组，调用 `async/await` 语法处理异步操作。

### 7.2 代码块

#### JavaScript 示例

```javascript
/**
 * 斐波那契数列实现（递归版本）
 * @param {number} n - 序列位置
 * @returns {number} 对应位置的数值
 */
function fibonacci(n) {
  // 基础情况：第 0 和第 1 项
  if (n <= 1) return n;
  
  // 递归计算
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 计算前 10 项
for (let i = 0; i < 10; i++) {
  console.log(`fibonacci(${i}) = ${fibonacci(i)}`);
}
```

#### TypeScript 示例

```typescript
/**
 * 用户数据接口定义
 */
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  metadata?: Record<string, any>;
}

/**
 * 用户服务类
 */
class UserService {
  private users: Map<number, User> = new Map();

  /**
   * 创建新用户
   */
  createUser(data: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      id: Date.now(),
      ...data,
      createdAt: new Date(),
    };
    
    this.users.set(user.id, user);
    return user;
  }

  /**
   * 根据 ID 查询用户
   */
  getUserById(id: number): User | undefined {
    return this.users.get(id);
  }

  /**
   * 更新用户信息
   */
  updateUser(id: number, updates: Partial<User>): User | null {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
}
```

#### Python 示例

```python
"""
快速排序算法实现
时间复杂度：平均 O(n log n)，最坏 O(n²)
空间复杂度：O(log n)
"""

def quick_sort(arr):
    """
    快速排序主函数
    
    Args:
        arr: 待排序数组
    
    Returns:
        排序后的数组
    """
    if len(arr) <= 1:
        return arr
    
    # 选择基准值（中间元素）
    pivot = arr[len(arr) // 2]
    
    # 分区操作
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    # 递归排序并合并
    return quick_sort(left) + middle + quick_sort(right)


# 测试用例
test_array = [3, 6, 8, 10, 1, 2, 1]
result = quick_sort(test_array)
print(f"原始数组: {test_array}")
print(f"排序结果: {result}")
```

#### Vue 组件示例

```vue
<!-- TodoList.vue - 待办事项组件 -->
<template>
  <div class="todo-list">
    <div class="todo-input">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="输入待办事项..."
        class="input"
      />
      <button @click="addTodo" class="btn-add">添加</button>
    </div>

    <ul class="todo-items">
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="{ completed: todo.done }"
        class="todo-item"
      >
        <input
          type="checkbox"
          v-model="todo.done"
          class="checkbox"
        />
        <span class="text">{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)" class="btn-remove">删除</button>
      </li>
    </ul>

    <div class="todo-stats">
      总计 {{ todos.length }} 项，已完成 {{ completedCount }} 项
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

const newTodo = ref('')
const todos = ref<Todo[]>([
  { id: 1, text: '学习 Vue 3 Composition API', done: true },
  { id: 2, text: '掌握 TypeScript 类型系统', done: false },
  { id: 3, text: '深入理解 Vite 构建工具', done: false },
])

const completedCount = computed(() => 
  todos.value.filter(t => t.done).length
)

function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      done: false,
    })
    newTodo.value = ''
  }
}

function removeTodo(id: number) {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<style scoped>
.todo-list { padding: 16px; }
.todo-input { display: flex; gap: 8px; margin-bottom: 16px; }
.input { flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; }
.btn-add { padding: 8px 16px; background: #0064fa; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.todo-items { list-style: none; padding: 0; }
.todo-item { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid #f3f4f6; }
.todo-item.completed .text { text-decoration: line-through; color: #9ca3af; }
.checkbox { width: 16px; height: 16px; }
.text { flex: 1; }
.btn-remove { padding: 4px 8px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 4px; cursor: pointer; font-size: 12px; }
.todo-stats { margin-top: 16px; color: #6b7280; font-size: 14px; }
</style>
```

#### SQL 查询示例

```sql
-- 用户数据查询与统计
SELECT 
  u.id,
  u.username,
  u.email,
  COUNT(o.id) AS order_count,
  SUM(o.amount) AS total_amount,
  MAX(o.created_at) AS last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND u.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
GROUP BY u.id, u.username, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_amount DESC
LIMIT 100;

-- 创建索引以优化查询性能
CREATE INDEX idx_orders_user_created 
ON orders(user_id, created_at);
```

#### Go 语言示例

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

// Worker 工作者接口
type Worker interface {
	Process(data interface{}) error
}

// WorkerPool 工作池实现
type WorkerPool struct {
	workers   int
	taskQueue chan Task
	wg        sync.WaitGroup
	mu        sync.Mutex
}

// Task 任务定义
type Task struct {
	ID   int
	Data interface{}
}

// NewWorkerPool 创建工作池
func NewWorkerPool(workers int) *WorkerPool {
	return &WorkerPool{
		workers:   workers,
		taskQueue: make(chan Task, 100),
	}
}

// Start 启动工作池
func (p *WorkerPool) Start() {
	for i := 0; i < p.workers; i++ {
		p.wg.Add(1)
		go p.worker(i)
	}
}

// worker 工作协程
func (p *WorkerPool) worker(id int) {
	defer p.wg.Done()
	
	for task := range p.taskQueue {
		fmt.Printf("Worker %d processing task %d\n", id, task.ID)
		time.Sleep(time.Millisecond * 100) // 模拟处理时间
	}
}

// Submit 提交任务
func (p *WorkerPool) Submit(task Task) {
	p.taskQueue <- task
}

// Shutdown 关闭工作池
func (p *WorkerPool) Shutdown() {
	close(p.taskQueue)
	p.wg.Wait()
}
```

---

## 8. 表格展示

### 8.1 基础表格

表格用于结构化数据展示：

| 组件名称 | 功能描述 | 开发状态 | 优先级 |
|----------|----------|----------|--------|
| MarkdownRender | 核心渲染引擎 | 已完成 | 高 |
| Container | 自定义容器 | 已完成 | 高 |
| CodeBlock | 代码高亮 | 已完成 | 高 |
| Table | 表格组件 | 已完成 | 中 |
| Toc | 目录导航 | 已完成 | 中 |
| ImagePreview | 图片预览 | 已完成 | 低 |

### 8.2 对齐方式

表格支持左对齐、居中对齐、右对齐：

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 文本内容 | 居中显示 | 数值 |
| Implementation | Centered | 99.9% |
| Description | Aligned | 1,234.56 |

### 8.3 复杂表格

包含多种数据类型的复杂表格：

| API 端点 | 方法 | 参数 | 响应格式 | 状态 |
|---------|:----:|------|---------|:----:|
| `/api/users` | GET | `page`, `limit` | JSON | 稳定 |
| `/api/users/:id` | GET | `id` | JSON | 稳定 |
| `/api/users` | POST | `User` 对象 | JSON | 稳定 |
| `/api/users/:id` | PUT | `id`, `User` 对象 | JSON | 稳定 |
| `/api/users/:id` | DELETE | `id` | 状态码 | 稳定 |

### 8.4 表格内格式化

| 特性 | 说明 | 示例 |
|------|------|------|
| **粗体** | 强调关键词 | **重要** |
| *斜体* | 术语标注 | *参数* |
| `代码` | 代码片段 | `const x = 1` |
| [链接](#) | 外部引用 | [文档](https://example.com) |

---

## 9. 数学公式

### 9.1 行内公式

行内公式用于段落中的数学表达式。例如：勾股定理 $a^2 + b^2 = c^2$，欧拉公式 $e^{i\pi} + 1 = 0$，二次方程求根公式 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$。

### 9.2 块级公式

块级公式用于独立展示复杂的数学表达式。

**高斯积分：**

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

**泰勒级数展开：**

$$
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots
$$

**矩阵运算：**

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\begin{bmatrix}
x \\
y
\end{bmatrix}
=
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$

**拉马努金恒等式：**

$$
\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } }
$$

**麦克斯韦方程组：**

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

---

## 10. 链接与图片

### 10.1 链接类型

**行内链接：** [GitHub 仓库](https://github.com)  
**带标题的链接：** [官方文档](https://github.com "访问 GitHub")  
**自动链接：** https://github.com  
**邮箱链接：** [contact@example.com](mailto:contact@example.com)

### 10.2 引用式链接

引用式链接将链接定义与使用分离，提升文档可维护性。

参考 [MDX 官方文档][mdx]、[Shiki 语法高亮][shiki]、[KaTeX 数学渲染][katex]。

[mdx]: https://mdxjs.com/
[shiki]: https://shiki.style/
[katex]: https://katex.org/

### 10.3 图片

图片支持本地和远程资源：

![示例图片](https://via.placeholder.com/600x300/0064FA/FFFFFF?text=Markview+Vue)

---

## 11. 分隔线

分隔线用于区分不同主题的内容区块。

***

支持三种分隔线语法：

---

三个星号、三个减号或三个下划线均可。

___

---

## 12. 水平规则与特殊格式

### 12.1 HTML 嵌入

Markdown 支持嵌入 HTML 标签：

<div style="padding: 16px; background: #f0f9ff; border-left: 4px solid #0064fa; border-radius: 4px;">
  <strong>注意：</strong>HTML 标签与 Markdown 语法可以混用，但需注意语法兼容性。
</div>

### 12.2 转义字符

使用反斜杠转义特殊字符：\*非斜体\*、\`非代码\`、\[非链接\]。

### 12.3 脚注

文档支持脚注功能[^1]。脚注提供额外的补充说明[^2]，不干扰正文阅读流程[^3]。

[^1]: 这是第一个脚注的内容，可以包含详细的解释说明。
[^2]: 脚注支持多段落内容和格式化文本。
[^3]: 脚注会自动编号并在文档底部汇总显示。

---

## 13. GFM 扩展功能

### 13.1 自动链接

GitHub Flavored Markdown 自动识别 URL：www.github.com 会自动转换为链接。

### 13.2 删除线

使用双波浪号标记 ~~已废弃的内容~~。

### 13.3 表情符号

支持 GitHub 风格的表情符号（需启用相应插件）。

---

## 14. 高级特性

### 14.1 嵌套组件

组件可以嵌套在容器中使用：

::: tip 实践建议
开发环境配置完成后，建议先测试基础功能：

<CustomButton text="运行测试" type="success" />

确保所有依赖正确安装且版本兼容。
:::

### 14.2 组件与 Markdown 混排

<Card title="功能模块">

系统核心模块包括：

1. **渲染引擎** - 基于 MDX 的编译系统
2. **语法高亮** - Shiki 代码着色引擎
3. **公式渲染** - KaTeX 数学公式支持

点击查看详情：

<CustomButton text="查看架构文档" type="primary" />

</Card>

---

## 15. 性能指标

### 15.1 渲染性能

<Progress percent={95} label="首次渲染性能" status="success" />

<Progress percent={88} label="热更新性能" status="success" />

<Progress percent={72} label="大文档处理" status="warning" />

### 15.2 包体积

<Progress percent={45} label="核心库体积" status="normal" />

<Progress percent={30} label="按需加载优化" status="success" />

---

## 16. 技术规范

### 16.1 代码规范

代码应遵循以下规范：

- 使用 TypeScript 提供类型安全
- 遵循 ESLint 配置的编码风格
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 使用 `<script setup>` 语法

### 16.2 文档规范

技术文档编写建议：

1. 使用清晰的标题层级
2. 提供完整的代码示例
3. 包含必要的注释说明
4. 添加类型定义和接口文档
5. 说明边界情况和注意事项

### 16.3 版本管理

项目采用语义化版本控制：

- **主版本号（MAJOR）**：不兼容的 API 变更
- **次版本号（MINOR）**：向后兼容的功能新增
- **修订号（PATCH）**：向后兼容的问题修复

---

## 17. 总结

Markview Vue 提供了完整的 Markdown 渲染解决方案，特性包括：

1. **标准 Markdown 支持** - 完整实现 CommonMark 规范
2. **GFM 扩展** - 表格、任务列表、删除线等
3. **代码高亮** - Shiki 引擎，支持 100+ 语言
4. **数学公式** - KaTeX 渲染，LaTeX 语法
5. **自定义容器** - Semi Design 风格的提示框
6. **Vue 组件** - 完整的组件系统支持
7. **响应式交互** - 实时状态管理
8. **主题定制** - 亮色/暗色模式切换
9. **目录导航** - 自动提取标题生成 TOC
10. **无障碍优化** - ARIA 标准支持

项目采用现代化技术栈，注重性能优化和开发体验，适用于技术文档、博客系统、知识库等场景。

---

**文档版本：** v0.1.3  
**最后更新：** 2026-02-06  
**维护者：** Markview Vue Team
