import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { FMenu, FSubMenu, FMenuGroup, FMenuItem } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';
import AppstoreOutlined from '../../icon/AppstoreOutlined';

const _mount = (props, slots = {}) =>
    mount(FMenu, {
        attachTo: document.body,
        props,
        slots,
    });

function getSubItemChildren(wrapper, index) {
    return wrapper.findAll(`.${getPrefixCls('sub-menu')}-children`)[index];
}
function geSubItemWrapper(wrapper, index) {
    return wrapper.findAll(`.${getPrefixCls('sub-menu')}-wrapper`)[index];
}

describe('Menu', () => {
    // it('mode', async () => {
    //     const wrapper = _mount(
    //         {},
    //         {
    //             default: () => {
    //                 return <FMenuItem value={1} label={'菜单选项'} />;
    //             },
    //         },
    //     );
    //     expect(wrapper.classes('is-horizontal')).toBe(true);
    //     await wrapper.setProps({
    //         mode: 'vertical',
    //     });
    //     expect(wrapper.classes('is-vertical')).toBe(true);

    //     wrapper.unmount();
    // });

    // it('collapsed', async () => {
    //     const wrapper = _mount(
    //         {
    //             collapsed: true,
    //         },
    //         {
    //             default: () => {
    //                 return <FMenuItem value={1} label={'菜单选项'} />;
    //             },
    //         },
    //     );
    //     expect(wrapper.classes('is-collapsed')).toBe(false);
    //     await wrapper.setProps({
    //         mode: 'vertical',
    //     });
    //     expect(wrapper.classes('is-collapsed')).toBe(true);
    //     await wrapper.setProps({
    //         mode: 'horizontal',
    //     });
    //     expect(wrapper.classes('is-collapsed')).toBe(false);

    //     wrapper.unmount();
    // });

    // it('inverted', async () => {
    //     const wrapper = _mount(
    //         {
    //             inverted: true,
    //         },
    //         {
    //             default: () => {
    //                 return <FMenuItem value={1} label={'菜单选项'} />;
    //             },
    //         },
    //     );
    //     expect(wrapper.classes('is-inverted')).toBe(true);
    //     await wrapper.setProps({
    //         inverted: false,
    //     });
    //     expect(wrapper.classes('is-inverted')).toBe(false);

    //     wrapper.unmount();
    // });

    // it('defaultExpandAll', async () => {
    //     const wrapper = _mount(
    //         {
    //             mode: 'vertical',
    //             defaultExpandAll: true,
    //         },
    //         {
    //             default: () => {
    //                 return (
    //                     <>
    //                         <FSubMenu value={1} label={'父菜单1'}>
    //                             <FMenuItem value={1.1} label={'父菜单1-1'} />
    //                         </FSubMenu>
    //                         <FSubMenu value={2} label={'父菜单2'}>
    //                             <FMenuItem value={2.1} label={'父菜单2-1'} />
    //                         </FSubMenu>
    //                     </>
    //                 );
    //             },
    //         },
    //     );
    //     // 需要先等待加载子组件
    //     await nextTick();
    //     expect(getSubItemChildren(wrapper, 0).isVisible()).toBe(true);
    //     expect(getSubItemChildren(wrapper, 1).isVisible()).toBe(true);

    //     wrapper.unmount();
    // });

    // it('expandedKeys', async () => {
    //     const wrapper = _mount(
    //         {
    //             mode: 'vertical',
    //             expandedKeys: [1],
    //         },
    //         {
    //             default: () => {
    //                 return (
    //                     <>
    //                         <FSubMenu value={1} label={'父菜单1'}>
    //                             <FMenuItem value={1.1} label={'父菜单1-1'} />
    //                         </FSubMenu>
    //                         <FSubMenu value={2} label={'父菜单2'}>
    //                             <FMenuItem value={2.1} label={'父菜单2-1'} />
    //                         </FSubMenu>
    //                     </>
    //                 );
    //             },
    //         },
    //     );
    //     // 需要先等待加载子组件
    //     await nextTick();
    //     expect(getSubItemChildren(wrapper, 0).isVisible()).toBe(true);
    //     expect(getSubItemChildren(wrapper, 1).isVisible()).toBe(false);

    //     wrapper.unmount();
    // });

    // it('accordion', async () => {
    //     const wrapper = _mount(
    //         {
    //             mode: 'vertical',
    //             expandedKeys: [1],
    //             accordion: true,
    //         },
    //         {
    //             default: () => {
    //                 return (
    //                     <>
    //                         <FSubMenu value={1} label={'父菜单1'}>
    //                             <FMenuItem value={1.1} label={'父菜单1-1'} />
    //                         </FSubMenu>
    //                         <FSubMenu value={2} label={'父菜单2'}>
    //                             <FMenuItem value={2.1} label={'父菜单2-1'} />
    //                         </FSubMenu>
    //                     </>
    //                 );
    //             },
    //         },
    //     );

    //     // 需要先等待加载子组件
    //     await nextTick();
    //     expect(getSubItemChildren(wrapper, 0).isVisible()).toBe(true);
    //     expect(getSubItemChildren(wrapper, 1).isVisible()).toBe(false);

    //     await geSubItemWrapper(wrapper, 1).trigger('click');
    //     expect(getSubItemChildren(wrapper, 0).isVisible()).toBe(false);
    //     expect(getSubItemChildren(wrapper, 1).isVisible()).toBe(true);

    //     wrapper.unmount();
    // });

    // test('options', async () => {
    //     const options = [
    //         {
    //             label: () => '我是子菜单',
    //             icon: () => <AppstoreOutlined />,
    //             value: '1',
    //             children: [
    //                 {
    //                     label: '华中地区',
    //                     isGroup: true,
    //                     children: [
    //                         {
    //                             value: '1.1',
    //                             label: '湖南',
    //                         },
    //                         {
    //                             value: '1.2',
    //                             label: '湖北',
    //                             children: [
    //                                 {
    //                                     label: '武汉',
    //                                     value: '1.2.1',
    //                                 },
    //                                 {
    //                                     label: '孝感',
    //                                     value: '1.2.2',
    //                                 },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     label: '华南地区',
    //                     isGroup: true,
    //                     children: [
    //                         {
    //                             value: '1.3',
    //                             label: '深圳',
    //                         },
    //                         {
    //                             value: '1.4',
    //                             label: '广州',
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //         {
    //             label: '人群管理',
    //             value: 2,
    //         },
    //         {
    //             label: '资源管理',
    //             value: '3',
    //         },
    //     ];
    //     const wrapper = _mount({
    //         options: options,
    //     });

    //     await nextTick();

    //     // icon + arrow
    //     expect(wrapper.findAll(`.fes-design-icon`).length).toBe(2);

    //     expect(wrapper.findAll(`.${getPrefixCls('sub-menu')}`).length).toBe(1);
    //     expect(wrapper.findAll(`.${getPrefixCls('menu-item')}`).length).toBe(2);

    //     await geSubItemWrapper(wrapper, 0).trigger('mouseenter');

    //     await nextTick();

    //     expect(wrapper.findAll(`.${getPrefixCls('menu-item')}`).length).toBe(5);

    //     expect(wrapper.findAll(`.${getPrefixCls('menu-group')}`).length).toBe(
    //         2,
    //     );
    // });

    // it('select event', async () => {
    //     const wrapper = _mount(
    //         {},
    //         {
    //             default: () => {
    //                 return <FMenuItem value={1} label={'菜单选项'} />;
    //             },
    //         },
    //     );
    //     await wrapper.find(`.${getPrefixCls('menu-item')}`).trigger('click');
    //     expect(wrapper.emitted()).toHaveProperty('select');
    //     expect(wrapper.emitted().select[0]).toEqual([{ value: 1 }]);
    // });

    it('submenu slot icon', async () => {
        const wrapper = _mount(
            {},
            {
                default: () => {
                    return (
                        <FSubMenu
                            value={1}
                            label={'submenu'}
                            v-slots={{ icon: () => <AppstoreOutlined /> }}
                        />
                    );
                },
            },
        );
        await nextTick();
        expect(wrapper.findAll(`.fes-design-icon`).length).toBe(2);
    });

    it('submenu slot label', async () => {
        const wrapper = _mount(
            {},
            {
                default: () => {
                    return (
                        <FSubMenu
                            value={1}
                            label={'submenu'}
                            v-slots={{
                                label: () => 'label',
                            }}
                        />
                    );
                },
            },
        );
        await nextTick();
        expect(wrapper.find(`.${getPrefixCls('sub-menu')}`).text()).toBe(
            'label',
        );
    });

    it('menu-group', async () => {
        const wrapper = _mount(
            {},
            {
                default: () => {
                    return (
                        <FSubMenu value={1} label={'submenu'}>
                            <FMenuGroup
                                label={'menu-group'}
                                v-slots={{
                                    label: () => 'menu-group-label',
                                }}
                            ></FMenuGroup>
                        </FSubMenu>
                    );
                },
            },
        );
        await nextTick();
        await geSubItemWrapper(wrapper, 0).trigger('mouseenter');
        await nextTick();
        expect(
            wrapper.find(`.${getPrefixCls('menu-group-label')}`).text(),
        ).toBe('menu-group-label');
    });

    it('menu-item', async () => {
        const wrapper = _mount(
            {},
            {
                default: () => {
                    return (
                        <FSubMenu value={1} label={'submenu'}>
                            <FMenuGroup label={'menu-group'}>
                                <FMenuItem
                                    value={1.1}
                                    label={'menu-item'}
                                    v-slots={{
                                        label: () => 'menu-item-label',
                                    }}
                                />
                            </FMenuGroup>
                        </FSubMenu>
                    );
                },
            },
        );
        await nextTick();
        await geSubItemWrapper(wrapper, 0).trigger('mouseenter');
        await nextTick();
        console.log(wrapper.html());
        expect(wrapper.find(`.${getPrefixCls('menu-item-label')}`).text()).toBe(
            'menu-item-label',
        );
    });
});
