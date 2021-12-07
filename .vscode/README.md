[TOC]

## VSCode

### 1. 扩展安装

> 以下为项目初始化必须要安装的扩展，若有冲突的扩展项，请当前工作区进行禁用。

#### 1.1 代码规范相关

1. `ESLint` # Eslint 文件格式化
2. `Pretier - Code formatter` #md 文件格式化

#### 1.2 开发体验相关

1. `Git History`
2. `Git History Diff`
3. `vscode-icons` #文件显示图标，开发体验优化用到
4. `TODO Highlight` #TODO 高亮展示
5. `Todo Tree` #显示待办任务列表
6. `SVG` #svg 图标文件预览

### 2. 更多

> 以下为可选安装配置项

1. `json`文件查看和编辑默认不支持注释，右下角可切换`Select Language Mode`，可切换为`JSON with Comments`。
2. `markdown`文件导出`PDF`或者`WORD`，可安装`Markdown Preview Enhanced`扩展。

-   官方文档：https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/pdf
-   导出`PDF`，推荐使用`Chrome (Puppeteer)`来导出。
    -   操作步骤：https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/pdf
-   导出`WORD`，推荐使用`Pandoc`来导出。
    -   环境要求：需要先安装`Pandoc`应用：https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/pandoc
    -   操作步骤：
        -   1.`markdown`文件增加`front-matter`声明：https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/pandoc-pdf
        -   2.`markdown`文件单击右键，选中`Markdown Preview Enhanced`，右侧预览文件，单击右键，选中`Pandoc`

### 3. 常见问题

1. `tsconfig.json` 配置文件有警告信息：

```
Problems loading reference 'https://json.schemastore.org/tsconfig': Unable to load schema from 'https://json.schemastore.org/tsconfig': Request vscode/content failed
```

**原因：**

`vscode` 在加载 `tsconfig.json` 文件时会向 `https://json.schemastore.org/tsconfig` 发送请求，由于本机的同源策略安全设置，不允许跨域访问资源，所有会将该请求的响应数据拦截。

**解决办法：**

在用户设置中，找到 `vscode` 中的代理服务器配置：Proxy-Authoriazation 配置项，点击`在 setting.json 中编辑`，然后在 settings.json 中加入该配置字段：

```json
{
    "http.proxyAuthorization": "false"
}
```

### 4. 常用快捷键

1. 多行编辑（列编辑模式）

-   鼠标点击，光标移至某个地方；
-   option + commond，同时按 ↓ 键，上下移动使得光标覆盖多行即可。
