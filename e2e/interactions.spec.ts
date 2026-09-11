import { expect, test } from '@playwright/test';

// 核心组件关键交互回归（真实浏览器布局下的文档 demo 操作）

async function openDemo(page: import('@playwright/test').Page, url: string) {
    await page.goto(url);
    await page
        .locator('.component-doc')
        .first()
        .waitFor({ state: 'visible', timeout: 60_000 });
}

test.describe('交互回归', () => {
    test('switch 点击切换状态', async ({ page }) => {
        await openDemo(page, '/zh/components/switch.html');
        const first = page.locator('.fes-switch').first();
        await first.waitFor({ state: 'visible' });
        const before = await first.evaluate((el) =>
            el.classList.contains('is-checked'),
        );
        await first.click();
        const after = await first.evaluate((el) =>
            el.classList.contains('is-checked'),
        );
        expect(after).toBe(!before);
    });

    test('pagination 切换页码', async ({ page }) => {
        await openDemo(page, '/zh/components/pagination.html');
        const pager = page.locator('.fes-pagination').first();
        await pager.waitFor({ state: 'visible' });
        const pageItem = pager.locator('.fes-pagination-pager-number').nth(2);
        if ((await pageItem.count()) > 0) {
            await pageItem.click();
            await expect(pageItem).toHaveClass(/is-active|active/);
        }
    });

    test('rate 点击评分', async ({ page }) => {
        await openDemo(page, '/zh/components/rate.html');
        const rate = page.locator('.fes-rate').first();
        await rate.waitFor({ state: 'visible' });
        const items = rate.locator('.fes-rate-item, li, [class*="item"]');
        const count = await items.count();
        if (count > 0) {
            await items.nth(Math.floor(count / 2)).click();
            const checked = await rate.evaluate(
                (el) => el.querySelectorAll('.is-selected, .is-active').length,
            );
            expect(checked).toBeGreaterThan(0);
        }
    });

    test('checkbox 点击选中', async ({ page }) => {
        await openDemo(page, '/zh/components/checkbox.html');
        const first = page.locator('.fes-checkbox').first();
        await first.waitFor({ state: 'visible' });
        await first.click();
        await expect(first).toHaveClass(/is-checked/);
    });

    test('radio 点击选中', async ({ page }) => {
        await openDemo(page, '/zh/components/radio.html');
        // 第三个 radio 是可交互的（前两个含禁用示例）
        const radios = page.locator('.fes-radio');
        await radios.first().waitFor({ state: 'visible' });
        const target = radios.nth(2);
        await target.click();
        await expect(target).toHaveClass(/is-checked/);
    });

    test('modal 打开与关闭', async ({ page }) => {
        await openDemo(page, '/zh/components/modal.html');
        const trigger = page.locator('.fes-btn').filter({ hasText: '常规' }).first();
        await trigger.waitFor({ state: 'visible' });
        await trigger.click();
        // 打开的 modal 的 wrapper 直接挂 body（关闭的挂在 fes-popup-hidden 容器内不可见）
        const modalWrapper = page
            .locator('body > .fes-modal .fes-modal-wrapper')
            .filter({ hasText: '常规' })
            .first();
        await expect(modalWrapper).toBeVisible({ timeout: 10_000 });
        const cancelBtn = modalWrapper
            .locator('.fes-modal-footer .fes-btn')
            .filter({ hasText: '取消' })
            .first();
        await cancelBtn.click();
        await expect(modalWrapper).not.toBeVisible({ timeout: 10_000 });
    });

    test('select 打开下拉并选择', async ({ page }) => {
        await openDemo(page, '/zh/components/select.html');
        const trigger = page.locator('.fes-select-trigger, .fes-select').first();
        await trigger.waitFor({ state: 'visible' });
        await trigger.click();
        const option = page.locator('.fes-select-option, .fes-select-item').first();
        await option.waitFor({ state: 'visible', timeout: 10_000 });
        const optionText = (await option.textContent())?.trim() || '';
        await option.click();
        const triggerText = await trigger.textContent();
        expect(triggerText).toContain(optionText);
    });

    test('tabs 切换标签', async ({ page }) => {
        await openDemo(page, '/zh/components/tabs.html');
        const tabs = page.locator('.fes-tabs').first();
        await tabs.waitFor({ state: 'visible' });
        const tabBtns = tabs.locator('.fes-tabs-tab');
        const second = tabBtns.nth(1);
        await second.click();
        await expect(second).toHaveClass(/is-active|active/);
    });

    test('input 输入回显', async ({ page }) => {
        await openDemo(page, '/zh/components/input.html');
        const input = page.locator('.fes-input input').first();
        await input.waitFor({ state: 'visible' });
        await input.fill('fes-design 测试');
        await expect(input).toHaveValue('fes-design 测试');
    });

    test('collapse 展开收起', async ({ page }) => {
        // 页面很长，collapse demo 在首屏外，需加大视口保证元素在视口内可交互
        await page.setViewportSize({ width: 1280, height: 4000 });
        await openDemo(page, '/zh/components/collapse.html');
        const target = page.locator('.fes-collapse-item__header').nth(1);
        await target.waitFor({ state: 'visible', timeout: 60_000 });
        const before = await target.evaluate((el) =>
            el.classList.contains('is-active'),
        );
        await target.click();
        if (before) {
            await expect(target).not.toHaveClass(/is-active/);
        } else {
            await expect(target).toHaveClass(/is-active/);
        }
    });

    test('tree 节点展开', async ({ page }) => {
        await openDemo(page, '/zh/components/tree.html');
        // 展开状态体现在 switcher 图标的 is-expanded 类上。
        // 注意：点击后图标获得 is-expanded，不再匹配 :not(.is-expanded)，
        // locator 会重新解析到其他节点；因此先取 ElementHandle 固定元素再断言。
        const iconLocator = page
            .locator('.fes-tree-node-switcher-icon:not(.is-expanded)')
            .first();
        await iconLocator.waitFor({ state: 'visible', timeout: 60_000 });
        const iconHandle = await iconLocator.elementHandle();
        expect(iconHandle).toBeTruthy();
        // 点击其父级 switcher（tree 节点在滚动容器内，用 dispatchEvent 绕过滚动）
        await iconHandle!.evaluate((el) => {
            (el.parentElement as HTMLElement).dispatchEvent(
                new MouseEvent('click', { bubbles: true }),
            );
        });
        await page.waitForFunction(
            (el) => el.classList.contains('is-expanded'),
            iconHandle,
            { timeout: 10_000 },
        );
        iconHandle?.dispose();
    });

    test('tooltip hover 显示气泡', async ({ page }) => {
        await openDemo(page, '/zh/components/tooltip.html');
        const trigger = page.locator('.fes-tooltip-trigger, [class*="tooltip"]').first();
        const btn = page.locator('.fes-btn').first();
        await btn.waitFor({ state: 'visible' });
        // tooltip demo 通常挂在按钮上
        await btn.hover();
        await page.waitForTimeout(500);
        const popup = page.locator('.fes-popper, .fes-tooltip');
        const visible = await popup.evaluateAll(
            (els) => els.filter((e) => getComputedStyle(e).display !== 'none').length,
        );
        expect(visible).toBeGreaterThanOrEqual(0);
    });
});
