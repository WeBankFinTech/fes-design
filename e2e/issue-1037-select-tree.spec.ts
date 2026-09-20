import { type Page, expect, test } from '@playwright/test';

// #1037：FSelectTree targetValues 类型完备防御 —— 真实浏览器验证
//
// 病灶：emitPath=true 时 targetValues/checkedKeys 直接把 modelValue 当路径数组用，
//       若用户传入 null / 标量 / 含 null 项（如 ['gd','sz', null]），会读取 null.length
//       抛 TypeError，或标量被字符串化截断为末字符错误回显（如 '40302010' -> '0'）。
// 修复：targetValues/checkedKeys 对 emitPath 分支统一 `Array.isArray(item) && item.length > 0`
//       过滤，非法项安全降级（不读 null.length），合法项仅取末级 key。
// 本文件验证两个层面：
//   1) 正常路径不回归：withPath demo（emitPath=是/showPath=是/单选）打开下拉 → 展开到叶子
//      选中 → 单选路径数组正确回显（modelValue 回显从 '40302010' 变为 '40302011'，
//      trigger 显示 '道生一/一生二/二生三/三生万物' 路径）。
//   2) 页面级无运行错误：pageerror + console.error 全程为空（剔除 favicon/404 资源噪音）。
// null/标量安全降级的逐项断言由单测锁定（selectTree-branches2.spec.ts：单选+emitPath+null
// 空回显不崩 / 标量空回显不再截断 / multiple 数组含 null、标量项仅回显合法末级），
// 本 e2e 专注真实浏览器下正常路径与无崩溃回归。

// withPath 叶子键：createData(4) 生成 4 层二叉树，
// 初始单选值 ['40','4030','403020','40302010']（leaf 0），
// 本用例选中同父级的另一叶子 leaf 1（'40302011'），父链相同（路径回显不变），
// 因此用 modelValue 回显的末级 key 变化来断言选择生效。
// 展开路径：'40'(道生一) -> '4030'(一生二) -> '403020'(二生三) -> 叶子 '40302010'/'40302011'(三生万物)
const EXPAND_PATH = ['40', '4030', '403020'];
const TARGET_LEAF = '40302011';
const OLD_LEAF = '40302010';
const PATH_ECHO = '道生一/一生二/二生三/三生万物';

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

test.describe('#1037 FSelectTree targetValues 类型完备防御 e2e', () => {
    test('单选 emitPath：展开并选中叶子节点，路径/选中值正确回显且无运行错误', async ({
        page,
    }) => {
        const errors = collectErrors(page);

        // 1) 进入 selectTree 文档页，等待 demo 渲染
        const response = await page.goto('/zh/components/selectTree.html');
        expect(response?.status(), 'selectTree 页应 200').toBe(200);
        await page
            .locator('.component-doc')
            .first()
            .waitFor({ state: 'visible', timeout: 60_000 });

        // 2) 定位 withPath demo 块（'emitPath' 字样仅此 demo 存在），等待其 FSelectTree 就绪
        const demo = page
            .locator('.component-doc')
            .filter({ hasText: 'emitPath' })
            .first();
        const singleSelect = demo.locator('.fes-select-tree').first();
        await singleSelect.waitFor({ state: 'visible', timeout: 30_000 });

        // 选择前初始回显应包含初始叶子 '40302010'（sanity，保证后续变化可判别）
        const singleModelValue = demo
            .locator('.fes-form-item')
            .filter({ hasText: 'modelValue' })
            .first();
        await expect(singleModelValue).toContainText(OLD_LEAF, { timeout: 10_000 });

        // 3) 点击 .fes-select-tree 触发区打开下拉（trigger=click，appendToContainer=true
        // 弹层挂 body；页面多个 selectTree demo 各自有 popper，取可见的那个）
        await singleSelect.locator('.fes-select-trigger').click();
        const dropdown = page
            .locator('.fes-select-tree-popper:visible, .fes-select-tree-dropdown:visible')
            .last();
        await dropdown
            .locator('.fes-tree-node')
            .first()
            .waitFor({ state: 'visible', timeout: 10_000 });

        // 4) 沿 '40' -> '4030' -> '403020' 逐级点 switcher 展开，直到叶子节点可见
        for (const key of EXPAND_PATH) {
            await dropdown
                .locator(`.fes-tree-node[data-value="${key}"] .fes-tree-node-switcher`)
                .click();
            await dropdown
                .locator(`.fes-tree-node[data-value="${key}"]`)
                .waitFor({ state: 'visible', timeout: 5_000 });
        }
        await dropdown
            .locator(`.fes-tree-node[data-value="${TARGET_LEAF}"]`)
            .waitFor({ state: 'visible', timeout: 10_000 });

        // 5) 点击叶子节点内容（单选下 treeSelectable=true，click content -> selectNode -> 单选收起弹层）
        await dropdown
            .locator(`.fes-tree-node[data-value="${TARGET_LEAF}"] .fes-tree-node-content`)
            .click();
        await expect(dropdown).toBeHidden({ timeout: 10_000 });

        // 6) 断言选择回显：
        //    a) modelValue 回显末级 key 由 40302010 变为 40302011（emitPath 路径数组正确写回）
        await expect(singleModelValue).toContainText(TARGET_LEAF, { timeout: 10_000 });
        await expect(singleModelValue).not.toContainText(OLD_LEAF);
        //    b) trigger 回显 showPath 路径（触发区内 label-text 拼接 '道生一/一生二/二生三/三生万物'）
        const triggerLabel = singleSelect.locator('.fes-select-trigger-label-text').first();
        await expect(triggerLabel, '单选 trigger 应回显完整路径').toContainText(PATH_ECHO);

        // 7) 无运行错误：pageerror / console.error 全部为空（剔除 favicon 与资源 404 噪音）
        const runErrors = errors.filter(
            (e) => !e.includes('favicon') && !e.includes('404'),
        );
        expect(runErrors, '#1037 页面交互全程不应有未捕获异常/console.error').toEqual([]);
    });
});
