import { type VueWrapper, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Menu from '../menu';
import MenuItem from '../menuItem';
import SubMenu from '../subMenu';
import getPrefixCls from '../../_util/getPrefixCls';

const subPrefixCls = getPrefixCls('sub-menu');
const menuPrefixCls = getPrefixCls('menu');

// 不可达分支说明（不改源码前提下，保留未覆盖）：
// - subMenu.tsx:215 `if (!rootMenu.renderWithPopper.value) return {}` 的 true 路径：
//   popperProps 计算属性只在 renderContent 的 Popper 分支（renderWithPopper=true）
//   被读取；renderWithPopper=false（垂直非折叠）时 renderContent 走内联分支，
//   popperProps 根本不会被求值 → 该守卫无入口。
// - subMenu.tsx:98 handleItemClick 的 `if (rootMenu.renderWithPopper.value)` 两条路径：
//   原由「子菜单内任一 MenuItem 处于激活态」触发，命中递归更新 bug（#1034/#1040，
//   "Maximum recursive updates exceeded in <FSubMenu>" + unhandled rejection）。
//   #1040 已根治：isActive 改为根菜单 activeSubMenuKeys 单一事实源判包含（渲染只读），
//   L112 `isActive.value && 'is-active'` true 路径解锁，已由
//   menu-recursive-root.spec.ts / menu-active-path-root.spec.ts 的 is-active 类名断言
//   覆盖（真实 Transition + 0 unhandled）；handleItemClick 的 Popper 收敛路径由
//   menu-recursive-root.spec.ts 水平用例与 menu-active-path-root.spec.ts 覆盖。

// RightOutlined / DownOutlined 图标 path d 特征值（fes-design-icon 内 svg path）
const RIGHT_PATH = 'm314.581 865.536';
const DOWN_PATH = 'm158.464 314.581';

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

afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('FSubMenu 分支补全（真实交互链）', () => {
    test('icon 插槽渲染图标容器，标题与箭头保留', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'vertical' },
            slots: {
                default: () => [
                    h(SubMenu, { key: 's', value: 's', label: '设置' }, {
                        icon: () => h('span', { class: 'mine-icon' }, '⚙'),
                        default: () => [
                            h(MenuItem, { key: 'i', value: 'i1', label: '选项一' }),
                        ],
                    }),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        const icon = wrapper.find(`.${subPrefixCls}-icon`);
        expect(icon.exists()).toBe(true);
        expect(icon.text()).toBe('⚙');
        // 非 onlyIcon：标题与箭头同时保留
        expect(wrapper.find(`.${subPrefixCls}-label`).text()).toBe('设置');
        expect(wrapper.find(`.${subPrefixCls}-arrow`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('水平模式三级子菜单：非一级节点渲染右向箭头（right-start 语义）', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'horizontal', options: nestedOptions },
            attachTo: document.body,
        });
        await nextTick();
        // 一级 wrapper 在菜单根内联渲染
        const level1 = wrapper.find(`.${subPrefixCls}-wrapper`);
        expect(level1.exists()).toBe(true);
        await level1.trigger('mouseenter');
        // 一级 Popper 内容（lazy）挂载后出现二级 wrapper
        let level2: HTMLElement | null = null;
        await vi.waitFor(() => {
            level2 = document.querySelector(
                `.${subPrefixCls}-popper .${subPrefixCls}-wrapper`,
            );
            expect(level2).not.toBeNull();
        });
        // 悬停二级 wrapper → 三级 submenu 挂载（二级 Popper 内容内渲染三级 wrapper）
        level2!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        await vi.waitFor(() => {
            const wrappers = document.querySelectorAll(
                `.${subPrefixCls}-popper .${subPrefixCls}-wrapper`,
            );
            expect(wrappers.length).toBeGreaterThanOrEqual(2);
        });
        const arrowDs = Array.from(
            document.querySelectorAll(`.${subPrefixCls}-arrow path`),
        ).map((p) => p.getAttribute('d') || '');
        // 一级/二级箭头为 DownOutlined，三级箭头为 RightOutlined（非一级 → right-start）
        expect(arrowDs.some((d) => d.startsWith(DOWN_PATH))).toBe(true);
        expect(arrowDs.some((d) => d.startsWith(RIGHT_PATH))).toBe(true);
        wrapper.unmount();
    });

    test('脱离 FMenu 挂载：rootMenu 与 parentMenu 双守卫警告', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
        let wrapper: VueWrapper | null = null;
        try {
            wrapper = mount(
                {
                    components: { SubMenu, MenuItem },
                    template: `
                        <SubMenu label="孤儿子菜单">
                            <MenuItem value="orphan" label="孤儿项" />
                        </SubMenu>
                    `,
                },
                { attachTo: document.body },
            );
            await nextTick();
        } catch {
            // 现状锁定：setup 阶段守卫警告已触发，后续 render 因 rootMenu 为空
            // 抛错只影响渲染结果，不影响警告断言
        }
        const warnTexts = warnSpy.mock.calls.map((c) => String(c[0]));
        expect(
            warnTexts.some((t) => t.includes('[FSubMenu] must be a child of FMenu')),
        ).toBe(true);
        expect(
            warnTexts.some(
                (t) =>
                    t.includes('[FSubMenu] must be a child of FMenu or FSubMenu'),
            ),
        ).toBe(true);
        wrapper?.unmount();
    });

    test('menu 根类名与 horizontal/vertical 模式切换（渲染冒烟）', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'horizontal', options: nestedOptions },
            attachTo: document.body,
        });
        await nextTick();
        expect(wrapper.find(`.${menuPrefixCls}`).classes()).toContain(
            'is-horizontal',
        );
        await wrapper.setProps({ mode: 'vertical' });
        await nextTick();
        expect(wrapper.find(`.${menuPrefixCls}`).classes()).toContain(
            'is-vertical',
        );
        wrapper.unmount();
    });
});
