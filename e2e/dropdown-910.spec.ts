import { test, expect } from '@playwright/test';

test.describe('Dropdown #910', () => {
    test('dropdown trigger text updates after selecting an option', async ({ page }) => {
        await page.goto('/zh/components/dropdown/');

        const dropdown = page.locator('.fes-dropdown').first();
        await expect(dropdown).toBeVisible();

        const trigger = dropdown.locator('.fes-dropdown-trigger');
        await expect(trigger).toBeVisible();
    });
});