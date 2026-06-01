import { test, expect } from '@playwright/test';

test.describe('table minWidth fix e2e', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/table/bordered');
    });

    test('column min-widths are respected when table is narrow', async ({ page }) => {
        const table = page.locator('.fes-table');
        await expect(table).toBeVisible();

        const cols = page.locator('.fes-table-body col');
        const colCount = await cols.count();
        expect(colCount).toBeGreaterThan(0);

        const firstCol = cols.first();
        const style = await firstCol.getAttribute('style');

        if (style && style.includes('minWidth')) {
            const minWidthMatch = style.match(/minWidth:\s*(\d+)px/);
            expect(minWidthMatch).not.toBeNull();
            const minWidth = parseInt(minWidthMatch[1], 10);
            expect(minWidth).toBeGreaterThan(0);
        }
    });

    test('horizontal scroll is enabled with many narrow columns', async ({ page }) => {
        const tableWrapper = page.locator('.fes-table-body-wrapper');
        await expect(tableWrapper).toBeVisible();

        const hasHorizontalScrollbar = await page.evaluate(() => {
            const wrapper = document.querySelector('.fes-table-body-wrapper');
            if (!wrapper) return false;
            const scrollbar = wrapper.querySelector('.fes-scrollbar');
            if (scrollbar) return true;
            return wrapper.scrollWidth > wrapper.clientWidth;
        });

        expect(hasHorizontalScrollbar).toBeTruthy();
    });
});