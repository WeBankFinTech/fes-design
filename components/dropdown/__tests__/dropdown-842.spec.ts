import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Dropdown from '../dropdown.tsx';

const OPTIONS = [
    { value: '1', label: '删除' },
    { value: '2', label: '修改' },
    { value: '3', label: '添加' },
    { value: '4', label: '评论' },
    { value: '5', label: '收藏' },
];

const _mount = (props = {}) =>
    mount(Dropdown, {
        props,
        slots: {
            default: () => h('div', { class: 'test-trigger' }, '下拉菜单'),
        },
        attachTo: 'body',
    });

describe('Dropdown keyboard navigation #842', () => {
    test('ArrowDown moves to next item', async () => {
        const wrapper = _mount({
            options: OPTIONS,
            trigger: 'click',
            appendToContainer: false,
        });
        await wrapper.find('.test-trigger').trigger('click');
        const menu = wrapper.find('.fes-dropdown-menu');
        expect(menu.exists()).toBe(true);

        await menu.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.fes-dropdown-option.is-active').text()).toBe('删除');

        await menu.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.fes-dropdown-option.is-active').text()).toBe('修改');

        await menu.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.fes-dropdown-option.is-active').text()).toBe('添加');

        await menu.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.fes-dropdown-option.is-active').text()).toBe('评论');

        await menu.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.fes-dropdown-option.is-active').text()).toBe('收藏');

        await menu.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.fes-dropdown-option.is-active').text()).toBe('删除');
    });

    test('Enter triggers active item click', async () => {
        const wrapper = _mount({
            options: OPTIONS,
            trigger: 'click',
            appendToContainer: false,
        });
        await wrapper.find('.test-trigger').trigger('click');
        const menu = wrapper.find('.fes-dropdown-menu');

        await menu.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.find('.fes-dropdown-option.is-active').text()).toBe('删除');

        await menu.trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted()).toHaveProperty('click');
        expect(wrapper.emitted().click[0]).toEqual(['1']);
    });
});
