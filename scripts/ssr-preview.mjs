/**
 * SSR 演示页生成器（UI 效果验证用，非测试资产）：
 * 1. vite SSR 模式加载组件源码并 renderToString（无任何 DOM 全局）
 * 2. less 编译所有涉及组件的样式为一份 CSS
 * 3. 输出自包含 HTML（内联 CSS，无任何客户端 JS——纯服务端渲染产物）
 *
 * 用法：node ssr-preview.mjs [out.html]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outFile = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(root, 'ssr-preview.html');

const modPath = (p) => pathToFileURL(path.join(root, 'node_modules', p)).href;
const { createServer } = await import(modPath('vite/dist/node/index.js'));
const vuePlugin = (await import(modPath('@vitejs/plugin-vue/dist/index.mjs'))).default;
const vueJsxPlugin = (await import(modPath('@vitejs/plugin-vue-jsx/dist/index.mjs'))).default;

const vite = await createServer({
    root,
    logLevel: 'error',
    plugins: [vuePlugin(), vueJsxPlugin()],
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true },
});

const load = async (spec) => {
    const url = pathToFileURL(path.resolve(root, spec)).href;
    return vite.ssrLoadModule(url);
};

const { createSSRApp, h } = await import('vue');
const { renderToString } = await import('vue/server-renderer');

// —— 全组件 demo 树（覆盖冒烟测试的 4 组 + 更多常用组件）——
const [
    button, input, select, form, formItem, tooltip, dropdown, modal,
    table, datePicker, timePicker, checkbox, radio, switchC, tag, spin,
    pagination, alert,
] = await Promise.all([
    load('components/button/button.tsx'),
    load('components/input/input.vue'),
    load('components/select/select.vue'),
    load('components/form/form.vue'),
    load('components/form/formItem.vue'),
    load('components/tooltip/tooltip.tsx'),
    load('components/dropdown/dropdown.tsx'),
    load('components/modal/modal.tsx'),
    load('components/table/table.tsx'),
    load('components/date-picker/datePicker.vue'),
    load('components/time-picker/time-picker.vue'),
    load('components/checkbox/checkbox.vue'),
    load('components/radio/radio.vue'),
    load('components/switch/switch.vue'),
    load('components/tag/tag.vue'),
    load('components/spin/spin.tsx'),
    load('components/pagination/pagination.tsx'),
    load('components/alert/alert.tsx'),
]);

const sel = select.default;

const demo = h('div', { style: 'padding:32px;display:grid;gap:40px;font-family:sans-serif' }, [
    h('h2', {}, 'fes-design SSR 渲染效果（服务端 HTML，未激活）'),

    h('section', {}, [
        h('h3', {}, 'Button'),
        h('div', { style: 'display:flex;gap:12px;align-items:center' }, [
            h(button.default, { type: 'primary' }, { default: () => '主要按钮' }),
            h(button.default, { type: 'danger' }, { default: () => '危险按钮' }),
            h(button.default, {}, { default: () => '默认按钮' }),
            h(button.default, { disabled: true }, { default: () => '禁用' }),
        ]),
    ]),

    h('section', {}, [
        h('h3', {}, 'Form + Input + Select'),
        h(form.default, { labelWidth: '80px' }, {
            default: () => [
                h(formItem.default, { label: '名称' }, { default: () => h(input.default, { placeholder: '请输入' }) }),
                h(formItem.default, { label: '城市' }, { default: () => h(sel, { placeholder: '请选择', style: 'width:200px' }) }),
            ],
        }),
    ]),

    h('section', {}, [
        h('h3', {}, 'Checkbox / Radio / Switch / Tag'),
        h('div', { style: 'display:flex;gap:16px;align-items:center' }, [
            h(checkbox.default, { modelValue: true }, { default: () => '勾选' }),
            h(radio.default, { modelValue: true }, { default: () => '单选' }),
            h(switchC.default, { modelValue: true }),
            h(tag.default, { type: 'primary' }, { default: () => '标签' }),
        ]),
    ]),

    h('section', {}, [
        h('h3', {}, 'Tooltip / Dropdown（trigger 渲染，弹层初始关闭）'),
        h('div', { style: 'display:flex;gap:24px' }, [
            h(tooltip.default, { content: '提示内容' }, { default: () => h(button.default, {}, { default: () => '悬停我' }) }),
            h(dropdown.default, { options: [{ value: 1, label: '菜单一' }, { value: 2, label: '菜单二' }] }, { default: () => h(button.default, {}, { default: () => '下拉菜单' }) }),
        ]),
    ]),

    h('section', {}, [
        h('h3', {}, 'Table'),
        h(table.default, {
            border: true,
            data: [
                { id: 1, name: 'SSR 行一', status: '正常' },
                { id: 2, name: 'SSR 行二', status: '停用' },
            ],
            columns: [
                { prop: 'id', label: 'ID', width: 120 },
                { prop: 'name', label: '名称', width: 200 },
                { prop: 'status', label: '状态', width: 160 },
            ],
        }),
    ]),

    h('section', {}, [
        h('h3', {}, 'DatePicker / TimePicker / Pagination / Alert / Spin'),
        h('div', { style: 'display:flex;gap:16px;align-items:center;flex-wrap:wrap' }, [
            h(datePicker.default, { placeholder: '选择日期', style: 'width:200px' }),
            h(timePicker.default, { placeholder: '选择时间', style: 'width:200px' }),
            h(pagination.default, { pageCount: 5, currentPage: 1 }),
            h(alert.default, { type: 'success', message: 'SSR 渲染成功' }),
            h(spin.default, {}),
        ]),
    ]),
]);

const app = createSSRApp({ render: () => demo });
const html = await renderToString(app);

// —— 主题变量注入（SSR 补齐）——
// fes-design 的主题变量默认值由运行时 applyTheme 写入容器（非编译期 CSS），
// 纯 SSR HTML 不执行 JS 时会缺失。此处模拟客户端 mount 时的写入：
// 取 baseTheme() 变量表，生成 <style>:root{--f-*:...}</style> 注入 <head>。
// （naive-ui 的 ssrAdapter 同样把主题样式收集进服务端 HTML）
const { baseTheme } = await load('components/_theme/base.ts');
// kebabCase 手写（ lodash-es 的 ESM 具名导出经 vite ssrLoadModule 返回 default 包装，各版本行为不一）
const kebabCase = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const vars = baseTheme();
const varCss = Object.entries(vars)
    .map(([k, v]) => `--f-${kebabCase(k)}:${v};`)
    .join('');
const themeStyleTag = `<style>:root{${varCss}}</style>`;

// —— less 编译：复用各组件 style/index.ts 的引入链 ——
const lessFiles = [
    // 全局基础 + icon 的 fes-design-icon（svg 1em 尺寸来源）
    `@import "${root.replace(/\\/g, '/')}/components/style/index.less";`,
    `@import "${root.replace(/\\/g, '/')}/components/icon/style/index.less";`,
    ...[
        'button', 'input', 'select', 'select-trigger', 'form', 'tooltip',
        'dropdown', 'modal', 'table', 'date-picker', 'time-picker',
        'checkbox', 'radio', 'switch', 'tag', 'spin', 'pagination', 'alert',
    ].map((c) => `@import "${root.replace(/\\/g, '/')}/components/${c}/style/index.less";`),
].join('\n');
// less 无 ESM 默认导出，走 createRequire 拿 CJS 入口
import { createRequire } from 'node:module';
const require_ = createRequire(import.meta.url);
const less = require_('less');
const { css } = await less.render(lessFiles, {
    javascriptEnabled: true,
    paths: [path.join(root, 'components')],
});

const page = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>fes-design SSR 预览</title>
${themeStyleTag}
<style>
${css}
body { margin: 0; background: #f5f6f7; }
section { background: #fff; padding: 20px 24px; border-radius: 8px; }
h2, h3 { margin: 0 0 16px; }
h3 { color: #0f1222; font-size: 15px; }
</style>
</head>
<body>
${html}
</body>
</html>`;

fs.writeFileSync(outFile, page, 'utf8');
await vite.close();
console.log(`PREVIEW_OK ${outFile} (${(page.length / 1024).toFixed(1)} KB, css ${(css.length / 1024).toFixed(1)} KB)`);
process.exit(0);
