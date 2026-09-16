/**
 * demoTest 等价物（ant-design 模式）：docs demo 即用例。
 *
 * 价值定位：单测是基础（精确行为锁定），demo 批量挂载是**改动后的功能面验证**——
 * 改动一个组件后跑全量 demo，若全部正常渲染且无 console.error，即可认为
 * 功能未破坏、未影响其他功能点（用户工作流：改动 → 跑所有 demo → 判断正确性）。
 *
 * 运行方式：npx vitest run components/_util/__tests__/docs-demo.spec.ts
 * （可 -t "<组件名>" 过滤单个组件的 demo）
 */
import { mount } from '@vue/test-utils';
import type { defineComponent } from 'vue';
import { nextTick } from 'vue';

// docs demo 真源：docs/.vitepress/components/<组件>/<场景>.vue
const modules = import.meta.glob('/docs/.vitepress/components/**/*.vue');

const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b));

// jsdom 盲区豁免清单：这些家族的 demo 依赖 slot-props 的「布局驱动首渲染」
// （table 列模板 #default="{ row }"、draggable/virtualList/virtualScroller 的
//  item 插槽），jsdom 无布局引擎时组件以无参调用 slot → 解构 undefined。
// 真实浏览器行为由 e2e 冒烟（components-basic + jsdom-blind-paths）兜底；
// 此处保留 import 级校验：编译错误 / import 解析失败仍会被抓住。
const LAYOUT_DEPENDENT = /\/(?:draggable|table|virtualList|virtualScroller)\//;

describe('docs demo 全量挂载冒烟（demoTest）', () => {
    // demo 体量守卫：防止 glob 路径失效后本文件静默空跑
    it('demo 清点：docs/.vitepress/components 下应挂载 300+ 个 demo', () => {
        expect(entries.length).toBeGreaterThan(300);
    });

    for (const [demoPath, load] of entries) {
        it(`demo: ${demoPath.split('components/')[1]}`, async () => {
            const errors: string[] = [];
            const origError = console.error;
            console.error = (...args: unknown[]) => {
                errors.push(args.map(String).join(' '));
            };
            try {
                const mod = (await load()) as { default: ReturnType<typeof defineComponent> };
                expect(mod.default).toBeTruthy();
                if (LAYOUT_DEPENDENT.test(demoPath)) {
                    // 豁免家族：仅编译+导入校验（见上方清单注释）
                    return;
                }
                const wrapper = mount(mod.default, { attachTo: document.body });
                await nextTick();
                await nextTick();
                // 挂载产出真实 DOM（demo 模板非空）
                expect(wrapper.element).toBeTruthy();
                wrapper.unmount();
            } finally {
                console.error = origError;
                // 清理 popper/teleport 残留，避免跨 demo 污染
                document.body.innerHTML = '';
            }
            // 挂载期间无 console.error（demo 即用例的正确性标准）
            expect(errors).toEqual([]);
        }, 20000); // changeLocale 等重渲染 demo 需 >5s
    }
});
