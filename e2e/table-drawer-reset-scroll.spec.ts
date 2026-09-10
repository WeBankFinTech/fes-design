import { expect, test } from '@playwright/test';

// Issue #873: Table 在 Drawer/Modal 中初始化渲染报错
// TypeError: Cannot set properties of null (setting 'scrollLeft') at resetScrolling
// 复现要素：抽屉首帧打开 + Table 初始无数据后异步到数据（<NoData> → <BodyTable> 切换）
//          + 无 height（HeaderTable 不渲染）与有 height 两种形态

const DOC_URL = '/zh/components/table.html';
const WT = '/Users/harrywan/company/git/fes-design/.worktrees/fix-873-table-reset-scroll';

test('drawer 内 table 空数据→有数据 切换不抛 TypeError (#873)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
        errors.push(String(err));
    });
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    await page.goto(DOC_URL);
    await page.locator('button').first().waitFor({ state: 'visible', timeout: 60_000 });

    await page.evaluate(async (wt) => {
        const urls = performance.getEntriesByType('resource').map((e) => e.name);
        const vueUrl = urls.find((u) => /deps\/vue\.js/.test(u));
        const Vue = (await import(vueUrl)).default ?? (await import(vueUrl));
        const mod = await import(`/@fs${wt}/components/index.ts`);
        const { FDrawer, FTable, FScrollbar } = mod as any;
        const mountPoint = document.createElement('div');
        mountPoint.id = 'e2e-873-host';
        document.body.appendChild(mountPoint);

        const show = Vue.ref(true); // 首帧即打开（用户场景）
        window.__e873show = show;
        const data = Vue.ref<any[]>([]); // 初始空数据
        window.__e873data = data;

        const columns = [
            { title: '名称', key: 'name' },
            { title: '数值', key: 'value' },
        ];
        const app = Vue.createApp({
            setup() {
                return () => Vue.h(FDrawer, {
                    'show': show.value,
                    'onUpdate:show': (v) => {
                        show.value = v;
                    },
                    'title': '873 复现',
                }, {
                    default: () => Vue.h('div', [
                        Vue.h(FTable, {
                            columns,
                            data: data.value,
                            maxHeight: 200,
                        }),
                        Vue.h(FScrollbar, { height: '60px', always: true }, {
                            default: () => Vue.h('div', '外层滚动容器'),
                        }),
                    ]),
                });
            },
        });
        app.mount(mountPoint);
    }, WT);

    // 空数据渲染
    await page.waitForTimeout(500);
    // 异步灌数据：触发 <NoData> → <BodyTable> 切换（resetScrolling 的触发路径）
    await page.evaluate(() => {
        window.__e873data.value = Array.from({ length: 20 }, (_, i) => ({ name: `row-${i}`, value: i }));
    });
    await page.waitForTimeout(500);
    // 关闭再打开（Drawer 卸载/重挂载时序）
    await page.evaluate(() => {
        window.__e873show.value = false;
    });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
        window.__e873show.value = true;
    });
    await page.waitForTimeout(500);
    // 再来一轮数据清空/灌入
    await page.evaluate(() => {
        window.__e873data.value = [];
    });
    await page.waitForTimeout(300);
    await page.evaluate(() => {
        window.__e873data.value = Array.from({ length: 5 }, (_, i) => ({ name: `r-${i}`, value: i }));
    });
    await page.waitForTimeout(500);

    const scrollErrors = errors.filter((e) => e.includes('scrollLeft') || e.includes('resetScrolling'));
    expect(scrollErrors, `不应出现 scrollLeft 相关 TypeError: ${scrollErrors.join('\n')}`).toHaveLength(0);
});

test('表格包在 FScrollbar 内（用户结构）+ 抽屉循环开关 (#873)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.goto(DOC_URL);
    await page.locator('button').first().waitFor({ state: 'visible', timeout: 60_000 });

    await page.evaluate(async (wt) => {
        const urls = performance.getEntriesByType('resource').map((e) => e.name);
        const vueUrl = urls.find((u) => /deps\/vue\.js/.test(u));
        const Vue = (await import(vueUrl)).default ?? (await import(vueUrl));
        const mod = await import(`/@fs${wt}/components/index.ts`);
        const { FDrawer, FTable, FScrollbar } = mod as any;
        const mountPoint = document.createElement('div');
        mountPoint.id = 'e2e-873-host3';
        document.body.appendChild(mountPoint);
        const show = Vue.ref(true);
        window.__e873c = show;
        const data = Vue.ref<any[]>([]);
        window.__e873cdata = data;
        const columns = [
            { title: '名称', key: 'name', width: 300 },
            { title: '数值', key: 'value', width: 300 },
            { title: '其他', key: 'other', width: 400 },
        ];
        const app = Vue.createApp({
            setup() {
                return () => Vue.h(FDrawer, {
                    'show': show.value, 'onUpdate:show': (v) => {
                        show.value = v;
                    }, 'width': 800,
                }, {
                    default: () => Vue.h(FScrollbar, {
                        class: 'fes-drawer-body-wrapper', containerClass: 'fes-drawer-body-container', always: true,
                    }, {
                        default: () => Vue.h(FTable, { columns, data: data.value, height: 300 }),
                    }),
                });
            },
        });
        app.mount(mountPoint);
    }, WT);
    await page.waitForTimeout(400);
    for (let round = 0; round < 3; round++) {
        await page.evaluate(() => {
            window.__e873cdata.value = Array.from({ length: 30 }, (_, i) => ({ name: `n${i}`, value: i, other: `o${i}` }));
        });
        await page.waitForTimeout(350);
        await page.evaluate(() => {
            window.__e873cdata.value = [];
        });
        await page.waitForTimeout(350);
        await page.evaluate(() => {
            window.__e873c.value = false;
        });
        await page.waitForTimeout(500);
        await page.evaluate(() => {
            window.__e873c.value = true;
        });
        await page.waitForTimeout(500);
    }
    const scrollErrors = errors.filter((e) => e.includes('scrollLeft'));
    expect(scrollErrors, scrollErrors.join('\n')).toHaveLength(0);
});

test('无 height 表格（HeaderTable 不渲染）同样不报错 (#873)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.goto(DOC_URL);
    await page.locator('button').first().waitFor({ state: 'visible', timeout: 60_000 });

    await page.evaluate(async (wt) => {
        const urls = performance.getEntriesByType('resource').map((e) => e.name);
        const vueUrl = urls.find((u) => /deps\/vue\.js/.test(u));
        const Vue = (await import(vueUrl)).default ?? (await import(vueUrl));
        const mod = await import(`/@fs${wt}/components/index.ts`);
        const { FTable } = mod as any;
        const mountPoint = document.createElement('div');
        mountPoint.id = 'e2e-873-host2';
        document.body.appendChild(mountPoint);
        const data = Vue.ref<any[]>([]);
        window.__e873b = data;
        const columns = [{ title: '名称', key: 'name' }];
        const app = Vue.createApp({
            setup() {
                return () => Vue.h(FTable, { columns, data: data.value }); // 无 height
            },
        });
        app.mount(mountPoint);
    }, WT);
    await page.waitForTimeout(300);
    await page.evaluate(() => {
        window.__e873b.value = [{ name: 'a' }];
    });
    await page.waitForTimeout(300);
    await page.evaluate(() => {
        window.__e873b.value = [];
    });
    await page.waitForTimeout(300);
    await page.evaluate(() => {
        window.__e873b.value = [{ name: 'b' }, { name: 'c' }];
    });
    await page.waitForTimeout(500);

    const scrollErrors = errors.filter((e) => e.includes('scrollLeft'));
    expect(scrollErrors, scrollErrors.join('\n')).toHaveLength(0);
});
