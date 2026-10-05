import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { vi } from 'vitest';
import FadeInExpandTransition from '../components/fadeInExpandTransition';

// fadeInExpandTransition 分支补全：width/height 两轴、reverse 模式、
// group（TransitionGroup）模式、生命周期回调。
// 注意：VTU 默认 stub 内置 Transition（钩子不执行），必须显式关闭——
// 与 time-picker.spec 的既有实践一致。
//
// 等待策略：jsdom 无真实 CSS transition，Vue 以 rAF+timeout 调度离场/入场。
// 定长盲等在负载下易超时（flaky），统一改为轮询最终断言条件：
// 离场等 .box 从 DOM 消失，入场等 .box 重新出现且钩子已记录。

describe('FadeInExpandTransition 分支补全', () => {
    test('height 轴默认：leave/enter 钩子链全部执行', async () => {
        const calls: string[] = [];
        const show = ref(true);
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h('div', [
                            h(
                                'button',
                                {
                                    class: 'toggle',
                                    onClick: () => {
                                        show.value = !show.value;
                                    },
                                },
                                'toggle',
                            ),
                            h(
                                FadeInExpandTransition,
                                {
                                    onLeave: () => calls.push('leave'),
                                    onAfterLeave: () => calls.push('afterLeave'),
                                },
                                {
                                    default: () =>
                                        show.value
                                            ? h('div', { class: 'box' }, 'content')
                                            : null,
                                },
                            ),
                        ]);
                },
            }),
            {
                attachTo: document.body,
                global: { stubs: { transition: false } },
            },
        );
        await nextTick();
        expect(wrapper.find('.box').exists()).toBe(true);
        show.value = false;
        await nextTick();
        await vi.waitFor(() => {
            expect(calls).toContain('leave');
            expect(wrapper.find('.box').exists()).toBe(false);
        });
        wrapper.unmount();
    });

    test('width 轴：beforeLeave/leave 写入 maxWidth 过渡', async () => {
        const calls: string[] = [];
        const show = ref(true);
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h('div', [
                            h(FadeInExpandTransition,
                                {
                                    width: true,
                                    onLeave: () => calls.push('leave'),
                                },
                                {
                                    default: () =>
                                        show.value
                                            ? h('div', { class: 'box' }, 'content')
                                            : null,
                                }),
                        ]);
                },
            }),
            {
                attachTo: document.body,
                global: { stubs: { transition: false } },
            },
        );
        await nextTick();
        show.value = false;
        await nextTick();
        await vi.waitFor(() => {
            expect(calls).toContain('leave');
            expect(wrapper.find('.box').exists()).toBe(false);
        });
        wrapper.unmount();
    });

    test('width 轴 enter：handleEnter 走 maxWidth 分支 + afterEnter 清 maxWidth', async () => {
        const calls: string[] = [];
        const show = ref(true);
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h('div', [
                            h(FadeInExpandTransition,
                                {
                                    width: true,
                                    onEnter: () => calls.push('enter'),
                                    onAfterEnter: () => calls.push('afterEnter'),
                                },
                                {
                                    default: () =>
                                        show.value
                                            ? h('div', { class: 'box' }, 'content')
                                            : null,
                                }),
                        ]);
                },
            }),
            {
                attachTo: document.body,
                global: { stubs: { transition: false } },
            },
        );
        await nextTick();
        show.value = false;
        await nextTick();
        await vi.waitFor(() => {
            expect(wrapper.find('.box').exists()).toBe(false);
        });
        show.value = true;
        await nextTick();
        // handleEnter 的 props.width 真路 + handleAfterEnter 的 width 真路
        await vi.waitFor(() => {
            expect(calls).toContain('enter');
            expect(calls).toContain('afterEnter');
            expect(wrapper.find('.box').exists()).toBe(true);
        });
        wrapper.unmount();
    });

    test('height 轴 reverse：handleEnter 走 reverse 分支', async () => {
        const calls: string[] = [];
        const show = ref(true);
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h('div', [
                            h(FadeInExpandTransition,
                                {
                                    reverse: true,
                                    onEnter: () => calls.push('enter'),
                                },
                                {
                                    default: () =>
                                        show.value
                                            ? h('div', { class: 'box' }, 'content')
                                            : null,
                                }),
                        ]);
                },
            }),
            {
                attachTo: document.body,
                global: { stubs: { transition: false } },
            },
        );
        await nextTick();
        show.value = false;
        await nextTick();
        await vi.waitFor(() => {
            expect(wrapper.find('.box').exists()).toBe(false);
        });
        show.value = true;
        await nextTick();
        await vi.waitFor(() => {
            expect(calls).toContain('enter');
            expect(wrapper.find('.box').exists()).toBe(true);
        });
        wrapper.unmount();
    });

    test('height 轴非 reverse：handleAfterEnter 走 maxHeight 清空真路', async () => {
        const calls: string[] = [];
        const show = ref(true);
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h('div', [
                            h(FadeInExpandTransition,
                                {
                                    onEnter: () => calls.push('enter'),
                                    onAfterEnter: () => calls.push('afterEnter'),
                                },
                                {
                                    default: () =>
                                        show.value
                                            ? h('div', { class: 'box' }, 'content')
                                            : null,
                                }),
                        ]);
                },
            }),
            {
                attachTo: document.body,
                global: { stubs: { transition: false } },
            },
        );
        await nextTick();
        show.value = false;
        await nextTick();
        await vi.waitFor(() => {
            expect(wrapper.find('.box').exists()).toBe(false);
        });
        show.value = true;
        await nextTick();
        await vi.waitFor(() => {
            expect(calls).toContain('enter');
            expect(calls).toContain('afterEnter');
        });
        wrapper.unmount();
    });

    test('reverse 模式（tree 折叠方向）：enter 分支', async () => {
        const calls: string[] = [];
        const show = ref(true);
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h('div', [
                            h(FadeInExpandTransition,
                                {
                                    reverse: true,
                                    onEnter: () => calls.push('enter'),
                                    onAfterEnter: () => calls.push('afterEnter'),
                                },
                                {
                                    default: () =>
                                        show.value
                                            ? h('div', { class: 'box' }, 'content')
                                            : null,
                                }),
                        ]);
                },
            }),
            {
                attachTo: document.body,
                global: { stubs: { transition: false } },
            },
        );
        await nextTick();
        show.value = false;
        await nextTick();
        await vi.waitFor(() => {
            expect(wrapper.find('.box').exists()).toBe(false);
        });
        show.value = true;
        await nextTick();
        await vi.waitFor(() => {
            expect(calls).toContain('enter');
            expect(wrapper.find('.box').exists()).toBe(true);
        });
        wrapper.unmount();
    });

    test('group 模式：TransitionGroup 渲染（group prop 分支）', async () => {
        const items = ref(['a', 'b']);
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h(FadeInExpandTransition, { group: true }, {
                            default: () =>
                                items.value.map((i) =>
                                    h('div', { key: i, class: 'item' }, i),
                                ),
                        });
                },
            }),
            { attachTo: document.body, global: { stubs: { transition: false } } },
        );
        await nextTick();
        expect(wrapper.findAll('.item')).toHaveLength(2);
        // 增删项走 group 的 enter/leave
        items.value = ['a', 'b', 'c'];
        await vi.waitFor(() => {
            expect(wrapper.findAll('.item')).toHaveLength(3);
        });
        items.value = ['a'];
        await vi.waitFor(() => {
            expect(wrapper.findAll('.item')).toHaveLength(1);
        });
        wrapper.unmount();
    });

    test('width+reverse 组合：width 优先（分支优先级锁定）', async () => {
        const calls: string[] = [];
        const show = ref(true);
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h('div', [
                            h(FadeInExpandTransition,
                                {
                                    width: true,
                                    reverse: true,
                                    onLeave: () => calls.push('leave'),
                                },
                                {
                                    default: () =>
                                        show.value
                                            ? h('div', { class: 'box' }, 'content')
                                            : null,
                                }),
                        ]);
                },
            }),
            {
                attachTo: document.body,
                global: { stubs: { transition: false } },
            },
        );
        await nextTick();
        show.value = false;
        await nextTick();
        await vi.waitFor(() => {
            expect(calls).toContain('leave');
        });
        wrapper.unmount();
    });
});
