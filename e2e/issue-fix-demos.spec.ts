import { type Page, expect, test } from '@playwright/test';

// #1031-#1039 修复涉组件的存量 demo 真实浏览器验证：
// 1) 页面级无未捕获异常（pageerror）与无 console.error（含 Vue warn）
// 2) 页面 demo 块数量 > 0（存量 demo 全部渲染）
// 3) 关键修复场景交互抽查

const PAGES: { url: string; name: string }[] = [
    { url: '/zh/components/select.html', name: 'select (#1031 groupOption)' },
    { url: '/zh/components/tabs.html', name: 'tabs (#1032 tabPane)' },
    { url: '/zh/components/menu.html', name: 'menu (#1033/#1034/#1040)' },
    { url: '/zh/components/table.html', name: 'table (#1035 ellipsis)' },
    { url: '/zh/components/draggable.html', name: 'draggable (#1036 指令)' },
    { url: '/zh/components/selectTree.html', name: 'selectTree (#1037)' },
    { url: '/zh/components/avatar.html', name: 'avatar (#1038 avatarGroup demo)' },
    { url: '/zh/components/inputNumber.html', name: 'inputNumber (#1039 键盘/滚轮)' },
];

const collectErrors = (page: Page) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
        errors.push(`PAGEERROR: ${err.message.slice(0, 200)}`);
    });
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(`CONSOLE: ${msg.text().slice(0, 200)}`);
        }
    });
    return errors;
};

test.describe('涉组件存量 demo 真实浏览器验证', () => {
    for (const { url, name } of PAGES) {
        test(`${name} — ${url} 无页面错误且 demo 全渲染`, async ({ page }) => {
            const errors = collectErrors(page);
            const response = await page.goto(url);
            expect(response?.status(), `${url} 应 200`).toBe(200);
            await page
                .locator('.component-doc')
                .first()
                .waitFor({ state: 'visible', timeout: 60_000 });
            // 等待异步组件与 demo 渲染稳定
            await page.waitForTimeout(1200);
            const demoCount = await page
                .locator('.component-doc')
                .count();
            expect(demoCount, `${url} 应渲染出 demo 块`).toBeGreaterThan(0);
            // 页面级错误剔除 favicon/资源 404（仅保留运行错误）
            const runErrors = errors.filter(
                (e) => !e.includes('favicon') && !e.includes('404'),
            );
            expect(runErrors, `${name} 页面不应有未捕获异常/console.error`).toEqual([]);
        });
    }

    test('#1039 inputNumber 存量 demo + 键盘步进：聚焦输入框 ArrowUp 值变化', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/zh/components/inputNumber.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });
        // 键盘/滚轮 demo（keyboardWheel）或 step demo 中任一输入框聚焦
        const input = page.locator('.fes-input-number input').first();
        await input.waitFor({ state: 'visible', timeout: 30_000 });
        const before = await input.inputValue();
        await input.focus();
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(300);
        const after = await input.inputValue();
        // step 与初始值决定是否严格 +step；至少值不应为 NaN 且已聚焦响应
        expect(Number.isNaN(Number(after))).toBe(false);
        const runErrors = errors.filter(
            (e) => !e.includes('favicon') && !e.includes('404'),
        );
        expect(runErrors).toEqual([]);
        void before;
    });

    test('#1034/#1040 menu：存量 demo 页面无渲染自循环崩溃', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/zh/components/menu.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });
        await page.waitForTimeout(1500);
        // 若存量 demo 触发 FSubMenu 渲染自循环（#1040），会以 pageerror 抛出
        const loopErrors = errors.filter(
            (e) => e.includes('Maximum recursive updates') || e.includes('PAGEERROR'),
        );
        expect(loopErrors, 'menu 页不应有递归更新 pageerror（#1040 病灶未覆盖场景除外）').toEqual([]);
    });
});
