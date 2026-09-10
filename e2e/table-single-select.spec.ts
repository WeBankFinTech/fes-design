import { expect, test } from '@playwright/test';

// Issue #968: table 组件单选模式也能选多个
// 文档「Table > 行选择」demo：切换「是否多选」为「否」后，表格使用 radio 单选。
// 预期：任意时刻至多只有一行被选中；点击另一行时替换旧选中。

test('table 单选模式选中另一行时替换旧选中，不会同时选中多行', async ({ page }) => {
    await page.goto('/zh/components/table.html');

    // 等待文档站按需编译并渲染出表格
    const firstTable = page.locator('.fes-table').first();
    await firstTable.waitFor({ state: 'visible', timeout: 60_000 });

    // 找到行选择 demo 的「是否多选」开关（FSpace 内的 FRadioGroup），切换为「否」
    const space = page.locator('.fes-space').filter({ hasText: '是否多选' });
    await expect(space).toHaveCount(1);
    await space.locator('.fes-radio').filter({ hasText: /^否$/ }).click();

    // 切换后 demo 表格内应出现 radio
    const tables = page.locator('.fes-table');
    const tableCount = await tables.count();
    let demo = null;
    for (let i = 0; i < tableCount; i++) {
        const candidate = tables.nth(i);
        if ((await candidate.locator('tbody .fes-radio').count()) > 0) {
            demo = candidate;
            break;
        }
    }
    expect(demo, '未找到包含 radio 的行选择 demo 表格').not.toBeNull();

    const radios = demo.locator('tbody .fes-radio');
    await expect(radios).toHaveCount(3);

    // demo 第二行 selectable 返回 false，是禁用行，跳过；点击第 1、3 行
    const clickable = [0, 2];

    await radios.nth(clickable[0]).click();
    await expect(radios.nth(clickable[0])).toHaveClass(/is-checked/);
    await expect(demo.locator('tbody .fes-radio.is-checked')).toHaveCount(1);

    // 点击另一行：单选模式应替换旧选中，而不是累加
    await radios.nth(clickable[1]).click();
    await expect(radios.nth(clickable[1])).toHaveClass(/is-checked/);

    const checkedCount = await demo.locator('tbody .fes-radio.is-checked').count();
    expect(
        checkedCount,
        `单选模式下点击两行后有 ${checkedCount} 行被同时选中`,
    ).toBe(1);
});

test('table 单选模式再次点击已选中行可取消选中', async ({ page }) => {
    await page.goto('/zh/components/table.html');

    const firstTable = page.locator('.fes-table').first();
    await firstTable.waitFor({ state: 'visible', timeout: 60_000 });

    const space = page.locator('.fes-space').filter({ hasText: '是否多选' });
    await expect(space).toHaveCount(1);
    await space.locator('.fes-radio').filter({ hasText: /^否$/ }).click();

    const tables = page.locator('.fes-table');
    const tableCount = await tables.count();
    let demo = null;
    for (let i = 0; i < tableCount; i++) {
        const candidate = tables.nth(i);
        if ((await candidate.locator('tbody .fes-radio').count()) > 0) {
            demo = candidate;
            break;
        }
    }
    expect(demo).not.toBeNull();

    const radios = demo.locator('tbody .fes-radio');
    await expect(radios).toHaveCount(3);

    await radios.nth(0).click();
    await expect(radios.nth(0)).toHaveClass(/is-checked/);

    await radios.nth(0).click();
    await expect(demo.locator('tbody .fes-radio.is-checked')).toHaveCount(0);
});
