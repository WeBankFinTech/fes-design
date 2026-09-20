import { type Page, expect, test } from '@playwright/test';

// ============================================================================
// #1031 FSelectGroupOption 孤儿熔断 修复验证（交互级，与 issue-fix-demos 的
// 页面级冒烟互补）：
//
// 修复内容（components/select/groupOption.tsx）：
//   FSelectGroupOption 独立挂载（inject SELECT_PROVIDE_KEY 为 null 的孤儿场景）
//   时，原本会在后续 reactive/注册链路中解构 null 抛 TypeError；修复后：
//     if (!parent) { console.warn('必须搭配 FSelect 组件使用！'); return () => null; }
//   即「告警一次 + 空渲染熔断」，孤儿场景不再抛错。
//
// 本用例只验证熔断不破坏常规用法——FSelect 内正常注册的 FSelectGroupOption
// 必须照常工作：分组标题渲染、组内项可选中、值/标签正常更新,全程无运行错误。
// 场景载体：docs/.vitepress/components/select/selectGroupOption.vue 的
// 「基础用法」示例（value1：filterable 单选 + 插槽注册 FSelectGroupOption）。
// 该 demo 是页面唯一含「基础用法」文本的块，可唯一圈定。
// ============================================================================

// 收集运行期错误（pageerror + console.error），按任务要求剔除 favicon/404 等
// 资源加载噪音，仅保留真正的 JS 运行错误。
const collectRunErrors = (page: Page) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
        errors.push(`PAGEERROR: ${err.message.slice(0, 300)}`);
    });
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            const text = msg.text();
            // 剔除 favicon / 404 / net::ERR / Failed to load resource 等资源级噪音
            if (!/favicon|404|net::ERR_|Failed to load resource/i.test(text)) {
                errors.push(`CONSOLE: ${text.slice(0, 300)}`);
            }
        }
    });
    return errors;
};

test.describe('#1031 FSelectGroupOption 孤儿熔断不破坏常规用法', () => {
    test('分组标题正常渲染，选中组内项后标签更新，无运行错误', async ({ page }) => {
        const runErrors = collectRunErrors(page);

        // 打开 docs 站 select 页面，等待 demo 渲染
        await page.goto('/zh/components/select.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 90_000 });

        // 唯一圈定 selectGroupOption demo 块（页面仅此块含「基础用法」）
        const demo = page.locator('.component-doc').filter({ hasText: '基础用法' });
        await expect(demo).toHaveCount(1, { timeout: 30_000 });
        const select = demo.first().locator('.fes-select').first();
        await expect(select).toBeVisible({ timeout: 90_000 });

        // 打开下拉：filterable 单选走 input 触发，否则点 .fes-select 触发区
        const input = select.locator('.fes-select-label-input');
        if ((await input.count()) > 0) {
            await input.click();
        } else {
            await select.locator('.fes-select-trigger').click();
        }

        // 下拉展开后，分组标题（FSelectGroupOption 正常注册的产物）必须出现——
        // 若 #1031 熔断误伤常规注册场景，此处将超时失败
        const groupHeader = page.locator('.fes-select-group-option:visible').first();
        await groupHeader.waitFor({ state: 'visible', timeout: 10_000 });
        // 首个分组为「华中地区」（demo 数据第一组，组内项可用）
        expect(await groupHeader.textContent()).toContain('华中地区');

        // 选中第一个可用组内项（华中地区 → 湖北）
        const firstOption = page.locator('.fes-select-option:visible').first();
        await firstOption.waitFor({ state: 'visible', timeout: 5_000 });
        expect(await firstOption.textContent()).toContain('湖北');
        await firstOption.click();

        // 选择后下拉关闭，触发区标签更新为「湖北」（值/标签变化断言）
        await expect(page.locator('.fes-select-dropdown:visible')).toHaveCount(0, {
            timeout: 5_000,
        });
        await expect(select.locator('.fes-select-label-text')).toContainText('湖北', {
            timeout: 5_000,
        });

        // 回归再开：分组标题依旧正常渲染，证明注册/熔断链路在交互后未被破坏
        await select.locator('.fes-select-label-input').click();
        await expect(page.locator('.fes-select-group-option:visible').first()).toContainText(
            '华中地区',
            { timeout: 5_000 },
        );
        await page.keyboard.press('Escape');

        // 全程无 JS 运行错误（已剔除 favicon/404 资源噪音）
        expect(runErrors, `收集到的运行错误: ${runErrors.join('; ')}`).toEqual([]);
    });
});
