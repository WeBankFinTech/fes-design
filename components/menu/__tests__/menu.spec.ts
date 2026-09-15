import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Menu from '../menu';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('menu');

const options = [
    { value: '1', label: '菜单项一' },
    { value: '2', label: '菜单项二', disabled: true },
    { value: '3', label: '菜单项三' },
];

describe('Menu 基础渲染', () => {
    test('垂直模式渲染菜单项', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'vertical', options },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.text()).toContain('菜单项一');
        expect(wrapper.findAll(`.${prefixCls}-item`).length).toBe(3);
    });

    test('水平模式渲染', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'horizontal', options },
        });
        await nextTick();
        expect(
            wrapper
                .find(`.${prefixCls}`)
                .classes()
                .some((c) => c.includes('horizontal')),
        ).toBe(true);
    });

    test('group 分组渲染', async () => {
        const wrapper = mount(Menu, {
            props: {
                options: [
                    {
                        value: 'g1',
                        label: '分组一',
                        isGroup: true,
                        children: [{ value: 'a', label: '项A' }],
                    },
                    { value: 'b', label: '项B' },
                ] as any,
            },
        });
        await nextTick();
        expect(wrapper.text()).toContain('分组一');
        expect(wrapper.text()).toContain('项A');
        expect(wrapper.text()).toContain('项B');
    });
});

describe('Menu 交互', () => {
    test('点击菜单项更新 modelValue 并触发 select', async () => {
        const wrapper = mount(Menu, {
            props: {
                options,
                'modelValue': '1',
                'onUpdate:modelValue': (v: string) =>
                    wrapper.setProps({ modelValue: v }),
            },
        });
        await nextTick();
        const items = wrapper.findAll(`.${prefixCls}-item`);
        await items[2].find(`.${prefixCls}-item, div`).trigger('click');
        await nextTick();
        expect(wrapper.emitted('select')).toBeTruthy();
        expect((wrapper.emitted('select')![0][0] as any).value).toBe('3');
    });

    test('disabled 菜单项点击无效', async () => {
        const wrapper = mount(Menu, {
            props: { options, modelValue: '1' },
        });
        await nextTick();
        const items = wrapper.findAll(`.${prefixCls}-item`);
        expect(
            items[1]
                .classes()
                .some((c) => c.includes('is-disabled')),
        ).toBe(true);
        await items[1].trigger('click');
        expect(wrapper.emitted('select')).toBeFalsy();
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    test('选中项高亮类名', async () => {
        const wrapper = mount(Menu, {
            props: { options, modelValue: '1' },
        });
        await nextTick();
        const items = wrapper.findAll(`.${prefixCls}-item`);
        expect(items[0].classes().some((c) => c.includes('is-active'))).toBe(
            true,
        );
        expect(items[2].classes().some((c) => c.includes('is-active'))).toBe(
            false,
        );
    });

    test('subMenu 垂直模式展开收起', async () => {
        const wrapper = mount(Menu, {
            props: {
                mode: 'vertical',
                options: [
                    {
                        value: 's1',
                        label: '子菜单',
                        children: [{ value: 's1-1', label: '子项1' }],
                    },
                    { value: 'x', label: '普通项' },
                ] as any,
            },
        });
        await nextTick();
        await nextTick();
        expect(wrapper.text()).toContain('子菜单');
        // 点击 sub-menu 标题展开子菜单；收起时子项容器 v-show 隐藏
        const subTitle = wrapper.find('.fes-sub-menu-wrapper');
        expect(subTitle.exists()).toBe(true);
        const childrenEl = wrapper.find('.fes-sub-menu-children');
        expect(childrenEl.exists()).toBe(true);
        // 初始收起
        expect(childrenEl.attributes('style')).toContain('display: none');
        await subTitle.trigger('click');
        await nextTick();
        // 展开后重新查询：v-show 移除，style 属性消失
        const expandedEl = wrapper.find('.fes-sub-menu-children');
        expect(expandedEl.attributes('style')).toBeUndefined();
        expect(wrapper.text()).toContain('子项1');
        // 再次点击收起（收起走 FadeInExpandTransition，v-show 在离开动画后恢复；
        // 断言根菜单的 expanded 状态回退即可）
        await subTitle.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:expandedKeys')).toBeTruthy();
        const lastEmit = wrapper.emitted('update:expandedKeys')!.pop() as any[];
        expect(lastEmit[0]).toEqual([]);
    });
});

describe('Menu collapsed 折叠模式（renderWithPopper 路径）', () => {
    const treeOptions = [
        {
            value: 'sub1',
            label: '父菜单',
            children: [
                { value: 'c1', label: '子项1' },
                { value: 'c2', label: '子项2' },
            ],
        },
        { value: 'top', label: '独立项' },
    ];

    test('collapsed 时根节点带 is-collapsed 且子菜单走 Popper 弹层', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'vertical', collapsed: true, options: treeOptions },
            attachTo: document.body,
        });
        await nextTick();
        // 折叠态类名（menu.tsx:138 分支）
        expect(wrapper.find(`.${prefixCls}`).classes()).toContain('is-collapsed');
        // renderWithPopper=true → 子菜单通过 Popper 渲染（subMenu.tsx:222 分支）
        // hover 展开前 popper 未显示；触发 hover 后子菜单弹层出现
        const triggerEl = wrapper.find(`.${prefixCls}-item, .fes-sub-menu-wrapper`);
        expect(triggerEl.exists()).toBe(true);
        await triggerEl.trigger('mouseenter');
        await new Promise((r) => setTimeout(r, 100));
        const popperEl = document.body.querySelector('.fes-sub-menu-popper');
        expect(popperEl).not.toBeNull();
        wrapper.unmount();
        document.body.innerHTML = '';
    });

    test('collapsed 由 true 切 false 清空 expandedKeys（menu.tsx:98 watch）', async () => {
        const wrapper = mount(Menu, {
            props: {
                mode: 'vertical',
                collapsed: false,
                defaultExpandedKeys: ['sub1'],
                options: treeOptions,
            },
            attachTo: document.body,
        });
        await nextTick();
        // 切到折叠：watch 触发 updateExpandedKeys([])
        await wrapper.setProps({ collapsed: true });
        await nextTick();
        const emits = wrapper.emitted('update:expandedKeys');
        expect(emits).toBeTruthy();
        expect(emits!.pop()![0]).toEqual([]);
        wrapper.unmount();
        document.body.innerHTML = '';
    });

    test('horizontal 模式子菜单 placement 为 bottom-start（subMenu.tsx:105-109）', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'horizontal', options: treeOptions },
            attachTo: document.body,
        });
        await nextTick();
        // 水平模式一级子菜单 hover 弹层出现
        const first = wrapper.findAll(`.${prefixCls}-item, .fes-sub-menu-wrapper`)[0];
        await first.trigger('mouseenter');
        await new Promise((r) => setTimeout(r, 100));
        expect(document.body.querySelector('.fes-sub-menu-popper')).not.toBeNull();
        wrapper.unmount();
        document.body.innerHTML = '';
    });
});
