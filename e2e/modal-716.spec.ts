import { test, expect } from '@playwright/test';

test.describe('Modal #716 - displayDirective show scrollbar on first open', () => {
    test('scrollbar shows on first open with displayDirective show', async ({ page }) => {
        await page.goto('/components/modal/index');

        await page.getByRole('button', { name: 'displayDirective: show' }).click();

        const modalBody = page.locator('.fes-modal-body');
        await expect(modalBody).toBeVisible();

        const overflowStyle = await modalBody.evaluate((el) => {
            return window.getComputedStyle(el).overflow;
        });

        expect(overflowStyle).toMatch(/(auto|scroll)/);
    });
});