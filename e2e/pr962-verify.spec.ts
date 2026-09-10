import { expect, test } from '@playwright/test';

// PR #962 验证：
// 1. #958 Form inline 布局 :span="12" 应正常换行（占 24 列中的 12 列）
// 2. #920 FModal content 长文本应换行不溢出
// 方式：注入 <script type="module">（vite dev 会转换其中的裸导入），结果挂 window 供断言

const WT = '/Users/harrywan/company/git/fes-design/.worktrees/verify-pr-962';

async function runModuleScript(page: any, code: string, key: string) {
    await page.evaluate(([codeStr, resultKey, wt]) => {
        (window as any).__e2eResults = {};
        (window as any).__wt = wt;
        const s = document.createElement('script');
        s.type = 'module';
        s.textContent = codeStr;
        s.onerror = () => {
            (window as any).__e2eResults[resultKey] = { ok: false, error: 'script element error' };
        };
        document.head.appendChild(s);
    }, [code, key, WT]);
    await page.waitForFunction(
        (k) => (window as any).__e2eResults?.[k] !== undefined,
        key,
        { timeout: 30_000 },
    );
    return page.evaluate((k) => (window as any).__e2eResults[k], key);
}

test.describe('#958 Form inline span', () => {
    test('span=12 的表单项在 inline 布局下一行放两个，span=24 换行', async ({ page }) => {
        await page.goto('/zh/components/form.html');
        await page.locator('.fes-form').first().waitFor({ state: 'visible', timeout: 60_000 });

        const result = await runModuleScript(page, `
(async () => {
try {
    const wt = window.__wt;
    const mod = await import('/@fs' + wt + '/components/index.ts');
    const urls = performance.getEntriesByType('resource').map((e) => e.name);
    const vueUrl = urls.find((u) => /deps\\/vue\\.js/.test(u));
    if (!vueUrl) { window.__e2eResults.formSpan = { ok: false, error: 'vue url not found' }; return; }
    const vmod = await import(vueUrl);
    const Vue = vmod.default ?? vmod;
    const { FForm, FFormItem, FInput } = mod;
    const host = document.createElement('div');
    host.id = 'e2e-form-span-host';
    host.style.width = '800px';
    document.body.appendChild(host);
    const mountPoint = document.createElement('div');
    host.appendChild(mountPoint);
    const app = Vue.createApp({
        render() {
            return Vue.h(FForm, { layout: 'inline' }, {
                default: () => [
                    Vue.h(FFormItem, { label: '甲', span: 12 }, { default: () => Vue.h(FInput) }),
                    Vue.h(FFormItem, { label: '乙', span: 12 }, { default: () => Vue.h(FInput) }),
                    Vue.h(FFormItem, { label: '丙', span: 24 }, { default: () => Vue.h(FInput) }),
                ],
            });
        },
    });
    app.mount(mountPoint);
    await new Promise((r) => setTimeout(r, 300));
    const items = host.querySelectorAll('.fes-form-item');
    if (items.length !== 3) {
        window.__e2eResults.formSpan = { ok: false, error: 'formItem count: ' + items.length };
        return;
    }
    const r0 = items[0].getBoundingClientRect();
    const r1 = items[1].getBoundingClientRect();
    const r2 = items[2].getBoundingClientRect();
    window.__e2eResults.formSpan = {
        ok: true,
        span12Class: items[0].className.includes('fes-form-item-span-12'),
        sameRow: Math.abs(r0.top - r1.top) < 2,
        nextRow: r2.top > r1.top + 10,
        width0: r0.width,
        noOverflow: r0.width > 200 && r0.width < 500,
    };
} catch (e) {
    window.__e2eResults.formSpan = { ok: false, error: String(e).slice(0, 250) };
}
})();`, 'formSpan');

        expect(result.ok).toBe(true);
        expect(result.span12Class).toBe(true);
        // 修复后：两个 span=12 并排一行（各占一半），span=24 换行
        expect(result.sameRow).toBe(true);
        expect(result.nextRow).toBe(true);
        expect(result.noOverflow).toBe(true);

        await page.locator('#e2e-form-span-host').screenshot({ path: 'test-results/pr962-form-inline-span.png' });
    });
});

test.describe('#920 FModal content 文字溢出', () => {
    test('超长连续字符串在 modal body 内换行，不溢出容器', async ({ page }) => {
        await page.goto('/zh/components/modal.html');
        await page.locator('button').first().waitFor({ state: 'visible', timeout: 60_000 });

        const result = await runModuleScript(page, `
(async () => {
try {
    const wt = window.__wt;
    const mod = await import('/@fs' + wt + '/components/index.ts');
    const urls = performance.getEntriesByType('resource').map((e) => e.name);
    const vueUrl = urls.find((u) => /deps\\/vue\\.js/.test(u));
    if (!vueUrl) { window.__e2eResults.modalOverflow = { ok: false, error: 'vue url not found' }; return; }
    const vmod = await import(vueUrl);
    const Vue = vmod.default ?? vmod;
    const { FModal, FButton } = mod;
    const host = document.createElement('div');
    host.id = 'e2e-modal-overflow-host';
    document.body.appendChild(host);
    const mountPoint = document.createElement('div');
    host.appendChild(mountPoint);
    const show = Vue.ref(false);
    const longText = 'A'.repeat(200) + '这是一段没有任何空格和标点的超长中文文本'.repeat(10);
    const app = Vue.createApp({
        setup() {
            return () => Vue.h('div', [
                Vue.h(FModal, {
                    show: show.value,
                    'onUpdate:show': (v) => { show.value = v; },
                    title: '溢出测试',
                }, { default: () => longText }),
                Vue.h(FButton, { onClick: () => { show.value = true; } }, { default: () => '打开' }),
            ]);
        },
    });
    app.mount(mountPoint);
    show.value = true;
    await new Promise((r) => setTimeout(r, 800));
    const visibleBodies = Array.from(document.querySelectorAll('.fes-modal-body'))
        .filter((b) => b.getBoundingClientRect().width > 0);
    const body = visibleBodies[visibleBodies.length - 1];
    if (!body) {
        window.__e2eResults.modalOverflow = { ok: false, error: '无可见 modal body' };
        return;
    }
    const bodyRect = body.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(body);
    const textRect = range.getBoundingClientRect();
    const cs = getComputedStyle(body);
    window.__e2eResults.modalOverflow = {
        ok: true,
        bodyWidth: bodyRect.width,
        wordBreak: cs.wordBreak,
        overflow: cs.overflow,
        noOverflowX: textRect.right <= bodyRect.right + 1,
        multiLine: range.getClientRects().length > 1,
    };
} catch (e) {
    window.__e2eResults.modalOverflow = { ok: false, error: String(e).slice(0, 250) };
}
})();`, 'modalOverflow');

        expect(result.ok).toBe(true);
        // PR 添加的样式生效
        expect(result.wordBreak).toBe('break-all');
        expect(result.overflow).toBe('hidden');
        // 文本没有横向溢出 body
        expect(result.noOverflowX).toBe(true);
        // 长文本换成多行
        expect(result.multiLine).toBe(true);

        const modalEls = page.locator('.fes-modal');
        const n = await modalEls.count();
        for (let i = n - 1; i >= 0; i--) {
            if (await modalEls.nth(i).isVisible()) {
                await modalEls.nth(i).screenshot({ path: 'test-results/pr962-modal-overflow.png' });
                break;
            }
        }
    });
});
