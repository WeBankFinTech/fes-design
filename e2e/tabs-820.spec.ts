import { test, expect } from '@playwright/test';
import path from 'path';

test('tabs-820 no height jump when switching (v-show)', async ({ page }) => {
    const filePath = path.join(__dirname, '../docs/.vitepress/components/tabs/common.vue');
    await page.goto(`file://${filePath}`);

    await page.waitForTimeout(1000);

    const tabs = page.locator('.f-tabs-tab');
    await expect(tabs).toHaveCount(3);

    const firstTab = tabs.nth(0);
    const secondTab = tabs.nth(1);

    await firstTab.click();
    await page.waitForTimeout(300);

    const contentBox = page.locator('.tab-content').first();
    const heightBefore = await contentBox.evaluate((el) => el.getBoundingClientRect().height);

    await secondTab.click();
    await page.waitForTimeout(300);

    const heightAfter = await contentBox.evaluate((el) => el.getBoundingClientRect().height);

    expect(heightBefore).toBe(heightAfter);
});