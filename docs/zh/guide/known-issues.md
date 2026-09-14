# 测试已知问题


本页记录单测过程中发现的组件库 bug 与 API 设计问题，供使用者和后续修复参考。
来源：`test/add-coverage` 分支属性级单测编写过程（#AI commit# 提交系列）。
所有问题已在 GitHub issue 跟踪。

## Bug（功能缺陷）

### time-picker `isRange` 是未实现的死属性（[#1022](https://github.com/WeBankFinTech/fes-design/issues/1022)）

- **现象**：props 声明了 `isRange`，`displayValue` 有对应分支，但模板只有 `v-if="!isRange"` 的单值输入，无任何 range 分支渲染；开启 `isRange` 后连输入框都不渲染（组件不可见），且无告警。`modelValue` 类型仅支持 String（关联：TimeSelect 传数组直接崩溃 [#1023](https://github.com/WeBankFinTech/fes-design/issues/1023)）。
- **复现**：`<TimePicker isRange :modelValue="['09:00:00','18:00:00']" />`。
- **建议**：实现范围选择，或先在类型上移除 `isRange` 并对开启时给出告警。

### time-select `modelValue` 传数组直接崩溃（[#1023](https://github.com/WeBankFinTech/fes-design/issues/1023)）

- **现象**：`modelValue` 类型仅支持 String，运行时无拦截，`time-select.vue` 中 `props.modelValue.split(':')` 对数组值直接抛 `props.modelValue.split is not a function`，挂载即白屏。
- **复现**：`<TimeSelect :modelValue="['09:00:00','18:00:00']" />`。
- **建议**：运行时对非法类型告警并按空值处理。

### tabs 只配 `name` 的 TabPane 关闭时 `close` 事件 payload 为 null（[#1024](https://github.com/WeBankFinTech/fes-design/issues/1024)）

- **现象**：tab 身份标识用 `props.value`，`name` 仅作显示回退。TabPane 只传 `name` 时点关闭按钮，`close` 事件收到 `null`（已实测 `[[null]]`），父组件无法得知关闭的是哪个 tab，且无任何告警。
- **复现**：`<TabPane name="t1" />` + card + `closable`，点击关闭，`@close` 收到 `null`。
- **建议**：`value` 缺省时回退到 `name`，或开发模式下校验并告警。

## API 设计问题（可用但易踩坑）

### tabs 的 `closable`/`addable` 在非 card 类型下静默失效（[#1025](https://github.com/WeBankFinTech/fes-design/issues/1025)）

`mergeClosable` 与 addable 按钮渲染都 gate 在 `isCard`，默认线性 tabs 传这两个 prop 完全无反应、无 warning。建议：非 card 下告警或文档显著标注。

### popper 的 `onlyShowTrigger` 名不符实（[#1026](https://github.com/WeBankFinTech/fes-design/issues/1026)）

名字像"只渲染触发器"，实际语义是"popper 显示之后不再隐藏"（`hide()` 直接 return）。建议改名 `keepVisible`/`persistent` 或补充文档。

### layout 子组件对 `embedded` 的支持不一致（[#1027](https://github.com/WeBankFinTech/fes-design/issues/1027)）

`main`/`footer` 消费 `embedded`（渲染 `is-embedded` 背景色），`aside`/`header` 既无该 prop 也不消费注入值。布局深浅色切换时会出现只有部分区域变背景的情况。

### drawer 的 `width`/`height` 已废弃但仍在 props 中

运行时靠 `console.warn` 提示改用 `dimension`。过渡期设计，迁移追踪见 [#570](https://github.com/WeBankFinTech/fes-design/issues/570)，注意下个大版本会移除。

## 测试过程发现的其他缺陷（第二轮覆盖率攻坚，2026-09）

- [#1017](https://github.com/WeBankFinTech/fes-design/issues/1017) FMenu 默认插槽内容不渲染，容器为空（现有插槽式 menu 测试均为空断言）
- [#1018](https://github.com/WeBankFinTech/fes-design/issues/1018) FMenu 同时配置 options 与 defaultExpandAll 时 FSubMenu 无限递归更新崩溃
- [#1019](https://github.com/WeBankFinTech/fes-design/issues/1019) TextHighlight 子节点为「组件 + 默认插槽返回单个 VNode」时渲染崩溃
- [#1020](https://github.com/WeBankFinTech/fes-design/issues/1020) useTreeNode isInline 中父级叶子遍历存在不可达死分支
- [#1021](https://github.com/WeBankFinTech/fes-design/issues/1021) Table 的 scrollbarRef 卸载时不置空，滚动状态重置逻辑永不触发
