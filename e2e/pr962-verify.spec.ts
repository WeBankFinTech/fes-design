import { expect, test } from '@playwright/test';
import path from 'node:path';

// PR #962 验证（仅 #920 FModal 修复）：
// 1. #920 FModal body 超长文本应换行、不横向溢出（PR 添加的 overflow/word-break 生效）
// 2. 已有功能回归：modal 基础交互（打开/关闭/取消/确认）
// 3. 已有功能回归：核心组件文档页正常渲染、无 JS 报错
// 方式：注入 <script type="module">（vite dev 会转换其中的裸导入/相对导入），结果挂 window 供断言

// playwright 始终以配置所在目录为 cwd 启动
const COMPONENTS_ENTRY = path.resolve(process.cwd(), 'components/modal/index.ts');

async function runModuleScript(page: any, code: string, key: string) {
    await page.evaluate(([codeStr, resultKey, entry]) => {
        (window as any).__e2eResults = {};
        (window as any).__entry = entry;
        const s = document.createElement('script');
        s.type = 'module';
        s.textContent = codeStr;
        s.onerror = () => {
            (window as any).__e2eResults[resultKey] = { ok: false, error: 'script element error' };
        };
        document.head.appendChild(s);
    }, [code, key, COMPONENTS_ENTRY]);
    await page.waitForFunction(
        (k) => (window as any).__e2eResults?.[k] !== undefined,
        key,
        { timeout: 90_000 },
    );
    return page.evaluate((k) => (window as any).__e2eResults[k], key);
}

test.describe('#920 FModal 文字溢出修复', () => {
    test('超长连续字符串在 modal body 内换行，不溢出容器', async ({ page }) => {
        await page.goto('/zh/components/modal.html');
        await page.locator('button').first().waitFor({ state: 'visible', timeout: 90_000 });

        const result = await runModuleScript(page, `
(async () => {
try {
    const mod = await import('/@fs' + window.__entry);
    const urls = performance.getEntriesByType('resource').map((e) => e.name);
    const vueUrl = urls.find((u) => /deps\\/vue\\.js/.test(u));
    if (!vueUrl) { window.__e2eResults.modalOverflow = { ok: false, error: 'vue url not found' }; return; }
    const vmod = await import(vueUrl);
    const Vue = vmod.default ?? vmod;
    const { FModal } = mod;
    const host = document.createElement('div');
    host.id = 'e2e-modal-overflow-host';
    document.body.appendChild(host);
    const mountPoint = document.createElement('div');
    host.appendChild(mountPoint);
    const show = Vue.ref(false);
    const longText = 'A'.repeat(200) + '这是一段没有任何空格和标点的超长中文文本'.repeat(10);
    const app = Vue.createApp({
        setup() {
            return () => Vue.h(FModal, {
                show: show.value,
                'onUpdate:show': (v) => { show.value = v; },
                title: '溢出测试',
            }, { default: () => longText });
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

        expect(result.ok, result.error).toBe(true);
        // PR #962 添加的样式生效
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

test.describe('已有功能回归 - FModal 基础交互', () => {
    test('打开/取消/确认关闭均正常', async ({ page }) => {
        await page.goto('/zh/components/modal.html');
        await page.locator('button').first().waitFor({ state: 'visible', timeout: 90_000 });

        const result = await runModuleScript(page, `
(async () => {
try {
    const mod = await import('/@fs' + window.__entry);
    const urls = performance.getEntriesByType('resource').map((e) => e.name);
    const vueUrl = urls.find((u) => /deps\\/vue\\.js/.test(u));
    const vmod = await import(vueUrl);
    const Vue = vmod.default ?? vmod;
    const { FModal } = mod;
    const host = document.createElement('div');
    host.id = 'e2e-modal-basic-host';
    document.body.appendChild(host);
    const mountPoint = document.createElement('div');
    host.appendChild(mountPoint);
    const show = Vue.ref(false);
    const events = [];
    const app = Vue.createApp({
        setup() {
            return () => Vue.h(FModal, {
                show: show.value,
                'onUpdate:show': (v) => { show.value = v; },
                title: '交互回归',
                onOk: () => events.push('ok'),
                onCancel: () => events.push('cancel'),
            }, { default: () => Vue.h('div', '基础交互内容') });
        },
    });
    app.mount(mountPoint);
    await new Promise((r) => setTimeout(r, 200));

    // FModal 通过 Teleport 渲染到 body；docs 演示页可能自带可见 modal，按标题圈定本用例实例。
    // 可见性以实际容器 .fes-modal-wrapper 宽度为准（外层根节点是普通 div，隐藏时宽度仍 > 0）
    const visibleModal = () => Array.from(document.querySelectorAll('.fes-modal'))
        .find((m) => m.querySelector('.fes-modal-wrapper')?.getBoundingClientRect().width > 0
            && m.querySelector('.fes-modal-header')?.textContent.includes('交互回归'));

    // 初始不可见
    const initiallyHidden = !visibleModal();

    // 打开
    show.value = true;
    await new Promise((r) => setTimeout(r, 600));
    const modal = visibleModal();
    const opened = !!modal;
    const titleOk = modal?.querySelector('.fes-modal-header')?.textContent.includes('交互回归');
    const bodyOk = modal?.querySelector('.fes-modal-body')?.textContent.includes('基础交互内容');

    // 点击取消
    const cancelBtn = Array.from(modal.querySelectorAll('.fes-modal-footer button'))
        .find((b) => b.textContent.includes('取'));
    cancelBtn?.click();
    await new Promise((r) => setTimeout(r, 600));
    const closedAfterCancel = !visibleModal();

    // 再次打开，点击确认
    show.value = true;
    await new Promise((r) => setTimeout(r, 600));
    const modal2 = visibleModal();
    const okBtn = Array.from(modal2.querySelectorAll('.fes-modal-footer button'))
        .find((b) => b.textContent.includes('确'));
    // 点击确认：FModal 的 ok 不自动关闭（由业务侧决定何时关，如异步保存成功后）
    okBtn?.click();
    await new Promise((r) => setTimeout(r, 600));
    const okEmitted = events.includes('ok');
    // 业务侧主动关闭
    show.value = false;
    await new Promise((r) => setTimeout(r, 600));
    const closedAfterOk = !visibleModal();

    window.__e2eResults.modalBasic = {
        ok: true,
        initiallyHidden,
        opened,
        titleOk: !!titleOk,
        bodyOk: !!bodyOk,
        closedAfterCancel,
        okEmitted,
        closedAfterOk,
        events,
    };
} catch (e) {
    window.__e2eResults.modalBasic = { ok: false, error: String(e).slice(0, 250) };
}
})();`, 'modalBasic');

        expect(result.ok, result.error).toBe(true);
        expect(result.initiallyHidden).toBe(true);
        expect(result.opened).toBe(true);
        expect(result.titleOk).toBe(true);
        expect(result.bodyOk).toBe(true);
        expect(result.closedAfterCancel).toBe(true);
        expect(result.okEmitted).toBe(true);
        expect(result.closedAfterOk).toBe(true);
        expect(result.events).toEqual(['cancel', 'ok']);
    });
});

test.describe('已有功能回归 - 核心组件文档页', () => {
    const pages = ['button', 'form', 'table', 'select', 'modal', 'input'];

    for (const name of pages) {
        test(`docs 页 ${name} 正常渲染且无 JS 报错`, async ({ page }) => {
            const pageErrors = [];
            page.on('pageerror', (err) => pageErrors.push(String(err).slice(0, 200)));
            await page.goto(`/zh/components/${name}.html`);
            // 等待任意 Fes 组件类名渲染出来
            await page.waitForFunction(
                () => document.querySelectorAll('[class*="fes-"]').length > 5,
                undefined,
                { timeout: 90_000 },
            );
            const fesCount = await page.evaluate(
                () => document.querySelectorAll('[class*="fes-"]').length,
            );
            expect(fesCount, `${name} 页面 Fes 组件渲染数`).toBeGreaterThan(5);
            expect(pageErrors, `${name} 页面 JS 报错: ${pageErrors.join('; ')}`).toEqual([]);
        });
    }
});
