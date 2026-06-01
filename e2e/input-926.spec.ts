import { test, expect } from '@playwright/test';

test('input prefix/suffix vertical alignment is consistent', async ({ page }) => {
    await page.goto('/zh/components/input/');

    const prefixEls = page.locator('.fes-input-inner-prefix');
    const suffixEls = page.locator('.fes-input-inner-suffix');

    await expect(prefixEls.first()).toBeVisible();
    await expect(suffixEls.first()).toBeVisible();

    const prefixStyle = await prefixEls.first().evaluate(
        (el) => getComputedStyle(el).verticalAlign,
    );
    const suffixStyle = await suffixEls.first().evaluate(
        (el) => getComputedStyle(el).verticalAlign,
    );

    expect(prefixStyle).toBe('middle');
    expect(suffixStyle).toBe('middle');
});