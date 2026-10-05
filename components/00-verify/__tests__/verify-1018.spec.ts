// Issue #1018 [Bug] FMenu options + defaultExpandAll 子菜单项不渲染
// 复核结论：NOT_A_BUG。当前实现（#1034/#1040 重构后）options +
// defaultExpandAll 工作正常：
//  - vertical：子项内联渲染，wrapper.text() 直接可见；
//  - horizontal：子菜单经 Popper teleport 到 document.body，
//    wrapper.text() 看不到属预期，应从 document.body.textContent 断言。
// 本文件保留为正式回归测试：锁定 defaultExpandAll 后所有子菜单展开、子项渲染。
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Menu from '../../menu/menu';

describe('Issue #1018 FMenu options + defaultExpandAll（回归）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    const OPTIONS = [
        {
            value: 'g1',
            label: '分组1',
            type: 'subMenu',
            children: [
                { value: 'i1', label: '项1', type: 'item' },
                { value: 'i2', label: '项2', type: 'item' },
            ],
        },
        { value: 'i3', label: '项3', type: 'item' },
    ];

    const mountCase = (mode: 'vertical' | 'horizontal') =>
        mount(Menu, {
            props: {
                mode,
                options: OPTIONS,
                defaultExpandAll: true,
                modelValue: 'i1',
            },
            attachTo: document.body,
        });

    test('vertical：defaultExpandAll 展开子菜单，子项直接渲染', async () => {
        const wrapper = mountCase('vertical');
        await nextTick();
        await nextTick();
        expect(wrapper.text()).toContain('分组1');
        expect(wrapper.text()).toContain('项1');
        expect(wrapper.text()).toContain('项2');
        expect(wrapper.text()).toContain('项3');
        // 展开态：子菜单箭头呈打开样式
        const opened = wrapper.findAll('.fes-sub-menu-arrow.is-opened');
        expect(opened.length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('horizontal：defaultExpandAll 子菜单经 Popper teleport 到 body 渲染', async () => {
        const wrapper = mountCase('horizontal');
        await nextTick();
        await nextTick();
        expect(wrapper.text()).toContain('分组1');
        expect(wrapper.text()).toContain('项3');
        // 子项 teleport 到 document.body（Popper），不在 wrapper 内，
        // 从 body.textContent 断言（issue 误判「不渲染」的根源）
        expect(document.body.textContent).toContain('项1');
        expect(document.body.textContent).toContain('项2');
        wrapper.unmount();
    });

    test('vertical：defaultExpandAll 展开后点击子项触发 select', async () => {
        const wrapper = mountCase('vertical');
        await nextTick();
        await nextTick();
        const item2 = wrapper
            .findAll('.fes-menu-item')
            .find((i) => i.text() === '项2');
        expect(item2).toBeTruthy();
        await item2!.trigger('click');
        await nextTick();
        const select = wrapper.emitted('select');
        expect(select).toBeTruthy();
        expect(select![select!.length - 1][0]).toEqual({ value: 'i2' });
        wrapper.unmount();
    });

    // 深层嵌套 subMenu + accordion：同样应全部展开、无递归更新崩溃
    test('vertical 深层嵌套 + accordion：defaultExpandAll 全展开无递归崩溃', async () => {
        const deepOptions = [
            {
                value: 'a',
                label: 'A',
                children: [
                    {
                        value: 'a-b',
                        label: 'AB',
                        children: [
                            {
                                value: 'a-b-c',
                                label: 'ABC',
                                children: [
                                    { value: 'leaf', label: '叶子' },
                                ],
                            },
                        ],
                    },
                ],
            },
            { value: 'top', label: '顶层' },
        ];
        const wrapper = mount(Menu, {
            props: {
                mode: 'vertical',
                options: deepOptions,
                defaultExpandAll: true,
                accordion: true,
                modelValue: 'leaf',
            },
            attachTo: document.body,
        });
        for (let i = 0; i < 5; i++) {
            await nextTick();
        }
        expect(wrapper.text()).toContain('叶子');
        expect(wrapper.text()).toContain('AB');
        expect(wrapper.text()).toContain('ABC');
        wrapper.unmount();
    });
});
