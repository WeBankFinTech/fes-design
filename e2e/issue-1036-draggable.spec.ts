import { type Locator, type Page, expect, test } from '@playwright/test';

/**
 * #1036 v-draggable 指令输入归一化 — 真实浏览器验证
 *
 * 背景：jsdom 无布局引擎且无法模拟原生 HTML5 拖拽（mousedown 后的
 * dragover/drop 事件序列只能由 Chromium 原生 DnD 产生），单测
 * （components/draggable/__tests__/draggable.spec.ts）只能以
 * mousedown → dragover → dragend 合成事件覆盖排序逻辑；本 e2e 在
 * 真实浏览器中验证「指令输入归一化（#1036）后真实拖拽排序正常，
 * Ref / 数组均兼容」：
 *
 *   1) 指令模式 demo（拖拽指令-垂直方向，v-drag:[dragArg]="vlist"，
 *      vlist 为 Ref，延迟 1s 填充 [1,2,3,4,5]）——归一化后 binding.value
 *      统一解包为纯数组（toRaw 去响应式包装 + Array.isArray 守卫 + 缺省 []），
 *      props.list 恒为纯数组，原地 arrayMove 写回用户最新数组；
 *   2) 真实拖拽（mouse down → 原生 dragover → drop）把第一项拖到第二项后，
 *      DOM 顺序 1,2,3,4,5 → 2,1,3,4,5（证明重新挂载/整数更新的列表
 *      也能被同一引用写回，Ref 输入与纯数组输入走同一条归一化路径）；
 *   3) 全程无 pageerror / console.error（剔除 favicon/资源 404）。
 *
 * 运行：npx playwright test e2e/issue-1036-draggable.spec.ts
 * （依赖 pnpm run docs:dev 的 5173 端口，playwright.config.ts 已配置 webServer）
 */

/** 收集 pageerror 与 console.error（剔除 favicon / 资源 404 后即运行错误） */
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

const runErrors = (errors: string[]) =>
    errors.filter((e) => !e.includes('favicon') && !e.includes('404'));

/**
 * 定位指令模式 demo（拖拽指令-垂直方向）的列表项。
 * 注意：DOM 中 demo 块没有名为 instruction 的 class（codeName 仅用于
 * playground），故以「拖拽指令-垂直方向」标题锚定其后的 .vp-raw 包裹的
 * .component-doc（VitePress 渲染结构：h3 → p 描述 → div.vp-raw → div.component-doc），
 * 再取其中的 .sort-item 列表项（v-drag 指令容器内的 v-for 项）。
 */
async function getInstructionItems(page: Page): Promise<Locator> {
    const heading = page
        .locator('h3')
        .filter({ hasText: '拖拽指令-垂直方向' })
        .first();
    await heading.waitFor({ state: 'attached', timeout: 60_000 });
    const demo = heading
        .locator('xpath=following-sibling::div[contains(@class,"vp-raw")][1]')
        .locator('.component-doc');
    await demo.scrollIntoViewIfNeeded();
    // 顶部留 200px，避开 VitePress 吸顶导航（避免 mouse 坐标落在导航栏上）
    await demo.evaluate((el) => {
        const top = el.getBoundingClientRect().top;
        window.scrollBy(0, top - 200);
    });
    await page.waitForTimeout(100);
    return demo.locator('.sort-item');
}

/**
 * 把列表第一项拖到第二项后（真实浏览器原生 HTML5 拖拽）：
 * mousedown 后指令 watcher 在下一 flush 中把 draggable="true" 写到源项，
 * Chromium 在首次移动时按该属性决定是否启动原生拖拽 → 留出落盘时间；
 * 随后分步移动触发原生 dragover（目标项上执行 arrayMove(0 → 1)），
 * mouseup 触发 drop/dragend 完成收尾。
 */
async function dragFirstToSecond(page: Page, items: Locator) {
    const srcBox = await items.nth(0).boundingBox();
    const dstBox = await items.nth(1).boundingBox();
    expect(srcBox, '第一项应有 boundingBox').toBeTruthy();
    expect(dstBox, '第二项应有 boundingBox').toBeTruthy();
    const center = (box: { x: number; y: number; width: number; height: number }) => ({
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
    });
    const start = center(srcBox!);
    const end = center(dstBox!);
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.waitForTimeout(200); // 等指令把 draggable="true" 写到源项
    await page.mouse.move(end.x, end.y, { steps: 20 });
    await page.mouse.up();
    await page.waitForTimeout(300); // 等 drop/dragend 收尾与 DOM 重排
}

test.describe('#1036 v-draggable 指令输入归一化真实浏览器验证', () => {
    test('指令模式 demo 渲染 5 项且页面无运行错误', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/zh/components/draggable.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        const items = await getInstructionItems(page);
        // vlist 延迟 1s 填充，等待 5 项渲染完成
        await expect(items).toHaveCount(5, { timeout: 30_000 });
        expect(
            (await items.allTextContents()).map((t) => t.trim()),
        ).toEqual(['1', '2', '3', '4', '5']);
        expect(runErrors(errors), '指令 demo 加载不应有运行错误').toEqual([]);
    });

    test('第一项拖到第二项后：DOM 顺序 1,2,3,4,5 → 2,1,3,4,5 且无运行错误', async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto('/zh/components/draggable.html');
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        const items = await getInstructionItems(page);
        await expect(items).toHaveCount(5, { timeout: 30_000 });
        expect(
            (await items.allTextContents()).map((t) => t.trim()),
        ).toEqual(['1', '2', '3', '4', '5']);

        // 真实拖拽后断言 DOM 顺序变化（指令写回 vlist 触发 v-for 重排）
        await dragFirstToSecond(page, items);
        await expect(items.nth(0)).toHaveText('2', { timeout: 10_000 });
        expect(
            (await items.allTextContents()).map((t) => t.trim()),
        ).toEqual(['2', '1', '3', '4', '5']);

        expect(runErrors(errors), '拖拽交互不应有运行错误').toEqual([]);
    });
});
