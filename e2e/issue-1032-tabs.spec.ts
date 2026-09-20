import { type Page, expect, test } from '@playwright/test';

// Issue #1032: FTabPane 孤儿（脱离 FTabs）挂载产生空渲染与脏类名污染
// 病灶：tab-pane.vue 的 setup 在 if (!FTab) 分支直接 `return console.error(...)`，
// console.error 的返回值（undefined）被当作 setup 返回值 → 模板拿不到 prefixCls，
// 渲染退化为 undefined-tab-pane 脏 class；孤儿 FTabPane 从未有可用渲染。
// 修复：先 console.error 告警一次，再 `return () => null` 熔断空渲染，
// 跳过模板 prefixCls 引用，孤儿 FTabPane 不再产生 undefined-tab-pane 类。
//
// 本文件验证（真实浏览器，docs 渲染链路）：
// 1) FTabPane 在 FTabs 内正常渲染——标签点击切换后激活内容正确变化（无回归）；
// 2) 页面任意位置不存在 .undefined-tab-pane 污染（孤儿脏类名被修复消除）；
// 3) 全页无 pageerror / console.error 运行错误（剔除 favicon/资源 404）。
// 孤儿 FTabPane「恰好告警一次 + 空渲染」的精确行为由单测
// components/tabs/__tests__/tab-pane-branches.spec.ts 锁定，此处不做重复。

const DOC_URL = '/zh/components/tabs.html';

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

// 剔除 favicon/资源 404 噪音，仅保留真实运行错误
const runErrors = (errors: string[]) =>
    errors.filter((e) => !e.includes('favicon') && !e.includes('404'));

// common demo（common.vue）是唯一满足以下条件的 FTabs：
// 非 card（:not(.fes-tabs-card)）、面板内容带 .tab-content（排除 panes/withIcon/
// position/extend/closable）、含「卫衣」标签、且无禁用 tab（排除 disabled.vue）。
async function locateCommonDemo(page: Page) {
    return page
        .locator('.fes-tabs:not(.fes-tabs-card)')
        .filter({ has: page.locator('.fes-tabs-tab-pane-wrapper .tab-content') })
        .filter({ hasText: '卫衣' })
        .filter({ hasNot: page.locator('.fes-tabs-tab-disabled') })
        .first();
}

test('#1032 FTabPane 在 FTabs 内正常渲染：点击标签切换激活内容', async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(DOC_URL);
    expect(response?.status(), `${DOC_URL} 应 200`).toBe(200);
    await page
        .locator('.component-doc')
        .first()
        .waitFor({ state: 'visible', timeout: 60_000 });

    const common = await locateCommonDemo(page);
    await common.waitFor({ state: 'visible', timeout: 30_000 });

    const activeLabel = () => common.locator('.fes-tabs-tab-active .fes-tabs-tab-label');
    // 可见面板 = 非 display:none 的 .fes-tabs-tab-pane（show 指令的面板 v-show 隐藏）
    const visiblePaneTexts = () =>
        common.locator('.fes-tabs-tab-pane').evaluateAll((els) =>
            els
                .filter((el) => getComputedStyle(el).display !== 'none')
                .map((el) => el.textContent?.trim() ?? ''),
        );

    // 初始：T恤 激活，唯一可见面板内容为 T恤
    await expect(activeLabel()).toHaveText('T恤');
    await expect.poll(visiblePaneTexts).toEqual(['T恤']);

    // 点击「卫衣啊卫衣」标签：激活标签切换，可见面板内容变为 卫衣
    await common.locator('.fes-tabs-tab').filter({ hasText: '卫衣' }).click();
    await expect(activeLabel()).toHaveText('卫衣啊卫衣');
    await expect.poll(visiblePaneTexts).toEqual(['卫衣']);

    // 再点击「衬衫」标签：激活标签切换，可见面板内容变为 衬衫
    await common.locator('.fes-tabs-tab').filter({ hasText: '衬衫' }).click();
    await expect(activeLabel()).toHaveText('衬衫');
    await expect.poll(visiblePaneTexts).toEqual(['衬衫']);

    // 页面无运行错误（剔除 favicon/404）
    expect(runErrors(errors), '#1032 修复涉 tabs 页不应有未捕获异常/console.error').toEqual([]);
});

test('#1032 回归守护：tabs 文档页无 undefined-tab-pane 脏类名污染且无运行错误', async ({
    page,
}) => {
    const errors = collectErrors(page);
    const response = await page.goto(DOC_URL);
    expect(response?.status(), `${DOC_URL} 应 200`).toBe(200);
    await page
        .locator('.component-doc')
        .first()
        .waitFor({ state: 'visible', timeout: 60_000 });
    // 等待异步组件与 demo 渲染稳定
    await page.waitForTimeout(1200);

    // 存量 demo 全部渲染（tabs 页有多块 .fes-tabs 文档 demo）
    expect(await page.locator('.fes-tabs').count()).toBeGreaterThan(0);

    // #1032 修复前：孤儿 FTabPane 退化为 undefined-tab-pane 脏类名；
    // 修复后熔断空渲染，页面任何位置都不应再出现该污染类名
    expect(
        await page.locator('.undefined-tab-pane').count(),
        '页面不应存在 undefined-tab-pane 脏类名（#1032）',
    ).toBe(0);

    // 页面级错误剔除 favicon/资源 404（仅保留运行错误）
    expect(runErrors(errors), 'tabs 页不应有未捕获异常/console.error').toEqual([]);
});
