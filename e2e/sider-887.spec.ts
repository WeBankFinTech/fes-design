import { test, expect } from '@playwright/test';

test.describe('Layout Sider box-sizing #887', () => {
    test('fes-aside element has box-sizing: border-box on layout docs page', async ({ page }) => {
        await page.goto('/zh/components/layout/');

        const aside = page.locator('.fes-aside').first();
        await expect(aside).toBeVisible();

        const boxSizing = await aside.evaluate((el) => {
            return window.getComputedStyle(el).boxSizing;
        });
        expect(boxSizing).toBe('border-box');
    });
});