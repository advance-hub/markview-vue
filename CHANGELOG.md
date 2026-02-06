# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2026-02-06

### Added

- 自定义容器语法支持（VitePress 兼容）
  - 支持 `tip`, `warning`, `danger`, `info` 四种类型
  - 采用 Semi Design 官方视觉风格
  - 支持自定义标题
  - 完整的暗色主题适配
- MDX 自定义组件支持
  - 通过 `components` prop 注册 Vue 组件
  - 支持在 Markdown 中直接使用组件
  - 支持组件嵌套和 props 传递
- 开发环境优化
  - 新增 `dev/` 开发目录
  - 实时热更新支持
  - 独立的开发服务器（端口 3002）
- 文档完善
  - 新增 `CUSTOM_COMPONENTS.md` - 自定义组件指南
  - 新增 `DEVELOPMENT.md` - 开发者指南
  - 更新 `README.md` - 完整的 API 文档

### Changed

- Container 组件重构
  - 从 render function 改为 template 语法
  - 修复 Vue slot 警告问题
  - 优化样式为 Semi Design 标准风格
- 容器语法处理优化
  - 移除正则表达式依赖
  - 使用简单字符串处理提升性能
  - 增强错误处理和调试信息

### Fixed

- 修复 Container 组件 TypeScript 类型错误
- 修复 Icon 组件类型不匹配问题
- 修复 MDX 中邮箱链接解析错误

## [0.1.2] - 2024-01-15

### Added

- TOC 目录导航功能
  - 自动提取标题
  - 滚动高亮
  - 点击跳转
- 回到顶部按钮
- 图片预览功能

### Changed

- 优化代码块复制功能
- 改进表格样式

## [0.1.1] - 2024-01-10

### Added

- 暗色主题支持
- 代码块一键复制

### Fixed

- 修复大文档渲染性能问题
- 修复数学公式显示异常

## [0.1.0] - 2024-01-01

### Added

- 初始版本发布
- 基础 Markdown 渲染
- Shiki 代码高亮
- KaTeX 数学公式
- GFM 扩展支持
- 基础样式系统

---

## 版本规范说明

版本号格式：`MAJOR.MINOR.PATCH`

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向后兼容的功能新增
- **PATCH**：向后兼容的问题修复

## 计划中的功能

### v0.2.0
- [ ] 虚拟滚动支持（大文档优化）
- [ ] 更多代码主题选项
- [ ] 自定义容器插件 API
- [ ] 服务端渲染（SSR）支持

### v0.3.0
- [ ] Markdown 编辑器模式
- [ ] 实时预览功能
- [ ] 协同编辑支持

### v1.0.0
- [ ] API 稳定版本
- [ ] 完整的测试覆盖
- [ ] 性能基准测试
- [ ] 多语言文档

---

**注：** 0.x 版本 API 可能发生变更，1.0 版本后保证向后兼容。
