/**
 * SSR 冒烟测试（独立进程方案）：
 *
 * 背景（架构审查 P0）：修复前 useTheme 的 immediate watch 在 setup 期同步访问
 * document.body，任何组件 SSR 即抛 ReferenceError。
 *
 * 为什么用独立进程：vitest 的 jsdom 环境给所有用例兜底了 document/window，
 * 在同进程内"删全局"会污染同 worker 的其它用例；而 node 环境又与
 * plugin-vue-jsx 的 SSR 虚拟模块存在解析兼容问题。独立子进程跑真实
 * renderToString（无任何 DOM 全局），主进程仅断言退出码与输出——
 * 语义最真实（等价于用户的 Nuxt/SSR 应用进程），且零污染。
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const RUNNER = path.resolve(__dirname, 'ssr-smoke.runner.mjs');

const runSSR = (groups: string[]) => {
    try {
        const out = execFileSync(
            process.execPath,
            [RUNNER, ...groups],
            {
                encoding: 'utf8',
                timeout: 180_000,
                env: { ...process.env, NODE_ENV: 'test' },
            },
        );
        return { ok: true, out };
    } catch (e: any) {
        return { ok: false, out: `${e.stdout || ''}${e.stderr || ''}` };
    }
};

describe('SSR 冒烟（独立进程，无任何 DOM 全局）', () => {
    // runner 每次冷启动一个 vite SSR 实例（约 40~50s），默认 5s 超时不够
    const SLOW = 180_000;

    test(
        '基础组件：FButton（useTheme 生命周期推迟的直接证明）',
        () => {
            const r = runSSR(['button']);
            expect(r.ok, r.out.slice(-800)).toBe(true);
            expect(r.out).toContain('BUTTON_OK');
        },
        SLOW,
    );

    test(
        '表单链路：FForm + FFormItem + FInput + FSelect',
        () => {
            const r = runSSR(['form']);
            expect(r.ok, r.out.slice(-800)).toBe(true);
            expect(r.out).toContain('FORM_OK');
        },
        SLOW,
    );

    test(
        '弹层家族（初始关闭）：FTooltip / FDropdown / FModal',
        () => {
            const r = runSSR(['overlay']);
            expect(r.ok, r.out.slice(-800)).toBe(true);
            expect(r.out).toContain('OVERLAY_OK');
        },
        SLOW,
    );

    test(
        '数据组件：FTable / FDatePicker / FTimePicker',
        () => {
            const r = runSSR(['data']);
            expect(r.ok, r.out.slice(-800)).toBe(true);
            expect(r.out).toContain('DATA_OK');
        },
        SLOW,
    );

    test(
        '图片：FImage 服务端不预加载（review 补充，P0 崩点回归守护）',
        () => {
            const r = runSSR(['image']);
            expect(r.ok, r.out.slice(-800)).toBe(true);
            expect(r.out).toContain('IMAGE_OK');
        },
        SLOW,
    );

    test(
        '命令式 API：服务端调用抛可捕获错误而非 ReferenceError',
        () => {
            const r = runSSR(['imperative']);
            expect(r.ok, r.out.slice(-800)).toBe(true);
            expect(r.out).toContain('IMPERATIVE_OK');
        },
        SLOW,
    );

    test('回归守护：本进程无任何 DOM 全局（selfcheck，秒回）', () => {
        // 直接验证"无 DOM 全局"语义本身：裸 document 访问必须抛错。
        // 若未来有人把 runner 挪回 jsdom 同进程跑，这条会立刻红。
        const r = runSSR(['selfcheck']);
        expect(r.ok).toBe(true);
        expect(r.out).toContain('SELFCHECK_OK');
    });
});
