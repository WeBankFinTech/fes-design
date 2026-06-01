import { test, expect } from '@playwright/test';

test.describe('datehour picker', () => {
    test('time picker shows hours and minutes without seconds', async ({ page }) => {
        await page.goto('/zh/components/date-picker/');
        await page.waitForLoadState('networkidle');

        const datehourDemo = page.locator('.f-date-picker').first();
        await expect(datehourDemo).toBeVisible({ timeout: 15000 });
        await datehourDemo.click();

        const columns = await page.locator('.f-date-picker-popper .f-time-picker-content-cell').count();
        expect(columns).toBe(2);
    });
});