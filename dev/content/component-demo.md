# MDX 自定义组件完整指南

## 方式 1：使用预注册的 Vue 组件

通过 `components` prop 传入的组件可以直接在 Markdown 中使用：

<CustomButton text="主要按钮" />

<CustomButton text="次要按钮" type="secondary" />

<CustomButton text="危险按钮" type="danger" />

## 方式 2：在 MDX 中直接定义 JSX 组件

export const Alert = ({ type = 'info', children }) => (
  <div style={{
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    background: type === 'success' ? '#f0fdf4' : 
                type === 'warning' ? '#fffbeb' :
                type === 'error' ? '#fef2f2' : '#eff6ff',
    border: '1px solid',
    borderColor: type === 'success' ? '#86efac' :
                 type === 'warning' ? '#fde68a' :
                 type === 'error' ? '#fecaca' : '#bfdbfe',
    color: '#1f2937'
  }}>
    {children}
  </div>
);

使用刚定义的组件：

<Alert type="success">
这是一个成功提示！
</Alert>

<Alert type="warning">
这是一个警告提示！
</Alert>

<Alert type="error">
这是一个错误提示！
</Alert>

## 方式 3：定义 Vue 响应式组件

export const Counter = () => {
  // 注意：这里不能直接用 ref，需要用 JSX 渲染函数
  return {
    data() {
      return { count: 0 };
    },
    render() {
      return (
        <div style={{ 
          padding: '16px', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>
            {this.count}
          </div>
          <button 
            onClick={() => this.count--}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              background: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            -
          </button>
          <button 
            onClick={() => this.count++}
            style={{
              padding: '8px 16px',
              background: '#0064fa',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            +
          </button>
        </div>
      );
    }
  };
};

看，这是一个可交互的计数器：

<Counter />

## 方式 4：组合使用

可以在容器中嵌套组件：

::: tip 交互示例
点击下面的按钮试试：

<CustomButton text="容器内的按钮" />
:::

## 总结

Markview Vue 基于 MDX，支持：

1. ✅ **预注册组件** - 通过 `components` prop
2. ✅ **JSX 组件** - 直接在 MDX 中用 `export const`
3. ✅ **完整 Vue 功能** - 响应式、事件、生命周期
4. ✅ **组件嵌套** - 组件可以嵌套在容器等其他组件中

**比 VitePress 更灵活！** VitePress 只能用预定义的组件，MDX 可以即写即用。
