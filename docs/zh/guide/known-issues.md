# 测试已知问题


本页记录单测过程中发现的组件库 bug 与 API 设计问题，供使用者和后续修复参考。
来源：`test/add-coverage` 分支属性级单测编写过程（#AI commit# 提交系列）。

## Bug（功能缺陷）

### time-picker `isRange` 是未实现的死属性

- **现象**：props 声明了 `isRange`，`displayValue` 有对应分支，但模板只有 `v-if="!isRange"` 的单值输入，无任何 range 分支渲染；`modelValue` 类型仅支持 String，传数组直接抛 `props.modelValue.split is not a function`。
- **复现**：`<TimePicker isRange :modelValue="['09:00:00','18:00:00']" />`。
- **建议**：实现范围选择，或先在类型上移除 `isRange` 并对数组值给出告警。

### tabs 只配 `name` 的 TabPane 关闭时 `close` 事件 payload 为 null

- **现象**：tab 身份标识用 `props.value`，`name` 仅作显示回退。TabPane 只传 `name` 时点关闭按钮，`close` 事件收到 `null`，父组件无法得知关闭的是哪个 tab，且无任何告警。
- **复现**：`<TabPane name="t1" />` + `closable`，点击关闭，`@close` 收到 `null`。
- **建议**：`value` 缺省时回退到 `name`，或开发模式下校验并告警。

## API 设计问题（可用但易踩坑）

### tabs 的 `closable`/`addable` 在非 card 类型下静默失效

`mergeClosable` 与 addable 按钮渲染都 gate 在 `isCard`，默认线性 tabs 传这两个 prop 完全无反应、无 warning。建议：非 card 下告警或文档显著标注。

### popper 的 `onlyShowTrigger` 名不符实

名字像"只渲染触发器"，实际语义是"popper 显示之后不再隐藏"（`hide()` 直接 return）。建议改名 `keepVisible`/`persistent` 或补充文档。

### layout 子组件对 `embedded` 的支持不一致

`main`/`footer` 消费 `embedded`（渲染 `is-embedded` 背景色），`aside`/`header` 既无该 prop 也不消费注入值。布局深浅色切换时会出现只有部分区域变背景的情况。

### drawer 的 `width`/`height` 已废弃但仍在 props 中

运行时靠 `console.warn` 提示改用 `dimension`。过渡期设计，注意下个大版本会移除。
