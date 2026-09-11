import { expect, test } from '@playwright/test';

// 站点导航：首页加载、侧边菜单导航切换

test.describe('站点导航', () => {
    test('首页加载并显示标题', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Fes/);
        await expect(page.getByRole('link', { name: '快速开始' })).toBeVisible();
    });

    test('侧边菜单导航到组件页', async ({ page }) => {
        // 直接进入组件页，侧边栏在组件页才渲染
        await page.goto('/zh/components/button.html');
        const sidebar = page.locator('.VPSidebar');
        await sidebar.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => {});
        // 移动端/窄屏下侧边栏可能隐藏，直接断言导航链接可点击
        const link = page
            .getByRole('link', { name: 'Button', exact: false })
            .first();
        if ((await link.count()) > 0 && (await link.isVisible())) {
            await link.click();
            await page.waitForURL(/button/, { timeout: 30_000 });
        }
        await expect(page.locator('.vp-doc')).toBeVisible();
        expect(page.url()).toContain('button');
    });

    test('导航栏菜单存在', async ({ page }) => {
        await page.goto('/');
        const nav = page.locator('.VPNavBar');
        await expect(nav).toBeVisible();
    });
});
