import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FEllipsis from '../ellipsis.tsx';
import getPrefixCls from '../../_util/getPrefixCls';
import { sleep, wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('ellipsis');
const EL_CLS = `.${prefixCls}`;

afterEach(() => {
    document.body.innerHTML = '';
});

/** 给元素喂真实宽度/高度桩（技能 jsdom 陷阱 #5：offset 系列 jsdom 恒 0） */
const stubLayout = (el: Element, size: Record<string, number>) => {
    for (const [key, value] of Object.entries(size)) {
        Object.defineProperty(el, key, {
            value,
            configurable: true,
            writable: true,
        });
    }
};

// 测量分支实现：ellipsis.tsx L99-108
//   line=1：triggerInner.getBoundingClientRect().width > trigger.width → 省略
//   line>1 ：scrollHeight > offsetHeight → 省略
// 省略 → getDisabled 返回 false（tooltip 可用）；否则 true（tooltip 禁用）。
//
// 不可达说明：ellipsis.tsx L96-98（`if (!trigger) return true`）——getDisabled
// 只被 Tooltip 内层 FPopper 调用（usePopper.computePopper / useTrigger.show、
// hide），而该调用全部发生在 trigger span 挂载之后（组件生命周期保证 ref
// 已赋值），jsdom 下无任何路径能在 ref 未赋值时触发，分支不可达，不硬造。

describe('FEllipsis 测量驱动分支补全', () => {
    test('tooltip=true（布尔）走空对象合并分支且默认包 Tooltip', async () => {
        const wrapper = mount(FEllipsis, {
            props: { content: '纯文本', tooltip: true },
        });
        await nextTick();
        // B1 false 臂：isObject(true) === false → currentTooltipProps = {}
        expect(wrapper.findComponent({ name: 'FTooltip' }).exists()).toBe(true);
        // 触发内容仍渲染（line=1 → 内层 span 包 content）
        expect(wrapper.find(EL_CLS).text()).toContain('纯文本');
        wrapper.unmount();
    });

    test('tooltip.popperStyle 为对象时展开合并（B2 true 臂）', async () => {
        const wrapper = mount(FEllipsis, {
            props: {
                content: 'hover 弹出内容',
                tooltip: {
                    popperStyle: { 'max-width': '320px' },
                },
            },
        });
        await nextTick();
        expect(wrapper.findComponent({ name: 'FTooltip' }).exists()).toBe(true);
        // hover 展示 tooltip 内容；popperStyle 对象被展开（覆盖默认 600px）
        await wrapper.find(EL_CLS).trigger('mouseenter');
        await vi.waitFor(() => {
            const popper = document.querySelector('.fes-popper');
            expect(popper).not.toBeNull();
            expect(popper.textContent).toContain('hover 弹出内容');
        });
        // 内容渲染走 renderContent（无任何插槽时 L131-133）
        await vi.waitFor(() => {
            const wrapperEl = document.querySelector('.fes-popper-wrapper');
            expect(
                (wrapperEl as HTMLElement).style.maxWidth,
            ).toBe('320px');
        });
        wrapper.unmount();
    });

    test('line=1 单行省略：内容宽度超出 trigger 时 tooltip 可用', async () => {
        const wrapper = mount(FEllipsis, {
            props: {
                content: '一段足够长的文本内容用于测量省略',
                line: 1,
                tooltip: {}, // showAfter=0，hover 立即展示
            },
        });
        await nextTick();
        const trigger = wrapper.find(EL_CLS).element;
        // 外层 trigger 宽 100px
        stubLayout(trigger, {
            offsetWidth: 100,
            offsetHeight: 20,
            scrollHeight: 20,
        });
        // 内层文本 span 宽 260px > trigger 100px → 省略 → getDisabled=false
        const inner = trigger.querySelector('span') as HTMLElement;
        expect(inner).not.toBeNull();
        Object.defineProperty(inner, 'getBoundingClientRect', {
            value: () => {
                const rect = {
                    width: 260,
                    height: 20,
                    top: 0,
                    left: 0,
                    right: 260,
                    bottom: 20,
                    x: 0,
                    y: 0,
                    toJSON: () => ({}),
                };
                return rect;
            },
            configurable: true,
        });

        await wrapper.find(EL_CLS).trigger('mouseenter');
        await vi.waitFor(() => {
            const popper = document.querySelector('.fes-popper');
            expect(popper).not.toBeNull();
            expect(popper.textContent).toContain('一段足够长的文本内容');
        });
        wrapper.unmount();
    });

    test('line=1 未省略（内层宽度不超出）时 tooltip 禁用不弹出', async () => {
        const wrapper = mount(FEllipsis, {
            props: { content: '短文本', line: 1, tooltip: {} },
        });
        await nextTick();
        const trigger = wrapper.find(EL_CLS).element;
        stubLayout(trigger, {
            offsetWidth: 100,
            offsetHeight: 20,
            scrollHeight: 20,
        });
        const inner = trigger.querySelector('span') as HTMLElement;
        expect(inner).not.toBeNull();
        Object.defineProperty(inner, 'getBoundingClientRect', {
            value: () => {
                const rect = {
                    width: 40,
                    height: 20,
                    top: 0,
                    left: 0,
                    right: 40,
                    bottom: 20,
                    x: 0,
                    y: 0,
                    toJSON: () => ({}),
                };
                return rect;
            },
            configurable: true,
        });

        await wrapper.find(EL_CLS).trigger('mouseenter');
        // 未省略 → getDisabled()=true → show 被禁用 → 弹层不渲染
        await sleep();
        await wait(30);
        expect(document.querySelector('.fes-popper')).toBeNull();
        wrapper.unmount();
    });

    test('line=2 多行省略：scrollHeight 超出 offsetHeight 时 tooltip 可用', async () => {
        const wrapper = mount(FEllipsis, {
            props: {
                content: h('span', ['第一行', h('br'), '第二行', h('br'), '第三行']),
                line: 2,
                tooltip: {},
            },
        });
        await nextTick();
        const trigger = wrapper.find(EL_CLS).element;
        // 内容高度 40 > 容器 20 → scrollHeight > offsetHeight → 省略
        stubLayout(trigger, {
            offsetWidth: 100,
            offsetHeight: 20,
            scrollHeight: 40,
        });

        await wrapper.find(EL_CLS).trigger('mouseenter');
        await vi.waitFor(() => {
            expect(document.querySelector('.fes-popper')).not.toBeNull();
        });
        wrapper.unmount();
    });
});
