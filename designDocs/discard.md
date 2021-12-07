# 组件开发

技术栈

vue3 + storybook + ts + 构建（？）

构建需要调研下用 webpack ？ rollup ? storybook 插件？

## 项目规范

### 目录结构

```
- components
    - ComponentName
        - index.ts (附带 install 能力)
        - ComponentName.stories.ts
        - ComponentName.vue
        - style (管理该组件样式)
    - _util 工具函数
    - style 公共样式
    - locales 国际化
- scripts
    - addComponent.js 新建组件
```

### 组件规范

组件名称：统一大驼峰
css: 使用 less
icon: svg 按需引入
风格：参照 WeDesign 设计
组件：.vue ? .jsx(可能 .vue 好一点，jsx 时刻要记得写 .value，习惯了也还好)

#### 组件设计

* 渐进增强：在保证基础功能和可扩展性前提下，尽量往简单的做，避免过渡设计
* 功能累加：原则上只允许增加，不允许删减，以免影响先有功能
* 粒度把握：组件粒度要把控好，不可过粗，也不可过细，保持组件的内聚性（在这个前提下可冗余部分代码）
* 无副作用：尽量为展示型组件，不可对 props 上的数据进行修改，不可修改父组件数据

### 命名规范

* 事件名称：统一 on 开头
  * onClick: 点击事件
  * onChange: 变更事件
  * onBlur: 失去焦点
  * onFocus: 获取焦点
  * onClear: 清理事件
  * onVisibleChange: 下拉框出现/隐藏时触发
  * onRemoveTag: 多选模式下移除单项
  * onClose: 关闭事件
* 变量名称
  * xxxRef、xxxValue

## 构建

### 开发模式

    * storybook 开发
      * 开发写demo，需要严谨，往能落到文档和测试的方向靠
    * storybook 文档(? mdx or docs)

### 测试模式

    * storybook 测试
    * 测试案例原则：关注“输入”“输出”，保证对应的props输入，有预期的结果。不必过分纠结覆盖率。

### 发布模式

    * docs: 生成组件库文档
    * release:
        * 支持按需引入
        * 支持全局引入（全局引入在 dev 模式下，会有 warning 警告）
        * 三种构建输出：dist/lib/es

## 废弃想法

* 通过md的方式，在开发页面即文档
  * storybook 可以将 开发、文档、测试融合在一起，更好