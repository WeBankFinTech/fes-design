import { test, expect } from '@playwright/test';

test.describe('Anchor component e2e', () => {
    test('should display anchor links on anchor docs page', async ({ page }) => {
        await page.goto('/zh/components/anchor/');
        const anchorLinks = page.locator('.fes-anchor-link-title');
        await expect(anchorLinks.first()).toBeVisible();
        await expect(anchorLinks).toHaveCount(4); // 3 top-level + 1 child link
    });
});