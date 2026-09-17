import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import FadeInExpandTransition from '../components/fadeInExpandTransition';

// fadeInExpandTransition 分支补全：width/height 两轴、reverse 模式、
// group（TransitionGroup）模式、生命周期回调。
// 注意：VTU 默认 stub 内置 Transition（钩子不执行），必须显式关闭——
// 与 time-picker.spec 的既有实践一致。

const mountToggler = (transitionProps: Record<string, any> = {}) => {
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
                            transitionProps,
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
    return { wrapper, show };
};

describe('FadeInExpandTransition 分支补全', () => {
    test('height 轴默认：leave/enter 钩子链全部执行', async () => {
        const calls: string[] = [];
        const { wrapper, show } = mountToggler({
            onLeave: () => calls.push('leave'),
            onAfterLeave: () => calls.push('afterLeave'),
        });
        await nextTick();
        expect(wrapper.find('.box').exists()).toBe(true);
        show.value = false;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(calls).toContain('leave');
        expect(wrapper.find('.box').exists()).toBe(false);
        wrapper.unmount();
    });

    test('width 轴：beforeLeave/leave 写入 maxWidth 过渡', async () => {
        const calls: string[] = [];
        const { wrapper, show } = mountToggler({
            width: true,
            onLeave: () => calls.push('leave'),
        });
        await nextTick();
        show.value = false;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(calls).toContain('leave');
        expect(wrapper.find('.box').exists()).toBe(false);
        wrapper.unmount();
    });

    test('width 轴 enter：handleEnter 走 maxWidth 分支 + afterEnter 清 maxWidth', async () => {
        const calls: string[] = [];
        const { wrapper, show } = mountToggler({
            width: true,
            onEnter: () => calls.push('enter'),
            onAfterEnter: () => calls.push('afterEnter'),
        });
        await nextTick();
        show.value = false;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(wrapper.find('.box').exists()).toBe(false);
        show.value = true;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        // handleEnter 的 props.width 真路 + handleAfterEnter 的 width 真路
        expect(calls).toContain('enter');
        expect(calls).toContain('afterEnter');
        expect(wrapper.find('.box').exists()).toBe(true);
        wrapper.unmount();
    });

    test('height 轴 reverse：handleEnter 走 reverse 分支', async () => {
        const calls: string[] = [];
        const { wrapper, show } = mountToggler({
            reverse: true,
            onEnter: () => calls.push('enter'),
        });
        await nextTick();
        show.value = false;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(wrapper.find('.box').exists()).toBe(false);
        show.value = true;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(calls).toContain('enter');
        expect(wrapper.find('.box').exists()).toBe(true);
        wrapper.unmount();
    });

    test('height 轴非 reverse：handleAfterEnter 走 maxHeight 清空真路', async () => {
        const calls: string[] = [];
        const { wrapper, show } = mountToggler({
            onEnter: () => calls.push('enter'),
            onAfterEnter: () => calls.push('afterEnter'),
        });
        await nextTick();
        show.value = false;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        show.value = true;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(calls).toContain('enter');
        expect(calls).toContain('afterEnter');
        wrapper.unmount();
    });

    test('reverse 模式（tree 折叠方向）：enter 分支', async () => {
        const calls: string[] = [];
        const { wrapper, show } = mountToggler({
            reverse: true,
            onEnter: () => calls.push('enter'),
            onAfterEnter: () => calls.push('afterEnter'),
        });
        await nextTick();
        show.value = false;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(wrapper.find('.box').exists()).toBe(false);
        show.value = true;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(calls).toContain('enter');
        expect(wrapper.find('.box').exists()).toBe(true);
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
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(wrapper.findAll('.item')).toHaveLength(3);
        items.value = ['a'];
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(wrapper.findAll('.item')).toHaveLength(1);
        wrapper.unmount();
    });

    test('width+reverse 组合：width 优先（分支优先级锁定）', async () => {
        const calls: string[] = [];
        const { wrapper, show } = mountToggler({
            width: true,
            reverse: true,
            onLeave: () => calls.push('leave'),
        });
        await nextTick();
        show.value = false;
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        expect(calls).toContain('leave');
        wrapper.unmount();
    });
});
