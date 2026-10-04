/**
 * SSR 渲染 runner：由 ssr-smoke.spec.ts 以独立子进程启动。
 * 用 vite 的 SSR 模式加载 .vue/.tsx 源码（与库的真实发布形态一致的 ESM 链路），
 * 在无任何 DOM 全局的环境里 renderToString，打印标记 + 退出码。
 *
 * 参数：node ssr-smoke.runner.mjs button|form|overlay|data|selfcheck
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

const groups = process.argv.slice(2);

// selfcheck 不需要 vite，在任何重初始化之前抢先执行并退出
if (groups.includes('selfcheck')) {
    if (typeof globalThis.document !== 'undefined'
        || typeof globalThis.window !== 'undefined') {
        console.error('SELFCHECK_FAIL: DOM globals exist in this process');
        process.exit(1);
    }
    console.log('SELFCHECK_OK');
    if (groups.length === 1) process.exit(0);
}

// vite 以编程方式做 SSR transform（jsdom 不参与本进程）
const { createServer } = await import(
    pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href
);

// 与 vitest.config.ts 相同的插件链：vue + jsx（tsx 组件源码需要）
// pnpm 目录导入不可用，按包 exports 字段直指 dist 文件
const modPath = (p) =>
    pathToFileURL(path.join(root, 'node_modules', p)).href;
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

const render = async (node) => {
    const app = createSSRApp({ render: () => node });
    return renderToString(app);
};

let failed = false;
try {
    if (groups.includes('button')) {
        const mod = await load('components/button/button.tsx');
        const html = await render(
            h(mod.default, { type: 'primary' }, { default: () => '按钮' }),
        );
        if (!html.includes('按钮')) {
            throw new Error(`button html missing text: ${html.slice(0, 120)}`);
        }
        console.log('BUTTON_OK');
    }

    if (groups.includes('form')) {
        const form = await load('components/form/form.vue');
        const item = await load('components/form/formItem.vue');
        const input = await load('components/input/input.vue');
        const select = await load('components/select/select.vue');
        const html = await render(
            h(form.default, { model: {} }, {
                default: () => [
                    h(item.default, { label: '名称', prop: 'name' }, {
                        default: () => h(input.default),
                    }),
                    h(item.default, { label: '城市', prop: 'city' }, {
                        default: () => h(select.default, null, { default: () => '选项' }),
                    }),
                ],
            }),
        );
        if (!html.includes('名称') || !html.includes('城市')) {
            throw new Error(`form html missing labels: ${html.slice(0, 200)}`);
        }
        console.log('FORM_OK');
    }

    if (groups.includes('overlay')) {
        const tooltip = await load('components/tooltip/tooltip.tsx');
        const dropdown = await load('components/dropdown/dropdown.tsx');
        const modal = await load('components/modal/modal.tsx');
        const html = await render(
            h('div', [
                // FTooltip 的 trigger 插槽是 default（slots.default）
                h(tooltip.default, null, {
                    default: () => h('span', '悬停我'),
                    content: () => '提示内容',
                }),
                h(dropdown.default, { options: [] }, {
                    // FDropdown 的 trigger 插槽同样是 default（经 slots.default 透传给 Popper）
                    default: () => h('button', '菜单'),
                }),
                h(modal.default, { show: false }, { default: () => '模态' }),
            ]),
        );
        if (!html.includes('悬停我') || !html.includes('菜单')) {
            throw new Error(`overlay html missing trigger: ${html.slice(0, 300)}`);
        }
        console.log('OVERLAY_OK');
    }

    if (groups.includes('data')) {
        const table = await load('components/table/table.tsx');
        const datePicker = await load('components/date-picker/datePicker.vue');
        const timePicker = await load('components/time-picker/time-picker.vue');
        const html = await render(
            h('div', [
                h(table.default, { data: [], columns: [] }),
                h(datePicker.default),
                h(timePicker.default),
            ]),
        );
        if (typeof html !== 'string') {
            throw new Error('data render not string');
        }
        console.log('DATA_OK');
    }
} catch (e) {
    failed = true;
    console.error(`SSR_FAIL: ${e && (e.stack || e.message)}`);
} finally {
    await vite.close().catch(() => {});
}

process.exit(failed ? 1 : 0);
