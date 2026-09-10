import { expect, test } from '@playwright/test';

// Input 粘贴超长提示：
// 1) 粘贴超过 maxlength 的文本 -> 原生截断为 100 字 + FMessage.warning 提示
// 2) 程序赋值超长 -> 字数统计自动显示并标红（is-exceed）
// 文档「Input > 粘贴超长提示」demo：pasteExceed.vue
// 注意：demo 的 class 经 attrs 透传到 FInput 根元素（div.fes-input）上

test('粘贴超长内容被截断为 maxlength 并弹出提示', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['clipboard-write', 'clipboard-read'],
    });
    const page = await context.newPage();
    await page.goto('/zh/components/input.html');

    // demo 第一个输入框
    const demoRoot = page.locator('div.fes-input.paste-exceed-demo').first();
    const input = demoRoot.locator('input');
    await input.waitFor({ state: 'visible', timeout: 60_000 });
    await input.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.press('Backspace');
    await expect(input).toHaveValue('');

    // 通过真实剪贴板 + Ctrl/Cmd+V 粘贴 120 字符（超过 maxlength=100）
    const longText = 'a'.repeat(120);
    await page.evaluate((text) => navigator.clipboard.writeText(text), longText);
    await input.focus();
    await page.keyboard.press('ControlOrMeta+v');

    // 真实浏览器由原生 maxlength 完成截断，输入框值为 100 个字符
    await expect(input).toHaveValue('a'.repeat(100), { timeout: 15_000 });

    // FMessage.warning 弹出提示
    await expect(
        page
            .locator('.fes-message')
            .filter({ hasText: '超出 100 字限制' }),
    ).toBeVisible({ timeout: 10_000 });
    await context.close();
});

test('程序赋值超长时计数自动显示并标红', async ({ page }) => {
    await page.goto('/zh/components/input.html');

    // demo 第二个输入框由程序赋值 120 字符（原生 maxlength 拦不住程序赋值）
    const wrapper = page.locator('div.fes-input.paste-exceed-demo').nth(1);
    await wrapper.waitFor({ state: 'visible', timeout: 60_000 });

    // 计数自动显示且标红
    const count = wrapper.locator('.fes-input-count');
    await expect(count).toBeVisible();
    await expect(count).toHaveText(/120\/100/);
    await expect(count).toHaveClass(/is-exceed/);

    // 颜色为 danger 色 #ff4d4f
    const color = await count.evaluate(
        (element) => getComputedStyle(element).color,
    );
    expect(color).toBe('rgb(255, 77, 79)');
});
