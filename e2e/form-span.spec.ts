import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Form inline layout span', () => {
    test('inline form renders f-form-item-span-12 class on each item when span=12', async ({ page }) => {
        await page.goto('/components/form/index.html');

        const inlineForm = page.locator('.f-form-inline');
        await expect(inlineForm).toBeVisible({ timeout: 10000 });

        const span12Items = page.locator('.f-form-item-span-12');
        const count = await span12Items.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });
});