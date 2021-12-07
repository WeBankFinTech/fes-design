# WeDesign 组件库

## 标配

1. 支持基本的全局导入、按需导入。
2. 文档
3. 单元测试

## 规范

### 组件事件规范

### 样式规范

* 颜色分门归类，变量抽离，通过颜色函数控制衍生色，方便做 theme
* 字体：大小、行高、颜色
* 动画：过度、active、淡入淡出、缩放
* 阴影
* 萌层
* 边框
* z-index

#### class 命名规范

使用 [BEM](https://juejin.im/post/5b925e616fb9a05cdd2ce70d) 作为 class 的命名规范。
为了避免 class 名字过长，状态类使用 `is-` 作为前缀（避免和其他平台的状态类冲突）

#### 常见class关键词

布局类：header, footer, container, main, content, aside, page, section
包裹类：wrap, inner
区块类：region, block, box
结构类：hd, bd, ft, top, bottom, left, right, middle, col, row, grid, span
列表类：list, item, field
主次类：primary, secondary, sub, minor
大小类：s, m, l, xl, large, small
状态类：active, current, checked, hover, fail, success, warn, error, on, off
导航类：nav, prev, next, breadcrumb, forward, back, indicator, paging, first, last
交互类：tips, alert, modal, pop, panel, tabs, accordion, slide, scroll, overlay,
星级类：rate, star
分割类：group, seperate, divider
等分类：full, half, third, quarter
表格类：table, tr, td, cell, row
图片类：img, thumbnail, original, album, gallery
语言类：cn, en
论坛类：forum, bbs, topic, post
方向类：up, down, left, right
其他语义类：
    btn, close, ok, cancel, switch;
    link, title, info, intro, more, icon;
    form, label, search, contact, phone, date, email, user;
    view, loading, placeholder

### 组件规范

* 事称
  * click: 点击事件
  * change: 变更事件
  * blur: 失去焦点
  * focus: 获取焦点
  * clear: 清理事件
  * visible-change: 下拉框出现/隐藏时触发
  * remove-tag: 多选模式下移除单项
  * close: 关闭事件
* 变量名称
  * xxxRef、xxxValue
* 组件名称：wd-
* bem 前缀： wd-
  * 状态类直接使用 .[类名].[is-active | is-hover] 实现
* 内边距 ｜ 外边距
  * 普通输入框高度
    * 32px
  * 模块之间高度

备注:

事件名称前面不能带on，带on对使用 jsx 的用户不友好。

### 组件icon

* 统一用 svg icon
