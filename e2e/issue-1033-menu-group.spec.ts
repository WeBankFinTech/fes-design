import { type Page, expect, test } from '@playwright/test';

// ============================================================================
// #1033 FMenuGroup 孤儿守卫熔断修复验证（真实浏览器）
//
// 病灶（修复前 components/menu/menuGroup.tsx）：
//   setup 中先执行 useMenu/useChildren 拿到 rootMenu、parentMenu，随后
//   console.warn 后再继续走 useParent/onMounted 注册与 paddingStyle 计算；
//   当 menuGroup 脱离 FMenu/FSubMenu（孤儿挂载）时 rootMenu 为 undefined，
//   useParent/paddingStyle 依赖 rootMenu → 报错后 TypeError 崩溃。
//
// 修复（commit 126c39bf，merge 9afdd57f）：
//   !rootMenu || !parentMenu 双守卫合并为单守卫：告警一次后 return () => null
//   早退，跳过 useParent/onMounted 注册与 paddingStyle 计算 —— 孤儿挂载从
//   「先告警后 TypeError 崩溃」变为「告警一次 + 空渲染不抛错」。
//
// 本用例验证：修复不破坏【正常】渲染路径 ——
//   1) /zh/components/menu.html 全部存量 demo 块正常渲染（.component-doc > 0）
//   2) 菜单结构正常渲染：.fes-menu 可见，含分组（.fes-menu-group）与
//      子菜单（.fes-sub-menu）的 demo 均产出真实 DOM
//   3) 页面无 pageerror / console.error（剔除 favicon/静态资源 404 噪音），
//      即没有孤儿守卫熔断导致的运行错误复现、也没有正常渲染被破坏的报错
// ============================================================================

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

test.describe('#1033 FMenuGroup 孤儿守卫熔断 —— 不破坏正常渲染', () => {
    test('menu 页 demo 全渲染 + 分组/子菜单结构存在 + 无运行错误', async ({ page }) => {
        const errors = collectErrors(page);
        const response = await page.goto('/zh/components/menu.html');
        expect(response?.status(), '/zh/components/menu.html 应 200').toBe(200);

        // 1) 等待文档 demo 容器出现
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        // 2) 等待菜单渲染稳定（异步组件 + demo 挂载）
        await expect(page.locator('.fes-menu').first()).toBeVisible({
            timeout: 30_000,
        });
        await page.waitForTimeout(1500);

        // 3) 存量 demo 块全部渲染
        const demoCount = await page.locator('.component-doc').count();
        expect(demoCount, 'menu 页应渲染出 demo 块').toBeGreaterThan(0);

        // 4) 含分组 demo（FMenuGroup → .fes-menu-group）正常渲染：
        //    common/vertical 等 demo 的分组标题必须产出真实 DOM
        const groupCount = await page.locator('.fes-menu-group').count();
        expect(groupCount, '含 FMenuGroup 的 demo 应渲染 .fes-menu-group').toBeGreaterThan(0);

        // 5) 含子菜单 demo（FSubMenu → .fes-sub-menu）正常渲染
        const subMenuCount = await page.locator('.fes-sub-menu').count();
        expect(subMenuCount, '含 FSubMenu 的 demo 应渲染 .fes-sub-menu').toBeGreaterThan(0);

        // 6) 无运行错误：剔除 favicon/静态资源 404（仅保留运行错误）
        const runErrors = errors.filter(
            (e) => !e.includes('favicon') && !e.includes('404'),
        );
        expect(
            runErrors,
            '#1033 修复后正常渲染路径不应有 pageerror/console.error（守卫熔断只应影响孤儿挂载）',
        ).toEqual([]);
    });
});
