import { test, expect } from '@playwright/test';

test.describe('input size feature #884', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/zh/components/input/');
    });

    test('size demo shows small inputs with smaller heights', async ({ page }) => {
        await page.click('text=尺寸');
        await page.waitForSelector('.fes-input-inner-size-small', { timeout: 10000 });

        const smallInput = page.locator('.fes-input-inner-size-small').first();
        const mediumInput = page.locator('.fes-input-inner').first();

        await expect(smallInput).toBeVisible();
        await expect(mediumInput).toBeVisible();

        const smallBox = await smallInput.boundingBox();
        const mediumBox = await mediumInput.boundingBox();

        expect(smallBox.height).toBeLessThan(mediumBox.height);
        expect(smallBox.height).toBeCloseTo(24, 2);
        expect(mediumBox.height).toBeCloseTo(32, 2);
    });

    test('select trigger size small class is applied', async ({ page }) => {
        await page.click('text=尺寸');
        await page.waitForSelector('.fes-select-trigger-size-small', { timeout: 10000 });

        const smallSelectTrigger = page.locator('.fes-select-trigger-size-small').first();
        await expect(smallSelectTrigger).toBeVisible();

        const smallBox = await smallSelectTrigger.boundingBox();
        expect(smallBox.height).toBeLessThan(40);
    });
});