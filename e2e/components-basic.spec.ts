import { expect, test } from '@playwright/test';

// 组件文档页渲染冒烟：页面可加载、组件根节点渲染、无页面级错误

const PAGES: { url: string; root: string }[] = [
    { url: '/zh/components/button.html', root: '.fes-btn' },
    { url: '/zh/components/alert.html', root: '.fes-alert' },
    { url: '/zh/components/input.html', root: '.fes-input' },
    { url: '/zh/components/select.html', root: '.fes-select' },
    { url: '/zh/components/checkbox.html', root: '.fes-checkbox' },
    { url: '/zh/components/radio.html', root: '.fes-radio' },
    { url: '/zh/components/switch.html', root: '.fes-switch' },
    { url: '/zh/components/modal.html', root: '.fes-btn' },
    { url: '/zh/components/drawer.html', root: '.fes-btn' },
    { url: '/zh/components/table.html', root: '.fes-table' },
    { url: '/zh/components/form.html', root: '.fes-form' },
    { url: '/zh/components/datePicker.html', root: '.fes-input-inner' },
    { url: '/zh/components/tree.html', root: '.fes-tree' },
    { url: '/zh/components/menu.html', root: '.fes-menu' },
    { url: '/zh/components/tabs.html', root: '.fes-tabs' },
    { url: '/zh/components/pagination.html', root: '.fes-pagination' },
    { url: '/zh/components/upload.html', root: '.fes-btn' },
    { url: '/zh/components/transfer.html', root: '.fes-transfer' },
    { url: '/zh/components/cascader.html', root: '.fes-cascader' },
    { url: '/zh/components/tooltip.html', root: '.fes-btn' },
    { url: '/zh/components/tag.html', root: '.fes-tag' },
    { url: '/zh/components/progress.html', root: '.fes-progress' },
    { url: '/zh/components/rate.html', root: '.fes-rate' },
    { url: '/zh/components/steps.html', root: '.fes-steps' },
    { url: '/zh/components/card.html', root: '.fes-card' },
    { url: '/zh/components/empty.html', root: '.fes-empty' },
    { url: '/zh/components/badge.html', root: '.fes-badge' },
    { url: '/zh/components/avatar.html', root: '.fes-avatar' },
    { url: '/zh/components/layout.html', root: '.fes-layout' },
    { url: '/zh/components/grid.html', root: '.fes-grid' },
    { url: '/zh/components/timePicker.html', root: '.fes-input-inner' },
    { url: '/zh/components/collapse.html', root: '.fes-collapse' },
    { url: '/zh/components/carousel.html', root: '.fes-carousel' },
    { url: '/zh/components/timeline.html', root: '.fes-timeline' },
    { url: '/zh/components/descriptions.html', root: '.fes-descriptions' },
    { url: '/zh/components/skeleton.html', root: '.fes-skeleton' },
    { url: '/zh/components/space.html', root: '.fes-space' },
    { url: '/zh/components/spin.html', root: '.fes-spin' },
    { url: '/zh/components/divider.html', root: '.fes-divider' },
    { url: '/zh/components/link.html', root: '.fes-link' },
];

test.describe('组件文档页渲染冒烟', () => {
    for (const { url, root } of PAGES) {
        test(`页面渲染：${url}`, async ({ page }) => {
            const response = await page.goto(url);
            expect(response?.status()).toBe(200);
            // 等待异步组件加载完成
            await page
                .locator('.component-doc')
                .first()
                .waitFor({ state: 'visible', timeout: 60_000 });
            const count = await page.locator(root).count();
            expect(count, `${url} 应渲染出 ${root}`).toBeGreaterThan(0);
        });
    }
});
