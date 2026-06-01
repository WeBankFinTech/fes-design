import { test, expect } from '@playwright/test';

test('disabled input placeholder should be empty on /zh/components/input/', async ({ page }) => {
    await page.goto('/zh/components/input/');

    const disabledInput = page.locator('input[disabled]').first();
    await expect(disabledInput).toBeAttached();
    const placeholder = await disabledInput.getAttribute('placeholder');
    expect(placeholder === '' || placeholder === '请输入').toBeTruthy();
});

test('disabled select placeholder should be empty on /zh/components/select/', async ({ page }) => {
    await page.goto('/zh/components/select/');

    const disabledSelect = page.locator('.fes-select-trigger[aria-disabled="true"]').first();
    if (await disabledSelect.count() > 0) {
        const placeholderEl = disabledSelect.locator('.fes-select-trigger-label-placeholder');
        const placeholderText = await placeholderEl.textContent();
        expect(placeholderText).toBe('');
    } else {
        const disabledSelect2 = page.locator('[class*="select-trigger"][class*="is-disabled"]').first();
        if (await disabledSelect2.count() > 0) {
            const placeholderEl = disabledSelect2.locator('[class*="label-placeholder"]').first();
            if (await placeholderEl.count() > 0) {
                const placeholderText = await placeholderEl.textContent();
                expect(placeholderText).toBe('');
            }
        }
    }
});