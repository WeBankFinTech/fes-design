# PLAN: 修复 Tabs 切换时内容高度抖动 (#820)

## 问题

`layout: inline` 的文档流中，切换 tab 的过渡期间**新旧两个 `.fes-tabs-tab-pane` 同时占据流内空间**：

- `common.vue` demo 实测：切换到"卫衣"后 wrapper 高度序列 60 → 120 → 120 → 60
  （旧 pane 离场动画进行中仍占流空间，与入场 pane 叠加）

## 根因

`components/tabs/style/index.less` 中 `.fes-tabs-tab-pane` 仅设置了
`display: inline-block; width: 100%;`，没有绝对定位；TransitionGroup
不隔离流内布局。leave 动画（`slide-fade-leave-active`, duration
@animation-duration-fast）期间两个 pane 纵向堆叠 → 容器高度瞬时翻倍。

## 修复方案（纯 CSS）

将 `.fes-tabs-tab-pane` 脱离文档流（stacking 上下文由 wrapper 的
`overflow: hidden` 保证不泄漏）：

```less
&-tab-pane {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    display: inline-block;
    width: 100%;
}
```

同时 wrapper 需要 `position: relative` 作为包含块：

```less
&-tab-pane-wrapper {
    position: relative;   /* 新增 */
    flex: 1;
    overflow: hidden;
}
```

### 风险与对策

| 风险 | 对策 |
|---|---|
| wrapper 高度塌陷（pane 不再撑开高度） | 高度自适应场景是此修复的主要 UX 回归风险。评估：Vue TransitionGroup + absolute pane 是 antd/element-plus 同类组件通行做法；wrapper 高度将由最高 pane 决定（见下一节） |
| wrapper 无高度 → 内容不可见 | 若 pane 均为 absolute，wrapper 高度为 0。需验证：实际只有**活动** pane 在流内（`displayDirective: 'if'`），或所有已挂载 pane 都 absolute 后 wrapper 高度 = max(pane 高度)？——absolute 不撑高。 |

### 关键设计决策

absolute 方案会导致 wrapper 高度塌陷，**不可行**。

**可行方案 B：leave 期间仅旧 pane absolute**
利用 Vue Transition 的 CSS 类钩子：在 `*-leave-active` 状态下对 pane
设 `position: absolute`（仅离场元素）：

```less
&-slide-fade-leave-active {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    transition: all @animation-duration-fast @ease-base-out;
}
```

- 入场 pane 保持流内，撑开 wrapper 高度 → 无塌陷
- 离场 pane absolute，不参与布局 → 无高度叠加
- transform: translateX(100%) 仍以自身宽度为参照，动画视觉不变
- 若 `transition` prop 为 false/自定义名，则无 leave-active 类 → 保持旧行为（无动画本来也无抖动叠加问题）

## 实施步骤

1. ✅ 复现：`/tmp/tabs-repro.cjs` 测量 wrapper 高度序列（60→120→120→60）
2. 修改 `components/tabs/style/index.less`：`-slide-fade-leave-active` 加 `position: absolute; inset-block-start: 0; inset-inline-start: 0;`
3. **红验证**：修复前跑新 e2e（高度翻转断言失败）
4. **绿验证**：修复后同 e2e 通过（高度变化 ≤1px 或单调）
5. 单测：jsdom 无法测布局，改为断言 `transition` prop 关闭时无 slide-fade 类（既有行为守护）
6. 全量单测 + eslint
7. 提交 `fix(tabs): ...`，报告至 `.automation-tasks/report-2026-09-10-fix-820-tabs-jitter.md`

## 验收标准

- 切换 tab 时 `.fes-tabs-tab-pane-wrapper` 高度无瞬时翻倍（变化幅度 ≤ 2px 或仅为目标内容高度单调过渡）
- 既有 tabs 单测/e2e 全部通过
- `transition=false` 行为不变
