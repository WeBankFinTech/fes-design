// Issue #1017 [Bug] FMenu 使用默认插槽时菜单项不渲染，容器为空
// 只验证，不修源码。
// 复现方式来自 issue（Vue test-utils）：
//   mount(FMenu, {
//     props: { modelValue: '1', mode: 'vertical' },
//     slots: { default: () => [h(FMenuItem, ...), h(FSubMenu, ...)] },
//   });
// 期望 wrapper.text() 含 '菜单1'；issue 称实际为空 div。
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Menu from '../../menu/menu';
import MenuItem from '../../menu/menuItem';
import SubMenu from '../../menu/subMenu';

describe('Issue #1017 FMenu 默认插槽渲染', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    // 与 issue 完全一致的写法（FSubMenu 传 title prop）
    const mountSlotMenu = (mode: 'vertical' | 'horizontal') =>
        mount(Menu, {
            props: { modelValue: '1', mode },
            attachTo: document.body,
            slots: {
                default: () => [
                    h(MenuItem, { value: '1' }, () => '菜单1'),
                    h(
                        SubMenu,
                        { value: 's1', title: '子菜单' } as any,
                        {
                            default: () => [
                                h(MenuItem, { value: 's1-1' }, () => '子项1'),
                            ],
                        },
                    ),
                ],
            },
        });

    test('vertical：默认插槽内容应渲染（text 含 菜单1）', async () => {
        const wrapper = mountSlotMenu('vertical');
        await nextTick();
        // eslint-disable-next-line no-console
        console.log('[#1017] vertical html =>', wrapper.html());
        // eslint-disable-next-line no-console
        console.log('[#1017] vertical text =>', JSON.stringify(wrapper.text()));
        expect(wrapper.text()).toContain('菜单1');
        wrapper.unmount();
    });

    test('horizontal：默认插槽内容应渲染（text 含 菜单1）', async () => {
        const wrapper = mountSlotMenu('horizontal');
        await nextTick();
        // eslint-disable-next-line no-console
        console.log('[#1017] horizontal html =>', wrapper.html());
        // eslint-disable-next-line no-console
        console.log(
            '[#1017] horizontal text =>',
            JSON.stringify(wrapper.text()),
        );
        expect(wrapper.text()).toContain('菜单1');
        wrapper.unmount();
    });

    test('容器不应是空 div（存在 menu-item 节点）', async () => {
        const wrapper = mountSlotMenu('vertical');
        await nextTick();
        expect(wrapper.element.children.length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    // 对照组：文档化用法（FMenuItem 用 #label 插槽，官方 vertical.vue demo 同款）
    test('对照：文档化 #label 插槽写法文本正常渲染', async () => {
        const wrapper = mount(Menu, {
            props: { modelValue: '1', mode: 'vertical' },
            attachTo: document.body,
            slots: {
                default: () => [
                    h(MenuItem, { value: '1' }, { label: () => '菜单1' }),
                    h(
                        SubMenu,
                        { value: 's1' },
                        {
                            label: () => '子菜单',
                            default: () => [
                                h(
                                    MenuItem,
                                    { value: 's1-1' },
                                    { label: () => '子项1' },
                                ),
                            ],
                        },
                    ),
                ],
            },
        });
        await nextTick();
        // eslint-disable-next-line no-console
        console.log(
            '[#1017][对照] text =>',
            JSON.stringify(wrapper.text()),
        );
        expect(wrapper.text()).toContain('菜单1');
        expect(wrapper.text()).toContain('子菜单');
        expect(wrapper.text()).toContain('子项1');
        wrapper.unmount();
    });
});
