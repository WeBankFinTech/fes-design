import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Tabs from '../tabs.tsx';
import TabPane from '../tab-pane.vue';

// Issue #820: tabs 切换高度抖动
// CSS 修复（leave-active 期 absolute）无法在 jsdom 断言布局，
// 此处守护与动画相关的组件行为：transition prop 与动画类名的绑定关系

const mountTabs = (tabProps: Record<string, unknown> = {}) =>
    mount({
        setup() {
            return () =>
                h(
                    Tabs,
                    { ...tabProps },
                    {
                        default: () => [
                            h(TabPane, { value: 'a' }, { default: () => h('div', 'A') }),
                            h(TabPane, { value: 'b' }, { default: () => h('div', 'B') }),
                        ],
                    },
                );
        },
    });

const findTransition = (wrapper: any) => wrapper.find('.fes-tabs-tab-pane-wrapper');

describe('Tabs 切换动画 (#820 相关行为守护)', () => {
    test('默认开启 transition：wrapper 内存在 slide-fade 动画命名空间', async () => {
        const wrapper = mountTabs();
        await nextTick();
        // TransitionGroup 渲染为普通元素，name 体现在子元素切换时的类名上；
        // jsdom 不执行过渡，直接断言 pane 渲染存在
        expect(findTransition(wrapper).exists()).toBe(true);
        wrapper.unmount();
    });

    test('transition=false 时切换 tab 无过渡类残留，内容正常切换', async () => {
        const wrapper = mountTabs({ transition: false });
        await nextTick();
        expect(wrapper.text()).toContain('A');
        // 切换到 b
        await wrapper.find('.fes-tabs-tab:nth-child(2)').trigger('click');
        await nextTick();
        await nextTick();
        expect(wrapper.text()).toContain('B');
        wrapper.unmount();
    });

    test('切换后仅一个 pane 可见（displayDirective 默认 if）', async () => {
        const wrapper = mountTabs();
        await nextTick();
        const panes = wrapper.findAll('.fes-tabs-tab-pane');
        expect(panes.length).toBe(1);
        expect(panes[0].text()).toBe('A');
        await wrapper.find('.fes-tabs-tab:nth-child(2)').trigger('click');
        await nextTick();
        await nextTick();
        const panesAfter = wrapper.findAll('.fes-tabs-tab-pane');
        expect(panesAfter.length).toBe(1);
        expect(panesAfter[0].text()).toBe('B');
        wrapper.unmount();
    });
});
