import { test, expect } from '@playwright/test';

test.describe('Layout disabled demo', () => {
    test('should render slot content without layout section when disabled=true', async ({ page }) => {
        await page.goto('/zh/components/layout/', { waitUntil: 'networkidle' });

        await expect(page.locator('.vp-doc')).toBeVisible({ timeout: 120000 });

        await expect(page.locator('.login-page')).toBeVisible({ timeout: 60000 });

        const loginPage = page.locator('.login-page');
        const isUnderSection = await loginPage.evaluate(el => el.closest('section.fes-layout') !== null);
        expect(isUnderSection).toBe(false);
    });
});