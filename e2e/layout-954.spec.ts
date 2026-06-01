import { test, expect } from '@playwright/test';

test.describe('Layout disabled demo', () => {
    test('should render slot content without layout section when disabled=true', async ({ page }) => {
        await page.goto('/zh/components/layout/');

        await page.locator('.fes-layout-demo-item', { hasText: '不使用布局容器' }).click();

        const demoContent = page.locator('.vp-doc div').filter({ hasText: 'Login Page Content' }).first();
        await expect(demoContent).toBeVisible();

        const layoutSection = page.locator('section.fes-layout');
        await expect(layoutSection).not.toBeVisible();
    });
});