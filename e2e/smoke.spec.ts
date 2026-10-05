import { test, expect } from '@playwright/test'

test('docs site loads and renders hero', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Fes/)
    await expect(page.getByRole('heading', { name: 'Fes Design' })).toBeVisible()
    await expect(page.getByRole('link', { name: '快速开始' })).toBeVisible()
})
