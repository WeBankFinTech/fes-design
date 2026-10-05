import { type Page, expect, test } from '@playwright/test';

// #1040 FMenu 子项选中 isActive 单一事实源根治 —— 真实浏览器验证：
// 点击子菜单内叶子后，子菜单及祖先高亮（is-active）且无 Maximum recursive
// updates 崩溃（unhandledRejection 浏览器等价物经 window 事件收集）。

const collectErrors = (page: Page) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message.slice(0, 200)}`));
    page.on('console', (m) => {
        if (m.type() === 'error') errors.push(`CONSOLE: ${m.text().slice(0, 200)}`);
    });
    // Vue 3.5 checkRecursiveUpdates 出口为 unhandledRejection（instance=null 不可拦截）
    page.addInitScript(() => {
        window.addEventListener('unhandledrejection', (ev) => {
            console.error(`UNHANDLED_REJECTION: ${String((ev as PromiseRejectionEvent).reason).slice(0, 200)}`);
        });
    });
    return errors;
};
const runErrors = (errors: string[]) =>
    errors.filter(
        (e) => !e.includes('favicon') && !e.includes('404') && !e.includes('net::') && !e.includes('Failed to load resource'),
    );

test('#1040 垂直：点击叶子后子菜单高亮且无渲染自环崩溃', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/zh/components/menu.html');
    await page.locator('.component-doc').first().waitFor({ state: 'visible', timeout: 60_000 });
    await page.waitForTimeout(1500);
    // expandedKeys demo（第 6 个 .fes-menu，4 个 wrapper，外层 value=4 由 expandedKeys 展开）
    const menu = page.locator('.fes-menu').nth(5);
    const wrappers = menu.locator('.fes-sub-menu-wrapper');
    expect(await wrappers.count()).toBe(4);
    // 点击第一个外层子菜单（value=1）展开
    await wrappers.first().click();
    await page.waitForTimeout(600);
    // 点其内叶子「湖南」（外层1 children 内，dispatch: children 是 wrapper 兄弟）
    const leaf = menu
        .locator('.fes-sub-menu-children .fes-menu-item')
        .filter({ hasText: '湖南' })
        .first();
    await leaf.waitFor({ state: 'visible', timeout: 10_000 });
    await leaf.click();
    await page.waitForTimeout(600);
    // 子菜单高亮（#1040 核心：isActive 单一事实源派生渲染生效，不崩溃）
    await expect(menu.locator('.fes-sub-menu.is-active').first()).toBeVisible();
    await expect(leaf).toHaveClass(/is-active/);
    // 无渲染自环崩溃（递归更新会以 pageerror / unhandledrejection 出现）
    const loop = runErrors(errors).filter(
        (e) => e.includes('Maximum recursive updates') || e.includes('UNHANDLED_REJECTION'),
    );
    expect(loop, `子项选中不应触发递归更新/未处理拒绝: ${loop.join(' | ')}`).toEqual([]);
});

test('#1040 水平：hover 打开面板点叶子，面板收起且无自环崩溃', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/zh/components/menu.html');
    await page.locator('.component-doc').first().waitFor({ state: 'visible', timeout: 60_000 });
    await page.waitForTimeout(1500);
    const menu = page.locator('.fes-menu.is-horizontal').first();
    await menu.locator('.fes-sub-menu-wrapper').first().hover();
    const panel = page.locator('[class*="sub-menu-popper"]:visible').first();
    await panel.waitFor({ state: 'visible', timeout: 10_000 });
    const leaf = panel.locator('.fes-menu-item:not(.is-disabled)').first();
    await leaf.waitFor({ state: 'visible', timeout: 10_000 });
    const leafText = (await leaf.textContent())?.trim() || '';
    await leaf.click();
    await page.waitForTimeout(600);
    // 面板收起（updateExpandedKeys([]) 收敛）；点击项高亮——面板收起后
    // 元素隐藏但 class 保留，按文本在隐藏面板内断言 is-active
    await expect(panel).toBeHidden();
    await expect(
        page
            .locator('[class*="sub-menu-popper"] .fes-menu-item')
            .filter({ hasText: leafText })
            .first(),
    ).toHaveClass(/is-active/);
    const loop = runErrors(errors).filter(
        (e) => e.includes('Maximum recursive updates') || e.includes('UNHANDLED_REJECTION'),
    );
    expect(loop, `水平子项选中不应触发递归更新/未处理拒绝: ${loop.join(' | ')}`).toEqual([]);
});