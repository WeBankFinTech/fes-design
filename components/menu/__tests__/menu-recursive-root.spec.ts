import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, test } from 'vitest';
import Menu from '../menu';
import MenuItem from '../menuItem';
import SubMenu from '../subMenu';
import getPrefixCls from '../../_util/getPrefixCls';

const menuPrefixCls = getPrefixCls('menu');
const subPrefixCls = getPrefixCls('sub-menu');
const itemPrefixCls = getPrefixCls('menu-item');

// #1034 回归锁定：FMenu SubMenu 的展开状态曾是「独立 ref + 与 expandedKeys
// 双向同步」，多写源（trigger 点击 / Popper v-model / clickMenuItem / watch 同步）
// 造成同一 tick 内渲染-写环，Vue 3.5 checkRecursiveUpdates 判定为递归更新并以
// unhandledRejection 抛出（instance=null，errorCaptured/errorHandler 无法拦截）。
//
// 根治（199d1b56 + 本文件配套的 menu.tsx/interface.ts 收敛）：isOpened 收敛为
// rootMenu.currentExpandedKeys 的派生只读值（单一事实源），所有写路径统一走
// updateExpandedKeys。本文件用进程级 unhandledRejection 监听锁定总数为 0。
//
// #1040 追加：jsdom 下「子菜单内叶子被选中（subMenu.isActive 变 true）」曾触发
// <FSubMenu> 渲染自循环（70792954 复现一致，与 Vue 内建 FadeInExpandTransition
// 的 update 阶段耦合），该场景须用受控桩隔离。现 isActive 已改为根菜单
// currentValue 推导的单一事实源（#1040，见 subMenu.tsx/menu.tsx/menuItem.tsx），
// 本用例解锁真实 FadeInExpandTransition（不再桩替），锁定「真实 Transition +
// 子项选中 → is-active + 0 rejection」；#1040 完整矩阵见 menu-active-path-root.spec.ts。

const options = [
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
];

// 受控 Popper 桩：hover 打开/收起映射为 update:modelValue（与真实 FPopper
// trigger=hover 语义一致）；内容常驻 DOM，避免 jsdom 下 Popper 异步定位链路干扰
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

// 进程级 unhandledRejection 采集：#1034 的递归更新错误以此出口抛出，
// console.error 捕获不到（参见 time-picker-recursive-updates.spec.ts）
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

// 等待多个宏/微任务周期，覆盖派生渲染 flush 与异步钩子链
const settle = () => new Promise((resolve) => setTimeout(resolve, 150));

describe('FMenu #1034 递归更新根治（展开状态单一事实源）', () => {
    test('垂直模式：展开子菜单后点击 MenuItem → select + is-active + 0 rejection', async () => {
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
            // 展开子菜单（写 expandedKeys 单一路径）
            await wrapper.find(`.${subPrefixCls}-wrapper`).trigger('click');
            await nextTick();
            const childrenEl = wrapper.find(`.${subPrefixCls}-children`);
            expect(childrenEl.attributes('style') || '').not.toContain(
                'display: none',
            );
            // 点击叶子 MenuItem：触发 select + is-active（含子菜单 isActive 派生链）
            const item = wrapper.find(`.${itemPrefixCls}`);
            expect(item.exists()).toBe(true);
            await item.trigger('click');
            await nextTick();
            expect(wrapper.emitted('select')![0][0]).toMatchObject({
                value: 'item1',
            });
            expect(wrapper.emitted('update:modelValue')![0][0]).toBe('item1');
            // 真实 Transition 下点击后元素可能被替换，重新查询最新引用
            const activeItem = wrapper.find(`.${itemPrefixCls}`);
            expect(activeItem.exists()).toBe(true);
            expect(activeItem.classes()).toContain('is-active');
            // 子菜单 is-active 派生自子项激活态（#1034 修复前该分支触发递归崩溃）
            expect(wrapper.find(`.${subPrefixCls}`).classes()).toContain(
                'is-active',
            );
            // 垂直非折叠：选择不触碰 expandedKeys（仅保留展开时的一次写入）
            expect(wrapper.emitted('update:expandedKeys')).toHaveLength(1);
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('水平模式：hover 打开 Popper 后点根级项收敛 keys → 0 rejection + 面板收起', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: {
                    mode: 'horizontal',
                    options: [
                        ...options,
                        { value: 'top', label: '独立项' },
                    ],
                },
                global: { stubs: { FPopper: HoverPopperStub } },
                attachTo: document.body,
            });
            await nextTick();
            const arrow = wrapper.find(`.${subPrefixCls}-arrow`);
            expect(arrow.exists()).toBe(true);
            expect(arrow.classes()).not.toContain('is-opened');
            // hover 打开：桩转发 update:modelValue(true) → 写 expandedKeys → 派生展开
            await wrapper.find('.popper-stub-trigger').trigger('mouseenter');
            await nextTick();
            expect(arrow.classes()).toContain('is-opened');
            const expandEmit = wrapper.emitted('update:expandedKeys');
            expect(expandEmit).toBeTruthy();
            expect(expandEmit![expandEmit!.length - 1][0]).toEqual(['sub1']);
            // 点击根级菜单项：select + 清空 keys → 派生收起（面板 modelValue 回 false）
            const top = wrapper
                .findAll(`.${itemPrefixCls}`)
                .find((i) => i.text().includes('独立项'));
            expect(top).toBeTruthy();
            await top!.trigger('click');
            await nextTick();
            expect(wrapper.emitted('select')![0][0]).toMatchObject({
                value: 'top',
            });
            const emitList = wrapper.emitted('update:expandedKeys')!;
            expect(emitList[emitList.length - 1][0]).toEqual([]);
            expect(arrow.classes()).not.toContain('is-opened');
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

    test('受控 expandedKeys：挂载/变更派生开合，0 rejection', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: {
                    mode: 'vertical',
                    expandedKeys: ['sub1'],
                    options,
                },
                attachTo: document.body,
            });
            await nextTick();
            // 挂载即派生展开
            let arrows = wrapper.findAll(`.${subPrefixCls}-arrow`);
            expect(arrows).toHaveLength(2);
            expect(arrows[0].classes()).toContain('is-opened');
            expect(arrows[1].classes()).not.toContain('is-opened');
            // 受控变更 → 派生开合翻转
            await wrapper.setProps({ expandedKeys: ['sub2'] });
            await nextTick();
            arrows = wrapper.findAll(`.${subPrefixCls}-arrow`);
            expect(arrows[0].classes()).not.toContain('is-opened');
            expect(arrows[1].classes()).toContain('is-opened');
            // 受控路径不发 update:expandedKeys（外部持有状态）
            expect(wrapper.emitted('update:expandedKeys')).toBeUndefined();
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('defaultExpandAll + options：全部展开且 0 rejection', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: { mode: 'vertical', defaultExpandAll: true, options },
                attachTo: document.body,
            });
            await nextTick();
            const emits = wrapper.emitted('update:expandedKeys');
            expect(emits).toBeTruthy();
            expect(emits![0][0]).toEqual(['sub1', 'sub2']);
            // 全部展开：箭头均 is-opened、子项容器可见
            const arrows = wrapper.findAll(`.${subPrefixCls}-arrow`);
            expect(arrows).toHaveLength(2);
            arrows.forEach((a) => {
                expect(a.classes()).toContain('is-opened');
            });
            wrapper.findAll(`.${subPrefixCls}-children`).forEach((el) => {
                expect(el.attributes('style') || '').not.toContain(
                    'display: none',
                );
            });
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('accordion：展开 A 再展开 B → A 收起，0 rejection', async () => {
        const { rejections, stop } = captureRejections();
        try {
            const wrapper = mount(Menu, {
                props: { mode: 'vertical', accordion: true, options },
                attachTo: document.body,
            });
            await nextTick();
            const wrappers = wrapper.findAll(`.${subPrefixCls}-wrapper`);
            expect(wrappers).toHaveLength(2);
            await wrapper.findAll(`.${subPrefixCls}-wrapper`)[0].trigger('click');
            await nextTick();
            await wrapper.findAll(`.${subPrefixCls}-wrapper`)[1].trigger('click');
            await nextTick();
            await nextTick();
            const arrows = wrapper.findAll(`.${subPrefixCls}-arrow`);
            expect(arrows[0].classes()).not.toContain('is-opened');
            expect(arrows[1].classes()).toContain('is-opened');
            await settle();
            wrapper.unmount();
        } finally {
            stop();
        }
        expect(rejections).toEqual([]);
    });

    test('root class 冒烟：is-vertical / is-horizontal 派生正常', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'vertical', options },
            attachTo: document.body,
        });
        await nextTick();
        expect(wrapper.find(`.${menuPrefixCls}`).classes()).toContain(
            'is-vertical',
        );
        wrapper.unmount();
    });
});
