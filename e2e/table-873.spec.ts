import { test, expect } from '@playwright/test';

test.describe('table-873: offsetWidth=0 fix e2e', () => {
    test('should have no console errors when table common demo renders', async ({ page }) => {
        const consoleErrors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        page.on('pageerror', (err) => {
            consoleErrors.push(err.message);
        });

        await page.goto('/zh/components/table');

        await page.waitForLoadState('networkidle');

        const filteredErrors = consoleErrors.filter(
            (err) => !err.includes('[Vue warn]'),
        );

        expect(filteredErrors).toHaveLength(0);
    });

    test('should have no console errors when modal common demo renders', async ({ page }) => {
        const consoleErrors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        page.on('pageerror', (err) => {
            consoleErrors.push(err.message);
        });

        await page.goto('/zh/components/modal');

        await page.waitForLoadState('networkidle');

        const filteredErrors = consoleErrors.filter(
            (err) => !err.includes('[Vue warn]'),
        );

        expect(filteredErrors).toHaveLength(0);
    });
});