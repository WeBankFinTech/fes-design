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

    test('脱离 FMenu 使用：缺失 rootMenu 与 parentMenu 双警告（36/42 行）', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
        let wrapper: VueWrapper | null = null;
        try {
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
            await nextTick();
        } catch {
            // 现状锁定：36 行守卫只警告不熔断，后续 paddingStyle 读空指针会抛错，
            // 警告本身在 setup 阶段已全部触发，断言不受渲染崩溃影响
        }
        // 36/42 行两条守卫警告都触发（内部 MenuItem 还有第三条自身守卫警告）
        const warnTexts = warnSpy.mock.calls.map((c) => String(c[0]));
        expect(
            warnTexts.some(
                (t) => t.includes('FMenuGroup') && t.includes('must be a child of FMenu or FSubMenu') === false,
            ),
        ).toBe(true);
        expect(
            warnTexts.some(
                (t) => t.includes('FMenuGroup') && t.includes('must be a child of FMenu or FSubMenu'),
            ),
        ).toBe(true);
        wrapper?.unmount();
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
