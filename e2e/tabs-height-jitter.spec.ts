import { expect, test } from '@playwright/test';

// Issue #820: Tabs 切换时 tab content 高度抖动
// 现象：TransitionGroup 离场动画期间旧 pane 仍占据文档流，与入场 pane 叠加
// 导致 .fes-tabs-tab-pane-wrapper 高度瞬时翻倍（60 → 120 → 60）
// 修复：离场动画期间对旧 pane 应用 position: absolute，使其脱离文档流

const DOC_URL = '/zh/components/tabs.html';

async function measureHeightSequence(page: any) {
    return page.evaluate(async () => {
        const tabs = Array.from(document.querySelectorAll('.fes-tabs'));
        const target = tabs.find((t) => t.textContent.includes('T恤'));
        if (!target) {
            return { error: '未找到 common demo tabs' };
        }
        const wrapper = target.querySelector('.fes-tabs-tab-pane-wrapper');
        const samples: { label: string; h: number }[] = [];
        const sample = (label: string) =>
            samples.push({ label, h: Math.round(wrapper.getBoundingClientRect().height) });
        sample('初始');
        const tabBtns = target.querySelectorAll('.fes-tabs-tab');
        const next = Array.from(tabBtns).find((b) => b.textContent.includes('卫衣'));
        if (!next) {
            return { error: '未找到目标 tab' };
        }
        (next as HTMLElement).click();
        for (let i = 0; i < 14; i++) {
            await new Promise((r) => setTimeout(r, 50));
            sample(`+${(i + 1) * 50}ms`);
        }
        return { samples };
    });
}

test('tabs 切换时容器高度不发生瞬时翻倍 (#820)', async ({ page }) => {
    await page.goto(DOC_URL);
    await page.locator('.fes-tabs').first().waitFor({ state: 'visible', timeout: 60_000 });

    const { samples, error } = await measureHeightSequence(page);
    expect(error).toBeUndefined();

    const heights = samples.map((s) => s.h);
    const initial = heights[0];
    const peak = Math.max(...heights);

    // 修复前：离场 pane 叠加 → 高度 60→120（翻倍）；修复后：高度保持 60（或至多 ±2px 测量误差）
    expect(peak).toBeLessThanOrEqual(initial + 2);
});

test('tabs 切换动画结束后内容正确显示 (#820 回归守护)', async ({ page }) => {
    await page.goto(DOC_URL);
    await page.locator('.fes-tabs').first().waitFor({ state: 'visible', timeout: 60_000 });

    const result = await page.evaluate(async () => {
        const tabs = Array.from(document.querySelectorAll('.fes-tabs'));
        const target = tabs.find((t) => t.textContent.includes('T恤'));
        if (!target) {
            return { error: '未找到 demo' };
        }
        const tabBtns = target.querySelectorAll('.fes-tabs-tab');
        (Array.from(tabBtns).find((b) => b.textContent.includes('卫衣')) as HTMLElement).click();
        await new Promise((r) => setTimeout(r, 800));
        const wrapper = target.querySelector('.fes-tabs-tab-pane-wrapper');
        const visiblePanes = Array.from(wrapper.querySelectorAll(':scope > .fes-tabs-tab-pane'))
            .filter((p) => getComputedStyle(p).display !== 'none');
        return {
            visibleCount: visiblePanes.length,
            text: visiblePanes.map((p) => p.textContent.trim()).join(','),
        };
    });
    expect(result.error).toBeUndefined();
    // 动画结束后恰好一个可见 pane，且内容正确
    expect(result.visibleCount).toBe(1);
    expect(result.text).toContain('卫衣');
});
