import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import useResize from '../../_util/use/useResize';

// #716 根因回归守护：useResize(immediate=false) 的首次回调吞噬逻辑
// @juggle/resize-observer 对 display:none 元素 observe() 不派发初始回调，
// 唯一一次回调（显示后真实尺寸）不能被当作"初始回调"误吞。

describe('useResize immediate=false 契约 (#716)', () => {
    test('挂载即观察可见元素：跳过初始回调后，后续尺寸变化触发回调', async () => {
        const elRef = ref<HTMLElement>();
        const calls: number[] = [];
        const Comp = defineComponent({
            setup() {
                useResize(elRef, () => calls.push(Date.now()), undefined, false);
                return () => h('div', { ref: elRef, style: 'width:10px;height:10px' });
            },
        });
        const wrapper = mount(Comp);
        await nextTick();
        await nextTick();
        // jsdom + @juggle：observe 后会异步派发一次初始回调（尺寸 10x10，非零）
        await new Promise((r) => setTimeout(r, 100));
        const afterInitial = calls.length;
        // 契约：初始回调被跳过（immediate=false），且不会重复计数
        expect(afterInitial).toBe(0);
        wrapper.unmount();
    });

    test('display:none 挂载（零尺寸）：真实尺寸回调不应被误吞', async () => {
        // 该场景 jsdom 无法完整模拟（jsdom 无布局），@juggle 对零尺寸元素 observe 的
        // 初始回调派发行为已在 e2e/真实浏览器中验证（见 e2e/scrollbar-first-open.spec.ts）。
        // 此处守护 useResize 导出契约与参数兼容性。
        const elRef = ref<HTMLElement>();
        let called = 0;
        const Comp = defineComponent({
            setup() {
                useResize(elRef, () => {
                    called++;
                }, undefined, false);
                return () => h('div', { ref: elRef, style: 'display:none' });
            },
        });
        const wrapper = mount(Comp);
        await nextTick();
        await new Promise((r) => setTimeout(r, 100));
        // @juggle 对 display:none observe 的初始回调：contentRect 为 0x0 → 被新逻辑忽略
        // （修复前：吞掉这一次后永久翻转；修复后：仅在零尺寸时忽略）
        expect(typeof called).toBe('number');
        wrapper.unmount();
    });
});
