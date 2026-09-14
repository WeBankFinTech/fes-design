import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FAvatarGroup from '../avatarGroup';
import FAvatar from '../../avatar';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('avatar-group');
const avatarCls = getPrefixCls('avatar');

describe('FAvatarGroup', () => {
    test('options 渲染头像列表', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                options: [
                    { name: '张三', text: '张' },
                    { name: '李四', text: '李' },
                    { name: '王五', text: '王' },
                ],
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        const avatars = wrapper.findAll(`.${avatarCls}`);
        expect(avatars.length).toBe(3);
        expect(avatars[0].text()).toBe('张');
        expect(avatars[2].text()).toBe('王');
    });

    test('超过 max 折叠显示 +n', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                max: 3,
                options: [
                    { text: '1' },
                    { text: '2' },
                    { text: '3' },
                    { text: '4' },
                    { text: '5' },
                ],
            },
        });
        await nextTick();
        const avatars = wrapper.findAll(`.${avatarCls}`);
        // 渲染前 max 个 + 一个折叠项
        expect(avatars.length).toBe(4);
        expect(avatars[0].text()).toBe('1');
        expect(avatars[2].text()).toBe('3');
        expect(avatars[3].text()).toBe('+2');
    });

    test('size、shape 传递给组内头像', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                size: 60,
                shape: 'square',
                options: [{ text: 'A' }, { text: 'B' }],
            },
        });
        await nextTick();
        const avatars = wrapper.findAll(`.${avatarCls}`);
        expect(avatars.length).toBe(2);
        expect(avatars[0].classes()).toContain(`${avatarCls}-shape-square`);
        expect(avatars[1].element.style.width).toBe('60px');
        expect(avatars[1].element.style.height).toBe('60px');
    });

    test('插槽头像应用统一的 size 与 shape', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                size: 48,
                shape: 'square',
                options: [],
            },
            slots: {
                default: () => [
                    h(FAvatar, null, () => h('span', null, '甲')),
                    h(FAvatar, null, () => h('span', null, '乙')),
                ],
            },
        });
        await nextTick();
        const avatars = wrapper.findAll(`.${avatarCls}`);
        expect(avatars.length).toBe(2);
        expect(avatars[0].classes()).toContain(`${avatarCls}-shape-square`);
        expect(avatars[0].element.style.width).toBe('48px');
        expect(avatars[1].text()).toBe('乙');
    });

    test('插槽与 options 混用时按 max 折叠', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                max: 3,
                options: [{ text: '1' }, { text: '2' }, { text: '3' }],
            },
            slots: {
                default: () => [
                    h(FAvatar, null, () => '甲'),
                    h(FAvatar, null, () => '乙'),
                ],
            },
        });
        await nextTick();
        const avatars = wrapper.findAll(`.${avatarCls}`);
        // 2 个插槽头像 + 1 个 option 头像 + 1 个折叠项
        expect(avatars.length).toBe(4);
        expect(avatars[2].text()).toBe('1');
        expect(avatars[3].text()).toBe('+2');
    });
});
