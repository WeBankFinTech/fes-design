import { expect, test } from '@playwright/test';

// #1029 回归：修复 TimePicker 在 Vue 3.5 下的递归更新问题后，
// 验证文档页所有 demo 的存量交互行为（真实浏览器、真实 Transition）。

test.describe('TimePicker 文档 demo 交互', () => {
    test('基础 demo：打开面板并选择时间', async ({ page }) => {
        await page.goto('/zh/components/timePicker.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        // 基础 demo（common.vue）：受控 modelValue="22:22:22"，control 默认显示
        const input = page.locator('.fes-input-inner input').first();
        await expect(input).toHaveValue('22:22:22');

        // 点击打开面板
        await input.click();
        const dropdown = page.locator('.fes-time-picker-dropdown').first();
        await expect(dropdown).toBeVisible();

        // 三列选项渲染（时/分/秒）
        const items = dropdown.locator('.fes-time-picker-content-item');
        await expect(items).toHaveCount(3);

        // 点击小时列 01（可选项）
        await dropdown.locator('li[data-key="01"]').first().click();
        // 控制区存在（默认 control=true）
        await expect(
            dropdown.locator('.fes-time-picker-addon'),
        ).toBeVisible();

        // 「此刻」按钮（locale: timePicker.now）：点击后输入框变为当前
        // 时刻（HH:mm:ss），同时关闭面板（setCurrentTime → closePopper）
        await dropdown
            .getByRole('button', { name: '此刻' })
            .click();
        const nowValue = await input.inputValue();
        expect(nowValue).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        await expect(dropdown).toBeHidden();
    });

    test('control=false + disabledHours demo：点击选项不崩', async ({
        page,
    }) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (err) => pageErrors.push(String(err)));

        await page.goto('/zh/components/timePicker.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        // control.vue demo：disabledHours + :control="false"
        // 页面 demo 顺序由 index.md 决定：common(0) → addon(1) → control(2)
        const demoBlocks = page.locator('.component-doc .fes-space');
        const controlBlock = demoBlocks.nth(2);
        const input = controlBlock.locator('input');
        await input.click();

        const dropdown = page.locator('.fes-time-picker-dropdown').first();
        await expect(dropdown).toBeVisible();

        // disabledHours: hour===1 禁用 —— 01 应带 is-disabled
        const hour01 = dropdown.locator('li[data-key="01"]').first();
        await expect(hour01).toHaveClass(/is-disabled/);

        // 点击可用的小时 02
        await dropdown.locator('li[data-key="02"]').first().click();
        // control=false：无控制区
        await expect(
            dropdown.locator('.fes-time-picker-addon'),
        ).toHaveCount(0);

        // 关键回归点：不出现 Maximum recursive updates 页面错误
        await page.waitForTimeout(500);
        expect(
            pageErrors.filter((e) => e.includes('Maximum recursive')),
        ).toEqual([]);
        expect(pageErrors).toEqual([]);
    });

    test('addon 作用域插槽 demo：自定义按钮确认时间', async ({ page }) => {
        await page.goto('/zh/components/timePicker.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        // addon.vue demo：#addon 插槽 + v-model:open + confirm 回写
        // 页面顺序：common(0) → addon(1)
        const demoBlocks = page.locator('.component-doc .fes-space');
        const addonBlock = demoBlocks.nth(1);
        const input = addonBlock.locator('input');
        await input.click();

        const dropdown = page.locator('.fes-time-picker-dropdown').first();
        await expect(dropdown).toBeVisible();

        // 自定义 addon 按钮渲染（happy时刻）
        const addonBtn = dropdown.getByRole('button', { name: 'happy时刻' });
        await expect(addonBtn).toBeVisible();

        // 选择小时后点确认：activeTime 透传给插槽，confirm 回写 currentTime 并关闭
        await dropdown.locator('li[data-key="05"]').first().click();
        await addonBtn.click();
        await expect(dropdown).toBeHidden();
        await expect(input).toHaveValue(/^05:\d{2}:\d{2}$/);
    });

    test('format=HH:mm demo：两列面板', async ({ page }) => {
        await page.goto('/zh/components/timePicker.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        // format.vue demo：format="HH:mm" 只有时分两列
        const demoBlocks = page.locator('.component-doc .fes-space');
        const formatBlock = demoBlocks.nth(4);
        const formatInput = formatBlock.locator('input');
        await formatInput.click();

        const dropdown = page.locator('.fes-time-picker-dropdown').first();
        await expect(dropdown).toBeVisible();
        const items = dropdown.locator('.fes-time-picker-content-item');
        await expect(items).toHaveCount(2);

        // 选中后值应为 HH:mm 两段格式
        await dropdown.locator('li[data-key="08"]').first().click();
        await dropdown.locator('li[data-key="08"]').nth(1).click();
        await dropdown.getByRole('button', { name: '确认' }).click();
        const val = await formatInput.inputValue();
        expect(val).toMatch(/^08:0\d$/);
    });

    test('disabled demo：禁用态不可打开', async ({ page }) => {
        await page.goto('/zh/components/timePicker.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        // disabled.vue demo：两个禁用实例，点击不弹面板
        // 页面顺序：common(0) → addon(1) → control(2) → disabled(3)
        const demoBlocks = page.locator('.component-doc .fes-space');
        const disabledBlock = demoBlocks.nth(3);
        const disabledInput = disabledBlock.locator('input').first();
        // 输入框为禁用态（Playwright 对 disabled 元素的常规点击会一直重试，
        // 此处先断言禁用属性，再强制点击验证不弹面板）
        await expect(disabledInput).toBeDisabled();
        await disabledInput.click({ force: true });
        await page.waitForTimeout(300);
        const dropdowns = page.locator('.fes-time-picker-dropdown');
        await expect(dropdowns).toHaveCount(0);
    });
});
