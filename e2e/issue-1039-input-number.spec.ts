import { type Page, expect, test } from '@playwright/test';

// #1039 InputNumber 键盘/滚轮步进修复验证（真实浏览器 e2e，编写于主 checkout，不随本文件运行）
//
// 病灶：#1039 中 FInputNumber 仅通过键盘操作（聚焦后按 ↑/↓）不触发步进，
// 必须点按步进按钮才有 step 行为；修复后键盘上下键与滚轮默认开启步进
// （keyboard / wheel 可配置关闭，见 keyboardWheel demo）。
//
// 验证点：
//   1) 真实浏览器渲染 docs demo 页，.component-doc 出现（demo 全渲染）；
//   2) 聚焦 .fes-input-number input 按 ArrowUp → 值严格增加（键盘步进真实生效）；
//   3) 按 ArrowDown → 值回落到增加前水平（步进对称，无只增不降的回归）；
//   4) 全程无 pageerror / console.error（无运行期回归，404/favicon 等资源噪音剔除）。
//
// 说明：keyboardWheel.vue demo 已新增（含 keyboard/wheel 开关、step=0.5、初值 3），
// 但尚未挂入 index.md 的 :::demo 区块、不渲染到页面 → 优先按其占位文本定位该 demo 的
// 输入框，找不到时回退到页面首个 .fes-input-number input（common demo：autofocus、
// 初值 10、默认 step=1，10 → 11 → 10 可严格断言增减）。

// 收集页面级未捕获异常（pageerror）与 console.error，供测试末尾断言
const collectErrors = (page: Page) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
        errors.push(`PAGEERROR: ${err.message.slice(0, 200)}`);
    });
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(`CONSOLE: ${msg.text().slice(0, 200)}`);
        }
    });
    return errors;
};

test.describe('#1039 inputNumber 键盘步进修复', () => {
    test('ArrowUp 值增加 / ArrowDown 值回落，且无运行错误', async ({ page }) => {
        const errors = collectErrors(page);

        await page.goto('/zh/components/inputNumber.html');
        // demo 块渲染完成（异步组件 + 各 demo 挂载）
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        // 优先 keyboardWheel demo（#1039 新增 demo，按占位文本定位）；未挂载时回退首个输入框
        const keyboardWheelInput = page
            .locator('.fes-input-number input[placeholder*="滚轮步进"]')
            .first();
        const input
            = (await keyboardWheelInput.count()) > 0
                ? keyboardWheelInput
                : page.locator('.fes-input-number input').first();
        await input.waitFor({ state: 'visible', timeout: 30_000 });

        // 记录原值（排除无初值 demo 的空值输入框）
        const before = await input.inputValue();
        const beforeVal = Number(before);
        expect(Number.isNaN(beforeVal), `输入框应有可解析初值，实际 "${before}"`).toBe(false);

        await input.focus();
        await page.keyboard.press('ArrowUp');
        // waitFor 值变化：轮询直到数值严格大于原值（等待 v-model 更新，而非盲等）
        await expect
            .poll(async () => Number(await input.inputValue()), { timeout: 5000 })
            .toBeGreaterThan(beforeVal);
        const upVal = Number(await input.inputValue());

        await page.keyboard.press('ArrowDown');
        // 回落断言：ArrowDown 后值严格小于 ArrowUp 后的值（10→11→10 对称步进）
        await expect
            .poll(async () => Number(await input.inputValue()), { timeout: 5000 })
            .toBeLessThan(upVal);

        // 运行错误断言：剔除资源 404 / favicon 噪音，仅保留 pageerror 与 console.error
        const runErrors = errors.filter(
            (e) => !e.includes('favicon') && !e.includes('404'),
        );
        expect(runErrors, '#1039 页面不应有未捕获异常/console.error').toEqual([]);
    });
});
