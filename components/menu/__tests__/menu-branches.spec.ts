import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Menu from '../menu';
import MenuItem from '../menuItem';
import SubMenu from '../subMenu';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('menu');
const subPrefixCls = getPrefixCls('sub-menu');

// 分支可达性分析（不改源码前提下，以下两条分支无法通过公开 API 驱动，保留未覆盖）：
// - menu.tsx:94 cond-expr 的 true 路径（mode==='horizontal' || collapsed 时求值 accordion）：
//   horizontal / collapsed 均走 Popper 渲染（renderWithPopper=true），子菜单 wrapper 不绑定
//   onClick，handleSubMenuExpand 仅由「垂直非折叠」模式的点击触发，因此 accordion.value
//   不会在 horizontal/collapsed 状态下被读取。
// - menu.tsx:69 flatNodes 的默认参数（nodes = []）：两处调用（75/87 行）均显式传参，
//   且 75 行有 node.children?.length 守卫，实参不会是 undefined。

const treeOptions = [
    {
        value: 'sub1',
        label: '父菜单一',
        children: [
            { value: 'c1', label: '子项1' },
            { value: 'c2', label: '子项2' },
        ],
    },
    { value: 'top', label: '独立项' },
];

const mountMenu = (props: Record<string, unknown> = {}) =>
    mount(Menu, {
        props: { mode: 'vertical', ...props },
        attachTo: document.body,
    });

afterEach(() => {
    document.body.innerHTML = '';
});

describe('FMenu 分支补全', () => {
    test('horizontal 模式点击菜单项后关闭所有子菜单（clickMenuItem 收尾循环）', async () => {
        const wrapper = mountMenu({ mode: 'horizontal', options: treeOptions });
        await nextTick();
        // 初始：一级子菜单箭头为收起态
        let arrow = wrapper.find(`.${subPrefixCls}-arrow`);
        expect(arrow.exists()).toBe(true);
        expect(arrow.classes()).not.toContain('is-opened');
        // hover 展开子菜单（Popper 路径），箭头进入 is-opened
        const subWrapper = wrapper.find(`.${subPrefixCls}-wrapper`);
        expect(subWrapper.exists()).toBe(true);
        await subWrapper.trigger('mouseenter');
        await vi.waitFor(() => {
            arrow = wrapper.find(`.${subPrefixCls}-arrow`);
            expect(arrow.classes()).toContain('is-opened');
        });
        // 点击普通项：renderWithPopper=true → 遍历 children 关闭所有 subMenu
        const top = wrapper
            .findAll(`.${prefixCls}-item`)
            .find((i) => i.text() === '独立项');
        expect(top).toBeTruthy();
        await top!.trigger('click');
        await nextTick();
        arrow = wrapper.find(`.${subPrefixCls}-arrow`);
        expect(arrow.classes()).not.toContain('is-opened');
        expect(wrapper.emitted('select')![0][0]).toMatchObject({ value: 'top' });
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('top');
        wrapper.unmount();
    });

    test('垂直非折叠模式点击菜单项：renderWithPopper=false 不进入关闭循环', async () => {
        const wrapper = mountMenu({ options: treeOptions });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).classes()).toContain('is-vertical');
        const top = wrapper
            .findAll(`.${prefixCls}-item`)
            .find((i) => i.text() === '独立项');
        expect(top).toBeTruthy();
        await top!.trigger('click');
        await nextTick();
        expect(top!.classes()).toContain('is-active');
        expect(wrapper.emitted('select')![0][0]).toMatchObject({ value: 'top' });
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('top');
        // 非折叠垂直模式：选择行为不触碰 expandedKeys
        expect(wrapper.emitted('update:expandedKeys')).toBeUndefined();
        wrapper.unmount();
    });

    test('defaultExpandAll：扁平化收集有值/无值子菜单并全部展开', async () => {
        const options = [
            {
                value: 'sub1',
                label: '子菜单一',
                children: [{ value: 's1-1', label: '子项1' }],
            },
            // 无 value 的子菜单：flatNodes 回退 uid（node.value || node.uid 第二路径）
            { label: '子菜单二', children: [{ value: 's2-1', label: '子项2' }] },
            // 分组节点：type 非 subMenu 不收集，但其子项参与遍历
            {
                value: 'g1',
                label: '分组',
                isGroup: true,
                children: [{ value: 'g1-1', label: '组内项' }],
            },
            { value: 'plain', label: '普通项' },
        ] as any;
        const wrapper = mountMenu({ defaultExpandAll: true, options });
        await nextTick();
        const emits = wrapper.emitted('update:expandedKeys');
        expect(emits).toBeTruthy();
        // sub1 收集 value，无值子菜单收集 uid；分组与普通项不收集
        const keys = emits![0][0] as (string | number)[];
        expect(keys).toHaveLength(2);
        expect(keys).toContain('sub1');
        expect(keys.some((k) => typeof k === 'number')).toBe(true);
        // 两个子菜单的子项容器均展开
        const childrenEls = wrapper.findAll(`.${subPrefixCls}-children`);
        expect(childrenEls).toHaveLength(2);
        childrenEls.forEach((el) => {
            expect(el.attributes('style') || '').not.toContain('display: none');
        });
        wrapper.unmount();
    });

    test('accordion 手风琴：展开第二个子菜单时先清空再展开', async () => {
        const options = [
            {
                value: 'sub1',
                label: '子菜单一',
                children: [{ value: 's1-1', label: '子项1' }],
            },
            {
                value: 'sub2',
                label: '子菜单二',
                children: [{ value: 's2-1', label: '子项2' }],
            },
        ];
        const wrapper = mountMenu({ accordion: true, options });
        await nextTick();
        const getSubWrappers = () => wrapper.findAll(`.${subPrefixCls}-wrapper`);
        expect(getSubWrappers()).toHaveLength(2);
        // 展开第一个：先过滤清空（indexPath 不含旧 key）再写入 sub1
        await getSubWrappers()[0].trigger('click');
        await nextTick();
        await getSubWrappers()[1].trigger('click');
        await nextTick();
        await nextTick();
        const emits = wrapper.emitted('update:expandedKeys')!;
        expect(emits).toHaveLength(4);
        expect(emits[0][0]).toEqual([]);
        expect(emits[1][0]).toEqual(['sub1']);
        expect(emits[2][0]).toEqual([]);
        expect(emits[3][0]).toEqual(['sub2']);
        // sub1 箭头收回、sub2 箭头展开
        const arrows = wrapper.findAll(`.${subPrefixCls}-arrow`);
        expect(arrows[0].classes()).not.toContain('is-opened');
        expect(arrows[1].classes()).toContain('is-opened');
        wrapper.unmount();
    });

    test('collapsed 由 true 切回 false：不清空 expandedKeys 且恢复内联渲染', async () => {
        const wrapper = mountMenu({ collapsed: true, options: treeOptions });
        await nextTick();
        await wrapper.setProps({ collapsed: false });
        await nextTick();
        // watch 回调 value=false 路径：不触发清空
        expect(wrapper.emitted('update:expandedKeys')).toBeUndefined();
        expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(
            'is-collapsed',
        );
        // 恢复内联渲染：子项容器存在且保持收起
        const childrenEl = wrapper.find(`.${subPrefixCls}-children`);
        expect(childrenEl.exists()).toBe(true);
        expect(childrenEl.attributes('style')).toContain('display: none');
        // 内联模式下点击标题可展开（非 onlyIcon，箭头恢复渲染）
        await wrapper.find(`.${subPrefixCls}-wrapper`).trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:expandedKeys')![0][0]).toEqual(['sub1']);
        expect(wrapper.find(`.${subPrefixCls}-arrow`).classes()).toContain(
            'is-opened',
        );
        wrapper.unmount();
    });

    test('无 value 的 SubMenu：expandedKey 回退组件 uid', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'vertical', modelValue: 'x' },
            slots: {
                default: () => [
                    h(SubMenu, { key: 's', label: '无值子菜单' }, {
                        default: () => [
                            h(MenuItem, { key: 'c', value: 'c1', label: '子项' }),
                        ],
                    }),
                    h(MenuItem, { key: 'x', value: 'x', label: '普通项' }),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        const sub = wrapper.findComponent({ name: 'FSubMenu' });
        expect(sub.exists()).toBe(true);
        await wrapper.find(`.${subPrefixCls}-wrapper`).trigger('click');
        await nextTick();
        const emits = wrapper.emitted('update:expandedKeys');
        expect(emits).toBeTruthy();
        expect(emits![0][0]).toEqual([(sub.vm.$ as any).uid]);
        expect(
            wrapper.find(`.${subPrefixCls}-children`).attributes('style') || '',
        ).not.toContain('display: none');
        wrapper.unmount();
    });

    test('inverted 反转样式类名', async () => {
        const wrapper = mountMenu({
            inverted: true,
            options: [{ value: '1', label: '项' }],
        });
        await nextTick();
        const root = wrapper.find(`.${prefixCls}`);
        expect(root.classes()).toContain('is-inverted');
        expect(root.classes()).toContain('is-vertical');
        wrapper.unmount();
    });

    test('options 的 icon/label 为函数时按函数渲染并可选中', async () => {
        const options = [
            {
                value: 'fn1',
                label: () => '函数标签',
                icon: () => h('span', { class: 'fn-icon' }, '★'),
            },
            { value: 'fn2', label: '普通标签' },
        ] as any;
        const wrapper = mountMenu({ options });
        await nextTick();
        expect(wrapper.find('.fn-icon').exists()).toBe(true);
        expect(wrapper.text()).toContain('函数标签');
        expect(wrapper.text()).toContain('普通标签');
        const item = wrapper.findAll(`.${prefixCls}-item`)[0];
        await item.trigger('click');
        await nextTick();
        expect(wrapper.emitted('select')![0][0]).toMatchObject({ value: 'fn1' });
        expect(item.classes()).toContain('is-active');
        wrapper.unmount();
    });
});
