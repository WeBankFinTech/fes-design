# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: datehour-913.spec.ts >> datehour picker >> time picker shows hours and minutes without seconds
- Location: e2e/datehour-913.spec.ts:4:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.f-date-picker').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('.f-date-picker').first()

```

```yaml
- link "Skip to content":
  - /url: "#VPContent"
- banner:
  - link "Fes Design":
    - /url: /
  - button "Search": Search ⌘ K
  - navigation "Main Navigation":
    - text: Main Navigation
    - link "文档":
      - /url: /zh/guide/quick-start.html
    - link "组件":
      - /url: /zh/components/button.html
    - button "v0.8.85"
    - button "生态"
  - link "github":
    - /url: https://github.com/WeBankFinTech/fes-design
- paragraph: "404"
- heading "PAGE NOT FOUND" [level=1]
- blockquote: But if you don't change your direction, and if you keep looking, you may end up where you are heading.
- link "go to home":
  - /url: /
  - text: Take me home
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('datehour picker', () => {
  4  |     test('time picker shows hours and minutes without seconds', async ({ page }) => {
  5  |         await page.goto('/zh/components/date-picker/');
  6  |         await page.waitForLoadState('networkidle');
  7  | 
  8  |         const datehourDemo = page.locator('.f-date-picker').first();
> 9  |         await expect(datehourDemo).toBeVisible({ timeout: 15000 });
     |                                    ^ Error: expect(locator).toBeVisible() failed
  10 |         await datehourDemo.click();
  11 | 
  12 |         const columns = await page.locator('.f-date-picker-popper .f-time-picker-content-cell').count();
  13 |         expect(columns).toBe(2);
  14 |     });
  15 | });
```