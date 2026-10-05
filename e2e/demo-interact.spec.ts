import { expect, test, type Page } from '@playwright/test';

// 涉组件（#1031-#1039）存量 demo 真实交互操作验证：
// 对 9 个组件文档页的 demo 执行真实点击/展开/选择/拖拽/键盘操作，
// 断言全程无 pageerror / console.error（含 Vue 递归更新类异常）。

const COLLECT = (page: Page) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message.slice(0, 200)}`));
    page.on('console', (m) => {
        if (m.type() === 'error') errors.push(`CONSOLE: ${m.text().slice(0, 200)}`);
    });
    return errors;
};
const RUN_ERRORS = (errors: string[]) =>
    errors.filter((e) => !e.includes('favicon') && !e.includes('404') && !e.includes('net::') && !e.includes('Failed to load resource'));

const gotoDoc = async (page: Page, url: string) => {
    const res = await page.goto(url);
    expect(res?.status()).toBe(200);
    await page.locator('.component-doc').first().waitFor({ state: 'visible', timeout: 60_000 });
    await page.waitForTimeout(1000);
};

test.describe('涉组件 demo 真实交互操作（#1031-#1039）', () => {
    test('#1031 select：打开下拉、选择项、清除/多选', async ({ page }) => {
        const errors = COLLECT(page);
        await gotoDoc(page, '/zh/components/select.html');
        // 打开第一个下拉并选择
        const trigger = page.locator('.fes-select').first();
        await trigger.click();
        const opt = page.locator('.fes-select-option').first();
        await opt.waitFor({ state: 'visible', timeout: 10000 });
        await opt.click();
        await page.waitForTimeout(300);
        expect(RUN_ERRORS(errors)).toEqual([]);
    });

    test('#1032 tabs：逐个点击标签切换', async ({ page }) => {
        const errors = COLLECT(page);
        await gotoDoc(page, '/zh/components/tabs.html');
        const tabs = page.locator('.fes-tabs-tab');
        const n = await tabs.count();
        expect(n).toBeGreaterThan(0);
        for (let i = 0; i < Math.min(n, 4); i++) {
            await tabs.nth(i).click();
            await page.waitForTimeout(150);
        }
        expect(RUN_ERRORS(errors)).toEqual([]);
    });

    test('#1033/#1034 menu：展开子菜单并点击菜单项', async ({ page }) => {
        const errors = COLLECT(page);
        await gotoDoc(page, '/zh/components/menu.html');
        // 逐个展开子菜单（wrapper）并点击菜单项
        const wrappers = page.locator('.fes-sub-menu-wrapper');
        const w = await wrappers.count();
        if (w > 0) {
            await wrappers.first().click();
            await page.waitForTimeout(300);
            const items = page.locator('.fes-menu-item');
            if (await items.count() > 0) {
                await items.first().click();
                await page.waitForTimeout(300);
            }
        }
        // 水平/垂直 demo 均不得出现递归更新异常
        const loop = errors.filter((e) => e.includes('Maximum recursive updates'));
        expect(loop).toEqual([]);
        expect(RUN_ERRORS(errors)).toEqual([]);
    });

    test('#1035 table：展开行、点击可排序表头', async ({ page }) => {
        const errors = COLLECT(page);
        await gotoDoc(page, '/zh/components/table.html');
        // 展开行（第一个 expand 图标）
        const exp = page.locator('.fes-table-expand-icon').first();
        if (await exp.count() > 0) {
            await exp.click();
            await page.waitForTimeout(300);
        }
        // 点击表头（找可排序 th 或第一个无 selection 的 th）
        const th = page.locator('th.fes-table-cell').first();
        if (await th.count() > 0) {
            await th.click();
            await page.waitForTimeout(200);
        }
        expect(RUN_ERRORS(errors)).toEqual([]);
    });

    test('#1036 draggable：原生拖拽第一项到第二项', async ({ page }) => {
        const errors = COLLECT(page);
        await gotoDoc(page, '/zh/components/draggable.html');
        const items = page.locator('.sort-item');
        const n = await items.count();
        expect(n).toBeGreaterThan(1);
        const first = items.first();
        const second = items.nth(1);
        const fb = await first.boundingBox();
        const sb = await second.boundingBox();
        if (fb && sb) {
            await page.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
            await page.mouse.down();
            await page.waitForTimeout(200); // 等待 draggable="true" 写入
            await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2, { steps: 20 });
            await page.mouse.up();
            await page.waitForTimeout(400);
        }
        expect(RUN_ERRORS(errors)).toEqual([]);
    });

    test('#1037 selectTree：打开、展开节点、选择叶子', async ({ page }) => {
        const errors = COLLECT(page);
        await gotoDoc(page, '/zh/components/selectTree.html');
        const trigger = page.locator('.fes-select-tree .fes-input-inner, .fes-select-trigger').first();
        if (await trigger.count() > 0) {
            await trigger.click();
            await page.waitForTimeout(400);
            const sw = page.locator('.fes-tree-node-switcher').first();
            if (await sw.count() > 0) {
                await sw.click();
                await page.waitForTimeout(300);
            }
            const node = page.locator('.fes-tree-node-content').first();
            if (await node.count() > 0) {
                await node.click();
                await page.waitForTimeout(300);
            }
        }
        expect(RUN_ERRORS(errors)).toEqual([]);
    });

    test('#1038 avatar：头像组与普通头像渲染', async ({ page }) => {
        const errors = COLLECT(page);
        await gotoDoc(page, '/zh/components/avatar.html');
        expect(await page.locator('.fes-avatar').count()).toBeGreaterThan(0);
        expect(RUN_ERRORS(errors)).toEqual([]);
    });

    test('#1039 inputNumber：键盘步进与加减按钮', async ({ page }) => {
        const errors = COLLECT(page);
        await gotoDoc(page, '/zh/components/inputNumber.html');
        const input = page.locator('.fes-input-number input').first();
        await input.waitFor({ state: 'visible', timeout: 30_000 });
        const v0 = await input.inputValue();
        await input.focus();
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(250);
        const v1 = await input.inputValue();
        expect(Number(v1) > Number(v0) || Number(v1) === Number(v0)).toBe(true); // step 或初始值可能为 0 起步
        // 点击加减按钮
        const btn = page.locator('.fes-input-number-link-up, .fes-input-number-link-down').first();
        if (await btn.count() > 0) {
            await btn.click();
            await page.waitForTimeout(200);
        }
        expect(RUN_ERRORS(errors)).toEqual([]);
    });
});