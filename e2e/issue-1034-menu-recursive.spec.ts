import { type Page, expect, test } from '@playwright/test';

// #1034/#1040 根治验证（真实浏览器）：
// FMenu SubMenu 的展开状态原先是「独立 ref + 与 expandedKeys 双向同步」（多写源），
// 同一 tick 内的渲染-写环被 Vue 3.5 checkRecursiveUpdates 判定为递归更新，并以
// unhandledRejection 抛出 "Maximum recursive updates"（instance=null，
// errorCaptured/errorHandler 无法拦截）——这就是 #1034 与 #1040 关心的点。
//
// 根治（199d1b56 + f60ded7a）：isOpened 收敛为 rootMenu.currentExpandedKeys 的
// 派生只读值（单一事实源），所有写路径（handleTriggerClick / handleItemClick /
// Popper 受控转发 handlePopperVisible / handleSubMenuExpand / clickMenuItem）统一
// 走 updateExpandedKeys，消除渲染-写环。
//
// 本文件在真实浏览器（docs:dev + Playwright Chromium）做存量 demo 交互回归：
//   1) expandedKeys demo（垂直，受控 :expandedKeys）：点击展开收起子菜单 → 点击
//      叶子/根级菜单项（覆盖「点击展开」写路径 + 派生渲染收敛）；
//   2) common demo（水平）：hover 打开 Popper → 点击叶子菜单项（覆盖「hover 展开
//      Popper v-model → updateExpandedKeys」路径 + 点项收起）。
// 两种交互后均断言：不存在 Maximum recursive updates 相关 pageerror / console /
// unhandledrejection，且无其它运行时错误（剔除 favicon/404 资源类噪音）。

const MAX_RECURSIVE = 'Maximum recursive updates';

// 收集三类错误出口：
// - pageerror：未捕获异常（Vue 渲染/生命周期错误）
// - console.error：Vue warn/error 与代码内 console.error
// - unhandledrejection：Vue 3.5 checkRecursiveUpdates 的递归更新正是以
//   unhandledRejection 抛出（Node 侧进程级监听见 menu-recursive-root.spec.ts，
//   浏览器侧等价物为 window unhandledrejection，转成 console.error 统一收集）
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

// 在页面任何脚本运行前挂 unhandledrejection 监听，避免初始渲染期的拒收漏网
const hookUnhandledRejection = (page: Page) =>
    page.addInitScript(() => {
        window.addEventListener('unhandledrejection', (e) => {
            const reason = e.reason;
            const text
                = reason && typeof reason === 'object' && 'message' in reason
                    ? String((reason as Error).message)
                    : String(reason);
            console.error(`[UNHANDLED_REJECTION] ${text.slice(0, 200)}`);
        });
    });

const gotoMenuPage = async (page: Page) => {
    const response = await page.goto('/zh/components/menu.html');
    expect(response?.status(), '/zh/components/menu.html 应 200').toBe(200);
    await page
        .locator('.component-doc')
        .first()
        .waitFor({ state: 'visible', timeout: 60_000 });
    await page.locator('.fes-menu').first().waitFor({ state: 'visible', timeout: 30_000 });
    // 存量 demo 全部渲染后交互（异步组件 + 图标字体稳定）
    await page.waitForTimeout(1200);
};

// 断言不存在递归更新错误，且无其它运行时错误（剔除 favicon/404 资源类噪音）
const expectNoRecursiveOrRuntimeErrors = (errors: string[]) => {
    const recursive = errors.filter((e) => e.includes(MAX_RECURSIVE));
    expect(
        recursive,
        '#1034/#1040：展开/收起/点项交互不应触发 Maximum recursive updates',
    ).toEqual([]);
    const others = errors.filter(
        (e) => !e.includes('favicon') && !e.includes('404'),
    );
    expect(others, '不应存在其它未捕获异常 / console.error').toEqual([]);
};

test.describe('#1034/#1040 FMenu 展开收敛（派生值）真实浏览器回归', () => {
    test('垂直 expandedKeys demo：点击展开子菜单 → 点叶子/根级菜单项，无递归崩溃', async ({
        page,
    }) => {
        const errors = collectErrors(page);
        await hookUnhandledRejection(page);
        await gotoMenuPage(page);

        // 定位 expandedKeys demo：expandedKeys.vue 结构 = 外层 2 个 sub-menu
        // （value=1、value=4），各自内嵌一个「湖北」sub-menu → 共 4 个
        // .fes-sub-menu-wrapper；:expandedKeys="['4']" 使外层 value=4（第 3 个
        // wrapper）展开，其余收起（受控派生）。
        const targetIdx = await page
            .locator('.fes-menu')
            .evaluateAll((menus) =>
                menus.findIndex((m) => {
                    const wrappers = Array.from(
                        m.querySelectorAll('.fes-sub-menu-wrapper'),
                    );
                    if (wrappers.length !== 4) {
                        return false;
                    }
                    const isOpened = (w: Element) =>
                        (w.querySelector('.fes-sub-menu-arrow')?.classList.contains('is-opened')
                            ?? false);
                    // 外层1 收起、外层2（index 2）展开，内层湖北均收起
                    return (
                        !isOpened(wrappers[0])
                        && isOpened(wrappers[2])
                        && !isOpened(wrappers[1])
                        && !isOpened(wrappers[3])
                    );
                }),
            );
        expect(
            targetIdx,
            '应找到 expandedKeys demo（4 个 wrapper，外层第 3 个由 expandedKeys 展开）',
        ).toBeGreaterThanOrEqual(0);
        const menu = page.locator('.fes-menu').nth(targetIdx);

        // —— 点击展开（写 expandedKeys 单一路径 + 派生渲染）——
        const firstWrapper = menu.locator('.fes-sub-menu-wrapper').first();
        const arrow = firstWrapper.locator('.fes-sub-menu-arrow');
        await expect(arrow).not.toHaveClass(/is-opened/);
        await firstWrapper.click();
        await page.waitForTimeout(600); // 等派生渲染 + 过渡 flush
        await expect(arrow).toHaveClass(/is-opened/); // 派生展开生效

        // —— 点击叶子菜单项（select + is-active，含子菜单 isActive 派生链）——
        // 子菜单 1 内叶子「湖南」（value 1.1）；「湖北」子项为武汉市…不冲突。
        // 注意：.fes-sub-menu-children 是 wrapper 的兄弟节点（非子级），
        // 从菜单根定位；首个 children 属于外层1（DOM 顺序 wrapper1,children1,...）
        const leaf = menu
            .locator('.fes-sub-menu-children .fes-menu-item')
            .filter({ hasText: '湖南' })
            .first();
        await leaf.waitFor({ state: 'visible', timeout: 10_000 });
        await leaf.click();
        await expect(leaf).toHaveClass(/is-active/); // 选中副作用收敛

        // —— 点击根级菜单项「人群管理」（value 2，clickMenuItem 收敛路径）——
        const rootItem = menu
            .locator('.fes-menu-item')
            .filter({ hasText: '人群管理' })
            .first();
        await expect(rootItem).toBeVisible();
        await rootItem.click();
        await expect(rootItem).toHaveClass(/is-active/);

        // 派生渲染 flush 后仍稳定（写-读-写环若有会在此窗口以 rejection 抛出）
        await page.waitForTimeout(1200);
        expectNoRecursiveOrRuntimeErrors(errors);
    });

    test('水平 common demo：hover 展开 Popper → 点叶子菜单项，无递归崩溃', async ({
        page,
    }) => {
        const errors = collectErrors(page);
        await hookUnhandledRejection(page);
        await gotoMenuPage(page);

        // 第一个水平菜单即 common demo（页面 demo 顺序由 index.md 决定）
        const menu = page.locator('.fes-menu.is-horizontal').first();
        await expect(menu).toBeVisible();

        // —— hover 展开子菜单 1（我是标题）：Popper v-model → updateExpandedKeys ——
        await menu.locator('.fes-sub-menu-wrapper').first().hover();
        // hover 面板挂 body（appendToContainer），等面板可见后取其中叶子
        const panel = page.locator('[class*="sub-menu-popper"]:visible').first();
        await panel.waitFor({ state: 'visible', timeout: 10_000 });
        // '浙江' 可能落在面板滚动区外导致 isVisible=false（CSS 可见但视口外），
        // 改用「面板内可交互叶子」：首个可见的 .fes-menu-item（湖南 disabled，取可用项）
        const leafZhejiang = panel
            .locator('.fes-menu-item:not(.is-disabled)')
            .first();
        await leafZhejiang.waitFor({ state: 'visible', timeout: 10_000 });
        await leafZhejiang.click();
        await expect(leafZhejiang).toHaveClass(/is-active/);
        // 点击菜单项 → 收敛关闭子菜单（面板收起，渲染-写环消除）
        await expect(leafZhejiang).toBeHidden();

        // 同样覆盖「hover 打开第二个子菜单 人群管理 → 点其叶子」路径
        await menu.locator('.fes-sub-menu-wrapper').nth(1).hover();
        const panel2 = page.locator('[class*="sub-menu-popper"]:visible').first();
        await panel2.waitFor({ state: 'visible', timeout: 10_000 });
        // '白富美' 存在多个 demo 中，限定在当前可见面板内查找
        const leafBaifumei = page
            .locator('[class*="sub-menu-popper"]:visible .fes-menu-item')
            .filter({ hasText: '白富美' })
            .first();
        await leafBaifumei.waitFor({ state: 'visible', timeout: 10_000 });
        await leafBaifumei.click();
        await expect(leafBaifumei).toHaveClass(/is-active/);

        await page.waitForTimeout(1200);
        expectNoRecursiveOrRuntimeErrors(errors);
    });
});
