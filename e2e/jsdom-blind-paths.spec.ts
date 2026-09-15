import { expect, test } from '@playwright/test';

// jsdom 盲区兜底（单测注释中标记的 e2e 项）：
// 1. virtual-list resized 链（ResizeObserver 真实回调）
// 2. scrollbar 拖拽 scrollTop 回写（真实布局链 offsetRatio）
// 3. selectCascader visibleChange（真实 Popper 打开驱动）

test.describe('jsdom 盲区 · 真实浏览器验证', () => {
    test('virtual-list：真实高度渲染 + 滚动切换可见项（resized 链）', async ({ page }) => {
        await page.goto('/zh/components/virtualList.html');
        // 等待虚拟列表容器渲染（RO → size → 可见项计算）
        const container = page.locator('.fes-virtual-list-container').first();
        await expect(container).toBeVisible({ timeout: 15000 });
        // 真实浏览器中条目有非零高度（jsdom offsetHeight 恒 0 的盲区）
        const firstItem = container.locator('> *').first();
        await expect(firstItem).toBeVisible();
        const height = await firstItem.evaluate((el) => el.offsetHeight);
        expect(height).toBeGreaterThan(0);
        // 滚动到底部：可见内容随 scrollTop 变化（resized/滚动链路真实工作）
        const beforeText = await container.innerText();
        await container.evaluate((el) => {
            el.scrollTop = el.scrollHeight;
        });
        await page.waitForTimeout(300);
        const afterText = await container.innerText();
        expect(afterText).not.toBe(beforeText);
    });

    test('scrollbar：拖拽 thumb 回写 scrollTop（真实布局）', async ({ page }) => {
        await page.goto('/zh/components/scrollbar.html');
        await page.waitForTimeout(500);
        // 页面有多个 scrollbar 实例：定位「内容真实可滚动」的那个
        const roots = page.locator('.fes-scrollbar');
        const total = await roots.count();
        let idx = -1;
        for (let i = 0; i < total; i++) {
            const c = roots.nth(i).locator('.fes-scrollbar-container');
            const ok = await c.evaluate(
                (el) => el.scrollHeight > el.clientHeight + 10,
            );
            if (ok) {
                idx = i;
                break;
            }
        }
        expect(idx).toBeGreaterThanOrEqual(0);
        const root = roots.nth(idx);
        const container = root.locator('.fes-scrollbar-container');
        const before = await container.evaluate((el) => el.scrollTop);
        // hover 容器唤出 track/thumb（always:false 默认 hover 显示）
        await container.hover();
        // 作用域限定到同一实例的纵向 thumb（全局 first 可能命中别的实例）
        const thumb = root.locator(
            '.fes-scrollbar-track.is-vertical .fes-scrollbar-track-thumb',
        );
        await expect(thumb).toBeVisible({ timeout: 5000 });
        const box = await thumb.boundingBox();
        expect(box).toBeTruthy();
        // mousedown thumb → mousemove 下移 → mouseup：scrollTop 回写 >0
        await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await page.mouse.down();
        await page.mouse.move(
            box!.x + box!.width / 2,
            box!.y + box!.height / 2 + 80,
            { steps: 5 },
        );
        await page.mouse.up();
        await page.waitForTimeout(200);
        const after = await container.evaluate((el) => el.scrollTop);
        expect(after).toBeGreaterThan(before);
    });

    test('selectCascader：点击触发器打开面板（visibleChange 真实驱动）', async ({ page }) => {
        await page.goto('/zh/components/selectCascader.html');
        // 触发器为 SelectTrigger 根
        const trigger = page.locator('.fes-select-trigger').first();
        await expect(trigger).toBeVisible({ timeout: 15000 });
        // 面板为 Popper 预渲染 + v-show：以可见性断言（count 恒定）
        const panel = page.locator('.fes-cascader').first();
        await expect(panel).not.toBeVisible();
        await trigger.click();
        // 真实 Popper 打开 → isOpened=true → visibleChange(true)
        await expect(panel).toBeVisible({ timeout: 5000 });
        // 再次点击收起（toggle 语义）
        await trigger.click();
        await expect(panel).not.toBeVisible({ timeout: 5000 });
    });
});
