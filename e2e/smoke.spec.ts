import { test, expect } from '@playwright/test'

test('docs site loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Fes/)
})
