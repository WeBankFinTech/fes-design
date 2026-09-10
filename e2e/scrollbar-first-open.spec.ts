import { expect, test } from '@playwright/test';

// Issue #716: FModal displayDirective="show" 时，首次打开 FScrollbar 滚动条不出现，再次打开正常
// 根因：useResize(immediate=false) 的"吞第一次回调"逻辑误吞了隐藏挂载后唯一一次真实 RO 回调，
// onUpdate 未执行 → sizeHeight 为空 → 滚动条 track 的 v-show="!!size" 永假。

const DOC_URL = '/zh/components/modal.html';

async function openModalAndHover(page: any) {
    // 注入复现场景（与 issue 代码等价）：modal 内 100 行内容 + FScrollbar height=100px
    await page.evaluate(async () => {
        const urls = performance.getEntriesByType('resource').map((e) => e.name);
        const vueUrl = urls.find((u) => /deps\/vue\.js/.test(u));
        const Vue = (await import(vueUrl)).default ?? (await import(vueUrl));
        const mod = await import('/@fs/Users/harrywan/company/git/fes-design/.worktrees/fix-716-scrollbar-first-open/components/index.ts');
        const { FModal, FScrollbar } = mod;
        const mountPoint = document.createElement('div');
        mountPoint.id = 'e2e-716-host';
        document.body.appendChild(mountPoint);
        const show = Vue.ref(false);
        window.__e2e716show = show;
        const items = Array.from({ length: 100 }, (_, i) => i);
        const app = Vue.createApp({
            setup() {
                return () => Vue.h(FModal, {
                    'show': show.value,
                    'onUpdate:show': (v) => {
                        show.value = v;
                    },
                    'title': '滚动条首开测试',
                    'displayDirective': 'show',
                }, {
                    default: () => Vue.h(FScrollbar, { height: '100px' }, {
                        default: () => items.map((i) => Vue.h('div', { key: i, style: 'line-height:30px' }, `内容行 ${i}`)),
                    }),
                });
            },
        });
        app.mount(mountPoint);
    });
    const open = () => page.evaluate(() => {
        window.__e2e716show.value = true;
    });
    const close = () => page.evaluate(() => {
        window.__e2e716show.value = false;
    });
    const hoverScrollbar = async () => {
        // 真实鼠标移动到 scrollbar 区域（右侧边缘中部），触发 visible 逻辑
        const box = await page.evaluate(() => {
            const bodies = Array.from(document.querySelectorAll('.fes-modal-body'))
                .filter((b) => b.getBoundingClientRect().width > 0);
            const sc = bodies[bodies.length - 1].querySelector('.fes-scrollbar');
            const r = sc.getBoundingClientRect();
            return { x: r.right - 5, y: r.top + 50 };
        });
        await page.mouse.move(box.x, box.y, { steps: 5 });
        await page.waitForTimeout(600);
    };
    const measureTrack = () => page.evaluate(() => {
        const bodies = Array.from(document.querySelectorAll('.fes-modal-body'))
            .filter((b) => b.getBoundingClientRect().width > 0);
        const sc = bodies[bodies.length - 1].querySelector('.fes-scrollbar');
        const track = sc.querySelectorAll('.fes-scrollbar-track')[1]; // vertical
        return {
            display: track ? getComputedStyle(track).display : 'NO_TRACK',
            h: track ? Math.round(track.getBoundingClientRect().height) : 0,
        };
    });

    // 首次打开
    await open();
    await page.waitForTimeout(1000);
    await hoverScrollbar();
    const firstOpen = await measureTrack();
    // 关闭再打开
    await close();
    await page.waitForTimeout(700);
    await open();
    await page.waitForTimeout(1000);
    await hoverScrollbar();
    const secondOpen = await measureTrack();
    return { firstOpen, secondOpen };
}

test('#716 首次打开 modal 滚动条应立即可见（悬停）', async ({ page }) => {
    await page.goto(DOC_URL);
    await page.locator('button').first().waitFor({ state: 'visible', timeout: 60_000 });

    const { firstOpen, secondOpen } = await openModalAndHover(page);

    // 修复前：首开 display none / h 0；修复后首开与再开行为一致
    expect(firstOpen.display).toBe('block');
    expect(firstOpen.h).toBeGreaterThan(50);
    // 回归守护：再次打开依旧正常
    expect(secondOpen.display).toBe('block');
    expect(secondOpen.h).toBeGreaterThan(50);
});

test('#716 不悬停时滚动条操作仍正常（回归守护）', async ({ page }) => {
    await page.goto(DOC_URL);
    await page.locator('button').first().waitFor({ state: 'visible', timeout: 60_000 });

    await page.evaluate(async () => {
        const urls = performance.getEntriesByType('resource').map((e) => e.name);
        const vueUrl = urls.find((u) => /deps\/vue\.js/.test(u));
        const Vue = (await import(vueUrl)).default ?? (await import(vueUrl));
        const mod = await import('/@fs/Users/harrywan/company/git/fes-design/.worktrees/fix-716-scrollbar-first-open/components/index.ts');
        const { FModal, FScrollbar } = mod;
        const mountPoint = document.createElement('div');
        mountPoint.id = 'e2e-716-host2';
        document.body.appendChild(mountPoint);
        const show = Vue.ref(false);
        window.__e2e716b = show;
        const items = Array.from({ length: 100 }, (_, i) => i);
        const app = Vue.createApp({
            setup() {
                return () => Vue.h(FModal, {
                    'show': show.value,
                    'onUpdate:show': (v) => {
                        show.value = v;
                    },
                    'title': 't', 'displayDirective': 'show',
                }, {
                    default: () => Vue.h(FScrollbar, { height: '100px' }, {
                        default: () => items.map((i) => Vue.h('div', { key: i, style: 'line-height:30px' }, `行 ${i}`)),
                    }),
                });
            },
        });
        app.mount(mountPoint);
    });
    await page.evaluate(() => {
        window.__e2e716b.value = true;
    });
    await page.waitForTimeout(1000);
    // 滚动操作正常（issue 说"操作是OK的"）
    const scrolled = await page.evaluate(() => {
        const bodies = Array.from(document.querySelectorAll('.fes-modal-body'))
            .filter((b) => b.getBoundingClientRect().width > 0);
        const container = bodies[bodies.length - 1].querySelector('.fes-scrollbar-container');
        container.scrollTop = 90;
        return container.scrollTop > 0;
    });
    expect(scrolled).toBe(true);
});
