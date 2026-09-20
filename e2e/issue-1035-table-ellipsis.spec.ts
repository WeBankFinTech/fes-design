import { type Page, expect, test } from '@playwright/test';

// Issue #1035：FTable cell 列配置只读化。
//
// 病灶（修复前 cell.tsx）：对象型 ellipsis 列配置下，单元格渲染执行
// `Object.assign(ellipsisProps, { content })` 把 content 就地写入用户传入的
// ellipsis 对象；useTableColumn 浅拷贝列配置后 column.props.ellipsis 与用户
// 对象同引用，同一列多行单元格互写 content 触发响应式「渲染→写→渲染」死循环
// （Maximum recursive updates），页面卡死。
//
// 修复（commit 0fc99490，docs 由 ef29951e 增加 table/ellipsis demo）：
// cell.tsx 改为 `{ ...ellipsisProps, content: result }` 展开构造新对象渲染，
// 用户列配置完全只读——对象 ellipsis（如 { line: 1 } / { line: 3, expandable: true }）
// 渲染不再写回用户对象、不引发无限重渲染。
//
// 本 e2e 在真实浏览器验证 docs 站 table 页：
//   1) ellipsis demo（表格单元格文本省略/标题提示）正常渲染出省略列；
//   2) 页面 0 pageerror（含 Maximum recursive updates 死循环症状）与
//      0 console.error（剔除 favicon/资源 404 噪声）。
// 单元级「用户对象不被写回 content」的精确断言由
// components/table/__tests__/table-virtual-branches.spec.ts 的
// 「ellipsis 传对象：渲染不写回用户对象 + 无无限重渲染（#1035）」锁定，
// 本文件只做真实浏览器层面的存在性与无运行错误验证。

const collectErrors = (page: Page) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
        // 无限重渲染死循环在浏览器中即表现为 pageerror：
        // 「Maximum recursive updates exceeded」或 uncaught TypeError
        errors.push(`PAGEERROR: ${err.message.slice(0, 200)}`);
    });
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(`CONSOLE: ${msg.text().slice(0, 200)}`);
        }
    });
    return errors;
};

test('table 页 ellipsis demo：省略列渲染存在 + 无运行错误（#1035）', async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto('/zh/components/table.html');
    expect(response?.status(), '/zh/components/table.html 应 200').toBe(200);
    await page
        .locator('.component-doc')
        .first()
        .waitFor({ state: 'visible', timeout: 60_000 });

    // ellipsis demo（docs/.vitepress/components/table/ellipsis.vue）：
    // 列配置 ellipsis 支持 boolean 与对象（{ line: 1 } 单行、{ line: 3, expandable: true } 多行），
    // 文本溢出以省略号截断并附标题/tooltip 提示。以 demo 独占文案「金沙江路」锚定该 demo 表格，
    // 弱化严格断言（不校验具体截断像素/行数，规避字体度量与视口差异）。
    const ellipsisTable = page
        .locator('.fes-table')
        .filter({ hasText: '上海市普陀区金沙江路' })
        .first();
    await expect(ellipsisTable, '应渲染出 ellipsis demo 表格').toHaveCount(1);

    // 省略单元格（FTableCell 将内容包进 .fes-ellipsis 省略容器，
    // 单行 text-overflow: ellipsis / 多行 -webkit-line-clamp）至少存在一处
    const ellipsisCells = ellipsisTable.locator('td .fes-ellipsis');
    await expect(ellipsisCells.first(), 'ellipsis demo 应存在省略单元格').toBeVisible();
    const ellipsisCount = await ellipsisCells.count();
    expect(ellipsisCount, `ellipsis demo 省略单元格数应 >= 3（id/name/desc 三列均有），实际 ${ellipsisCount}`).toBeGreaterThanOrEqual(3);

    // 对象型 ellipsis 列（{ line: 1 } 单行）的两行长文本都在（多行互写 content 已消除）
    const nameCol = ellipsisTable.locator('td .fes-ellipsis').filter({
        hasText: '北京市朝阳区望京 SOHO',
    });
    await expect(nameCol, '对象型 ellipsis 列第二行长文本应完整渲染').toHaveCount(1);

    // 渲染收敛：等待若干帧后再统计一次，省略单元格数量稳定（不再因死循环抖动/增长）
    await page.waitForTimeout(1200);
    const stableCount = await ellipsisCells.count();
    expect(stableCount, '省略单元格数量应稳定收敛').toBe(ellipsisCount);

    // 无运行错误：剔除 favicon/资源 404（资源缺失不等同运行异常）
    const runErrors = errors.filter(
        (e) => !e.includes('favicon') && !e.includes('404'),
    );
    expect(
        runErrors,
        // #1035 病灶（Maximum recursive updates）若复发会在此暴露为 pageerror/console.error
        `table 页应无 pageerror（含递归更新死循环）与 console.error，实际: ${runErrors.join(' | ')}`,
    ).toEqual([]);
});
