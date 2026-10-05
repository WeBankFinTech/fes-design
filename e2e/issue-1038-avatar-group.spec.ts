import { type Page, expect, test } from '@playwright/test';

// Issue #1038：FAvatarGroup 在未传 options（或传空数组）时挂载崩溃
// （`props.options.map` 直接调用抛 TypeError: Cannot read properties of undefined）。
// 修复：props.ts 的 options 增加 `default: () => []`，avatarGroup.tsx 两处调用点
// （L23 renderAvatarByOption / L80 renderHiddenTooltip）改为 `(props.options || [])` 双保险。
// 本用例验证存量 docs 页（avatar 页含 avatarGroup demo）：
// 1) 页面 demo 正常渲染（.fes-avatar-group / .fes-avatar 系列节点存在）
// 2) 无未捕获异常（pageerror）与无 console.error（剔除 favicon/资源 404）

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

test('#1038 avatar 页：avatarGroup demo 与普通 avatar 渲染正常且无运行错误', async ({ page }) => {
    const errors = collectErrors(page);

    await page.goto('/zh/components/avatar.html');

    // 等待文档站按需编译渲染出 demo 块
    await page
        .locator('.component-doc')
        .first()
        .waitFor({ state: 'visible', timeout: 60_000 });
    // 等待异步组件与 demo 渲染稳定
    await page.waitForTimeout(1200);

    // avatarGroup demo 存在（avatar 页引入该 demo）且渲染出 .fes-avatar-group 根节点
    const group = page.locator('.fes-avatar-group');
    const groupCount = await group.count();
    expect(groupCount, 'avatar 页应存在 .fes-avatar-group demo').toBeGreaterThan(0);

    // 普通 avatar 渲染正常：页面存在 .fes-avatar 系列节点
    // （FAvatarGroup 内部按 options 渲染出 .fes-avatar，demo 中亦直接使用 FAvatar）
    const avatarNodes = page.locator('.fes-avatar');
    const avatarCount = await avatarNodes.count();
    expect(avatarCount, '页面应渲染出 .fes-avatar 节点').toBeGreaterThan(0);

    // 修复后 options 走 default 兜底，空渲染不崩溃 → 页面不应有任何运行错误
    const runErrors = errors.filter(
        (e) => !e.includes('favicon') && !e.includes('404'),
    );
    expect(runErrors, '#1038 修复后 avatar 页不应有未捕获异常/console.error').toEqual([]);
});
