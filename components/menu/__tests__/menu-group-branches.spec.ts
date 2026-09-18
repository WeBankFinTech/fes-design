import { type VueWrapper, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Menu from '../menu';
import MenuGroup from '../menuGroup';
import MenuItem from '../menuItem';
import SubMenu from '../subMenu';
import getPrefixCls from '../../_util/getPrefixCls';

const subPrefixCls = getPrefixCls('sub-menu');
const groupPrefixCls = getPrefixCls('menu-group');

describe('FMenuGroup 分支补全（挂载守卫与标题渲染）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    test('FMenuGroup 独立挂载：合并告警一次 + 空渲染 + 不抛错', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        let wrapper: VueWrapper | null = null;
        // 直接断言不抛错（旧实现 renderTitle 读 paddingStyle 空指针会 TypeError）
        expect(() => {
            wrapper = mount(
                {
                    components: { MenuGroup, MenuItem },
                    template: `
                        <MenuGroup label="孤儿分组">
                            <MenuItem value="orphan" label="孤儿项" />
                        </MenuGroup>
                    `,
                },
                { attachTo: document.body },
            );
        }).not.toThrow();
        await nextTick();
        // 合并守卫：孤儿挂载只告警一次
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(String(warnSpy.mock.calls[0][0])).toContain(
            'must be a child of FMenu or FSubMenu',
        );
        // 早退空渲染：根节点仅剩注释占位，无任何菜单分组 DOM
        expect(wrapper!.html()).toBe('<!---->');
        expect(wrapper!.text()).toBe('');
        expect(wrapper!.find(`.${groupPrefixCls}`).exists()).toBe(false);
        wrapper!.unmount();
    });

    test('label prop 缺失且未提供 label 插槽：标题为空但分组结构保留（69 行回退路径）', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'vertical' },
            slots: {
                default: () => [
                    h(SubMenu, { key: 's', value: 's', label: '子菜单' }, {
                        default: () => [
                            h(MenuGroup, { key: 'g' }, {
                                default: () => [
                                    h(MenuItem, {
                                        key: 'i',
                                        value: 'i1',
                                        label: '项一',
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
        const subWrapper = wrapper.find(`.${subPrefixCls}-wrapper`);
        expect(subWrapper.exists()).toBe(true);
        await subWrapper.trigger('mouseenter');
        await nextTick();
        const group = wrapper.find(`.${groupPrefixCls}`);
        expect(group.exists()).toBe(true);
        // 无 label 插槽、无 label prop → Ellipsis 内容为空
        const label = wrapper.find(`.${groupPrefixCls}-label`);
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('');
        // 默认插槽内容仍渲染
        expect(wrapper.text()).toContain('项一');
        wrapper.unmount();
    });

    test('label 插槽优先于 label prop（垂直展开路径渲染分组标题）', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'vertical', modelValue: '' },
            slots: {
                default: () => [
                    h(SubMenu, { key: 's', value: 's', label: '子菜单' }, {
                        default: () => [
                            h(MenuGroup, { key: 'g', label: 'prop 标题' }, {
                                label: () => '插槽标题',
                                default: () => [
                                    h(MenuItem, {
                                        key: 'i',
                                        value: 'i1',
                                        label: '项一',
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
        await wrapper.find(`.${subPrefixCls}-wrapper`).trigger('mouseenter');
        await nextTick();

        // 插槽优先：渲染插槽文案而非 prop 文案
        const label = wrapper.find(`.${groupPrefixCls}-label`);
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('插槽标题');
        expect(label.text()).not.toContain('prop 标题');
        // 分组默认插槽内容挂载
        expect(wrapper.text()).toContain('项一');
        wrapper.unmount();
    });

    test('顶层直接挂 MenuGroup（label prop 渲染）+ paddingStyle 内联样式', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'vertical' },
            slots: {
                default: () => [
                    h(MenuGroup, { key: 'g', label: '顶层分组' }, {
                        default: () => [
                            h(MenuItem, {
                                key: 'i',
                                value: 'i1',
                                label: '项一',
                            }),
                        ],
                    }),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        // 顶层分组直接可见（非 Popper 路径）
        const group = wrapper.find(`.${groupPrefixCls}`);
        expect(group.exists()).toBe(true);
        expect(wrapper.text()).toContain('顶层分组');
        // 一级 indexPath 无 SUB_MENU/MENU_GROUP 前缀，padding 为默认 16px
        const label = wrapper.find(`.${groupPrefixCls}-label`);
        expect(label.exists()).toBe(true);
        expect(label.attributes('style') || '').toContain('padding-left: 16px');
        expect(wrapper.text()).toContain('项一');
        wrapper.unmount();
    });
});
