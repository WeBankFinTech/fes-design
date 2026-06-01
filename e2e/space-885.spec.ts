import { test, expect } from '@playwright/test';

test('Space renders with display grid on docs page #885', async ({ page }) => {
    await page.goto('/zh/components/space/');

    const spaceElement = page.locator('.fes-space').first();
    await expect(spaceElement).toBeVisible({ timeout: 30000 });

    const display = await spaceElement.evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe('grid');
});