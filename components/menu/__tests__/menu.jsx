import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { FMenu, FSubMenu, FFMenuGroup, FMenuItem } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';
import AppstoreOutlined from '../../icon/AppstoreOutlined';
import { sleep } from '../../_util/utils';

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
    it('mode', async () => {
        const wrapper = _mount(
            {},
            {
                default: () => {
                    return <FMenuItem value={1} label={'菜单选项'} />;
                },
            },
        );
        expect(wrapper.classes('is-horizontal')).toBe(true);
        await wrapper.setProps({
            mode: 'vertical',
        });
        expect(wrapper.classes('is-vertical')).toBe(true);
    });

    it('collapsed', async () => {
        const wrapper = _mount(
            {
                collapsed: true,
            },
            {
                default: () => {
                    return <FMenuItem value={1} label={'菜单选项'} />;
                },
            },
        );
        expect(wrapper.classes('is-collapsed')).toBe(false);
        await wrapper.setProps({
            mode: 'vertical',
        });
        expect(wrapper.classes('is-collapsed')).toBe(true);
        await wrapper.setProps({
            mode: 'horizontal',
        });
        expect(wrapper.classes('is-collapsed')).toBe(false);
    });

    it('inverted', async () => {
        const wrapper = _mount(
            {
                inverted: true,
            },
            {
                default: () => {
                    return <FMenuItem value={1} label={'菜单选项'} />;
                },
            },
        );
        expect(wrapper.classes('is-inverted')).toBe(true);
        await wrapper.setProps({
            inverted: false,
        });
        expect(wrapper.classes('is-inverted')).toBe(false);
    });

    it('defaultExpandAll', async () => {
        const wrapper = _mount(
            {
                mode: 'vertical',
                defaultExpandAll: true,
            },
            {
                default: () => {
                    return (
                        <>
                            <FSubMenu value={1} label={'父菜单1'}>
                                <FMenuItem value={1.1} label={'父菜单1-1'} />
                            </FSubMenu>
                            <FSubMenu value={2} label={'父菜单2'}>
                                <FMenuItem value={2.1} label={'父菜单2-1'} />
                            </FSubMenu>
                        </>
                    );
                },
            },
        );
        // 需要先等待加载子组件
        await nextTick();
        expect(getSubItemChildren(wrapper, 0).attributes('style')).toBe(
            undefined,
        );
        expect(getSubItemChildren(wrapper, 1).attributes('style')).toBe(
            undefined,
        );
    });

    it('expandedKeys', async () => {
        const wrapper = _mount(
            {
                mode: 'vertical',
                expandedKeys: [1],
            },
            {
                default: () => {
                    return (
                        <>
                            <FSubMenu value={1} label={'父菜单1'}>
                                <FMenuItem value={1.1} label={'父菜单1-1'} />
                            </FSubMenu>
                            <FSubMenu value={2} label={'父菜单2'}>
                                <FMenuItem value={2.1} label={'父菜单2-1'} />
                            </FSubMenu>
                        </>
                    );
                },
            },
        );
        // 需要先等待加载子组件
        await nextTick();
        expect(getSubItemChildren(wrapper, 0).attributes('style')).toBe(
            undefined,
        );
        expect(getSubItemChildren(wrapper, 1).attributes('style')).toContain(
            'display: none;',
        );

        wrapper.unmount();
    });

    it('accordion', async () => {
        const wrapper = _mount(
            {
                mode: 'vertical',
                expandedKeys: [1],
                accordion: true,
            },
            {
                default: () => {
                    return (
                        <>
                            <FSubMenu value={1} label={'父菜单1'}>
                                <FMenuItem value={1.1} label={'父菜单1-1'} />
                            </FSubMenu>
                            <FSubMenu value={2} label={'父菜单2'}>
                                <FMenuItem value={2.1} label={'父菜单2-1'} />
                            </FSubMenu>
                        </>
                    );
                },
            },
        );

        // 需要先等待加载子组件
        await nextTick();
        expect(getSubItemChildren(wrapper, 0).attributes('style')).toBe(
            undefined,
        );
        expect(getSubItemChildren(wrapper, 1).attributes('style')).toContain(
            'display: none;',
        );

        await geSubItemWrapper(wrapper, 1).trigger('click');
        expect(getSubItemChildren(wrapper, 0).attributes('style')).toContain(
            'display: none;',
        );
        expect(getSubItemChildren(wrapper, 1).attributes('style')).toBe(
            undefined,
        );

        wrapper.unmount();
    });

    test('options', async () => {
        const options = [
            {
                label: () => '我是子菜单',
                icon: () => <AppstoreOutlined />,
                value: '1',
                children: [
                    {
                        label: '华中地区',
                        isGroup: true,
                        children: [
                            {
                                value: '1.1',
                                label: '湖南',
                            },
                            {
                                value: '1.2',
                                label: '湖北',
                                children: [
                                    {
                                        label: '武汉',
                                        value: '1.2.1',
                                    },
                                    {
                                        label: '孝感',
                                        value: '1.2.2',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        label: '华南地区',
                        isGroup: true,
                        children: [
                            {
                                value: '1.3',
                                label: '深圳',
                            },
                            {
                                value: '1.4',
                                label: '广州',
                            },
                        ],
                    },
                ],
            },
            {
                label: '人群管理',
                value: 2,
            },
            {
                label: '资源管理',
                value: '3',
            },
        ];
        const wrapper = _mount({
            options: options,
        });

        await nextTick();

        expect(wrapper.findAll(`.fes-design-icon`).length).toBe(2);

        expect(wrapper.findAll(`.${getPrefixCls('sub-menu')}`).length).toBe(1);
        expect(wrapper.findAll(`.${getPrefixCls('menu-item')}`).length).toBe(2);

        await geSubItemWrapper(wrapper, 0).trigger('hover');

        await sleep(400);

        expect(wrapper.findAll(`.${getPrefixCls('menu-item')}`).length).toBe(5);
    });
});
