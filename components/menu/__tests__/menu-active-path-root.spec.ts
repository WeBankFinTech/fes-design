import { type VueWrapper, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, test } from 'vitest';
import Menu from '../menu';
import MenuGroup from '../menuGroup';
import MenuItem from '../menuItem';
import SubMenu from '../subMenu';
import getPrefixCls from '../../_util/getPrefixCls';

const subPrefixCls = getPrefixCls('sub-menu');
const itemPrefixCls = getPrefixCls('menu-item');

// #1040 回归锁定：FMenu 子项选中（点击叶子 或 v-model:modelValue 首帧指向子项）
// 时 <FSubMenu> 抛 Maximum recursive updates（unhandledRejection 出口，
// instance=null 无法拦截）。根因：subMenu.isActive = children.some(child.isActive)
// 在渲染期反向遍历 reactive children（读解包快照），选中态变化与 <FSubMenu>
// 渲染/内建 Transition update 阶段耦合形成自环。
//
// 根治：isActive 改为根菜单按 currentValue 推导的单一事实源
// activeSubMenuKeys（value → 祖先链 FSubMenu keys，MenuItem 挂载期注册）判包含，
// 渲染只读、无 children 读写。本文件覆盖：default-slot 与 options 两种渲染形态、
// 垂直/水平、受控/非受控、首帧指向子项、嵌套/分组、defaultExpandAll、collapsed。
// 垂直用例使用真实 FadeInExpandTransition（不桩替），锁定真实环境 0 rejection。

const HoverPopperStub = {
    name: 'FPopper',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: `
        <div class="popper-stub">
            <div
                class="popper-stub-trigger"
                @mouseenter="$emit('update:modelValue', true)"
                @mouseleave="$emit('update:modelValue', false)"
            >
                <slot name="trigger" />
            </div>
            <slot />
        </div>`,
};

const nestedOptions = [
    {
        value: 'a',
        label: '一级',
        children: [
            {
                value: 'b',
                label: '二级',
                children: [
                    {
                        value: 'c',
                        label: '三级',
                        children: [{ value: 'd', label: '叶子' }],
                    },
                ],
            },
        ],
    },
];

// 进程级 unhandledRejection 采集：#1040 的递归更新错误以此出口抛出，
// console.error 捕获不到（与 time-picker-recursive-updates.spec.ts 同模式）
const captureRejections = () => {
    const rejections: string[] = [];
    const handler = (reason: unknown) => {
        rejections.push(String(reason));
    };
    process.on('unhandledRejection', handler);
    return {
        rejections,
        stop: () => {
            process.off('unhandledRejection', handler);
        },
    };
};

// 等待多个宏/微任务周期，覆盖派生渲染 flush、Transition 钩子与异步链路
const settle = () => new Promise((resolve) => setTimeout(resolve, 150));

// 按 label 文本定位 SubMenu 根元素（嵌套下 findAll 顺序不稳定，用文本锚定）
const findSubMenuByLabel = (
    wrapper: VueWrapper,
    label: string,
) => wrapper.findAll(`.${subPrefixCls}`).find((el) => el.text().includes(label));

const expectSubMenuActive = (
    wrapper: VueWrapper,
    label: string,
    active: boolean,
) => {
    const el = findSubMenuByLabel(wrapper, label);
    expect(el).toBeTruthy();
    expect(el!.classes().includes('is-active')).toBe(active);
};

describe('FMenu #1040 递归更新根治（子项选中 isActive 单一事实源派生）', () => {
    test('垂直 default-slot：展开后点击叶子 → select + item/submenu is-active + 0 rejection（真实 Transition）', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: { mode: 'vertical' },
                slots: {
                    default: () => [
                        h(SubMenu, { key: 's', value: 'sub1', label: '设置' }, {
                            default: () => [
                                h(MenuItem, {
                                    key: 'i',
                                    value: 'item1',
                                    label: '选项一',
                                }),
                            ],
                        }),
                    ],
                },
                attachTo: document.body,
            });
            await nextTick();
            await wrapper.find(`.${subPrefixCls}-wrapper`).trigger('click');
            await nextTick();
            const item = wrapper.find(`.${itemPrefixCls}`);
            expect(item.exists()).toBe(true);
            await item.trigger('click');
            await nextTick();
            expect(wrapper.emitted('select')![0][0]).toMatchObject({
                value: 'item1',
            });
            expect(wrapper.emitted('update:modelValue')![0][0]).toBe('item1');
            // 真实 Transition 下元素可能被替换，重新查询最新引用
            const activeItem = wrapper.find(`.${itemPrefixCls}`);
            expect(activeItem.classes()).toContain('is-active');
            expectSubMenuActive(wrapper, '设置', true);
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('垂直 v-model 首帧即指向子项：真实 Transition 下 0 rejection + 首帧 is-active', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: { mode: 'vertical', modelValue: 'item1' },
                slots: {
                    default: () => [
                        h(SubMenu, { key: 's', value: 'sub1', label: '设置' }, {
                            default: () => [
                                h(MenuItem, {
                                    key: 'i',
                                    value: 'item1',
                                    label: '选项一',
                                }),
                            ],
                        }),
                    ],
                },
                attachTo: document.body,
            });
            await nextTick();
            expect(wrapper.find(`.${itemPrefixCls}`).classes()).toContain(
                'is-active',
            );
            expectSubMenuActive(wrapper, '设置', true);
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('水平（Popper 桩）hover 打开后点叶子 → select + submenu is-active + 面板收起 + 0 rejection', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: {
                    mode: 'horizontal',
                    options: [
                        {
                            value: 'sub1',
                            label: '子菜单一',
                            children: [{ value: 'c1', label: '子项1' }],
                        },
                    ],
                },
                global: { stubs: { FPopper: HoverPopperStub } },
                attachTo: document.body,
            });
            await nextTick();
            await wrapper.find('.popper-stub-trigger').trigger('mouseenter');
            await nextTick();
            const item = wrapper.find(`.${itemPrefixCls}`);
            expect(item.exists()).toBe(true);
            await item.trigger('click');
            await nextTick();
            expect(wrapper.emitted('select')![0][0]).toMatchObject({
                value: 'c1',
            });
            // 选中子项后子菜单 is-active（水平 Popper 内容常驻，DOM 稳定）
            expectSubMenuActive(wrapper, '子菜单一', true);
            // 选择后收敛 expandedKeys → Popper modelValue 回 false（面板收起）
            const expandEmit = wrapper.emitted('update:expandedKeys')!;
            expect(expandEmit[expandEmit.length - 1][0]).toEqual([]);
            expect(
                wrapper.findComponent({ name: 'FPopper' }).props('modelValue'),
            ).toBe(false);
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('options 渲染形态：同 default-slot 收敛，受控 modelValue 切换子项 → is-active 迁移 + 0 rejection', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: {
                    mode: 'vertical',
                    modelValue: 'c1',
                    options: [
                        {
                            value: 'sub1',
                            label: '子菜单一',
                            children: [{ value: 'c1', label: '子项1' }],
                        },
                        {
                            value: 'sub2',
                            label: '子菜单二',
                            children: [{ value: 'c2', label: '子项2' }],
                        },
                    ],
                },
                attachTo: document.body,
            });
            await nextTick();
            expectSubMenuActive(wrapper, '子菜单一', true);
            expectSubMenuActive(wrapper, '子菜单二', false);
            // 受控切换到另一子菜单内的项：is-active 迁移
            await wrapper.setProps({ modelValue: 'c2' });
            await nextTick();
            expectSubMenuActive(wrapper, '子菜单一', false);
            expectSubMenuActive(wrapper, '子菜单二', true);
            // 指向根级独立项：无子菜单激活
            await wrapper.setProps({
                options: [
                    ...(wrapper.props('options') as unknown[]),
                    { value: 'c3', label: '独立项', children: undefined },
                ],
            });
            await wrapper.setProps({ modelValue: 'c3' });
            await nextTick();
            wrapper.findAll(`.${subPrefixCls}`).forEach((el) => {
                expect(el.classes()).not.toContain('is-active');
            });
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('二级嵌套：选中深层叶子 → 两个祖先 SubMenu 均 is-active + 0 rejection', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: { mode: 'vertical', modelValue: 'd', options: nestedOptions },
                attachTo: document.body,
            });
            await nextTick();
            expectSubMenuActive(wrapper, '一级', true);
            expectSubMenuActive(wrapper, '二级', true);
            expectSubMenuActive(wrapper, '三级', true);
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('MenuGroup 包裹的子项选中：SubMenu 仍 is-active（group 透明）+ 0 rejection', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: { mode: 'vertical', modelValue: 'g1' },
                slots: {
                    default: () => [
                        h(SubMenu, { value: 'sub1', label: '设置' }, {
                            default: () => [
                                h(MenuGroup, { label: '分组' }, {
                                    default: () => [
                                        h(MenuItem, {
                                            value: 'g1',
                                            label: '组内项',
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                },
                attachTo: document.body,
            });
            await nextTick();
            expect(wrapper.find(`.${itemPrefixCls}`).classes()).toContain(
                'is-active',
            );
            expectSubMenuActive(wrapper, '设置', true);
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('垂直 collapsed（Popper 分支）：hover 展开点叶子 → submenu is-active + 收起 + 0 rejection', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: {
                    mode: 'vertical',
                    collapsed: true,
                    options: [
                        {
                            value: 'sub1',
                            label: '子菜单一',
                            children: [{ value: 'c1', label: '子项1' }],
                        },
                    ],
                },
                global: { stubs: { FPopper: HoverPopperStub } },
                attachTo: document.body,
            });
            await nextTick();
            await wrapper.find('.popper-stub-trigger').trigger('mouseenter');
            await nextTick();
            const item = wrapper.find(`.${itemPrefixCls}`);
            expect(item.exists()).toBe(true);
            await item.trigger('click');
            await nextTick();
            expect(wrapper.emitted('select')![0][0]).toMatchObject({
                value: 'c1',
            });
            expectSubMenuActive(wrapper, '子菜单一', true);
            const expandEmit = wrapper.emitted('update:expandedKeys')!;
            expect(expandEmit[expandEmit.length - 1][0]).toEqual([]);
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('defaultExpandAll 展开态下点击叶子：无副作用击穿，0 rejection', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: {
                    mode: 'vertical',
                    defaultExpandAll: true,
                    options: [
                        {
                            value: 'sub1',
                            label: '子菜单一',
                            children: [{ value: 'c1', label: '子项1' }],
                        },
                    ],
                },
                attachTo: document.body,
            });
            await nextTick();
            const item = wrapper.find(`.${itemPrefixCls}`);
            expect(item.exists()).toBe(true);
            await item.trigger('click');
            await nextTick();
            expect(wrapper.emitted('select')![0][0]).toMatchObject({
                value: 'c1',
            });
            expectSubMenuActive(wrapper, '子菜单一', true);
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });
});
