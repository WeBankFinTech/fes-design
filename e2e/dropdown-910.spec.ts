import { test, expect } from '@playwright/test';

test.describe('Dropdown #910', () => {
    test('dropdown can select a non-disabled option', async ({ page }) => {
        await page.goto('/zh/components/dropdown/', { waitUntil: 'networkidle' });

        await page.waitForTimeout(2000);

        const dropdownButton = page.locator('.fes-dropdown-trigger button, .fes-dropdown button').first();
        await expect(dropdownButton).toBeVisible({ timeout: 10000 });

        await dropdownButton.click();

        const options = page.locator('.fes-dropdown-option:not(.is-disabled)');
        await expect(options.first()).toBeVisible({ timeout: 5000 });

        const firstEnabledOption = options.first();
        await firstEnabledOption.click();
        await page.waitForTimeout(500);
    });
});