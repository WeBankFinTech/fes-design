import { test, expect } from '@playwright/test';

test.describe('datehour picker', () => {
    test('time picker shows hours and minutes without seconds', async ({ page }) => {
        await page.goto('/zh/components/date-picker/');

        await page.getByPlaceholder('选择日期和时间').click();

        const hoursColumn = page.locator('.f-date-picker-popper .f-time-picker-content-cell').first();
        await expect(hoursColumn).toBeVisible();

        const columns = await page.locator('.f-date-picker-popper .f-time-picker-content-cell').count();
        expect(columns).toBe(2);
    });
});