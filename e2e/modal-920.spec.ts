import { test, expect } from '@playwright/test';

test.describe('modal-920: word-break fix e2e', () => {
    const longText = '这是一段非常长的没有任何空格的文字用于测试wordbreak是否生效这只股票代码是SH600000SH600000SH600000SH600000SH600000SH600000';

    test('modal body should not have horizontal scrollbar when content has no spaces', async ({ page }) => {
        await page.goto('/components/modal/');

        const openButton = page.locator('button:has-text("常规")');
        await openButton.click();

        await page.waitForSelector('.fes-modal-wrapper', { state: 'visible' });

        const modalBody = page.locator('.fes-modal-body');

        await page.evaluate((el: HTMLElement) => {
            el.innerHTML = `<div style="width: 300px; overflow: hidden;">${longText}</div>`;
        }, await modalBody.elementHandle());

        await page.waitForTimeout(500);

        const hasHorizontalScroll = await page.evaluate(() => {
            const body = document.querySelector('.fes-modal-body');
            return body ? body.scrollWidth > body.clientWidth : false;
        });

        expect(hasHorizontalScroll).toBe(false);

        const modalCloseBtn = page.locator('.fes-modal-close');
        if (await modalCloseBtn.isVisible()) {
            await modalCloseBtn.click();
        }
    });

    test('modal wrapper should have overflow hidden', async ({ page }) => {
        await page.goto('/components/modal/');

        const openButton = page.locator('button:has-text("常规")');
        await openButton.click();

        await page.waitForSelector('.fes-modal-wrapper', { state: 'visible' });

        const modalWrapper = page.locator('.fes-modal-wrapper');

        const overflowStyle = await page.evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).overflow;
        }, await modalWrapper.elementHandle());

        expect(overflowStyle).toBe('hidden');
    });
});