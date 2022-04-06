import { mount } from '@vue/test-utils';
import Dropdown from '../dropdown.tsx';

const POPPER_CONTAINER_SELECTOR = '.fes-popper-wrapper';

const OPTIONS = [
    {
        value: '1',
        label: '删除',
    },
    {
        value: '2',
        label: '修改',
    },
    {
        value: '3',
        label: '添加',
    },
    {
        value: '4',
        label: '评论',
    },
    {
        value: '5',
        label: '收藏',
    },
];

const _mount = (props = {}) =>
    mount(Dropdown, {
        props,
        slots: {
            default: () => <div class="test-trigger">下拉菜单</div>,
        },
        attachTo: 'body',
    });

describe('Dropdown', () => {
    test('Dropdown appendToContainer', async () => {
        expect(document.body.innerHTML).toBe('');
        const wrapper = _mount({
            options: OPTIONS,
        });
        await wrapper.find('.test-trigger').trigger('mouseenter');
        expect(wrapper.find(POPPER_CONTAINER_SELECTOR).exists()).toBe(false);
        expect(
            document.body.querySelector(POPPER_CONTAINER_SELECTOR).innerHTML,
        ).not.toBe('');

        await wrapper.setProps({
            appendToContainer: false,
        });
        expect(wrapper.find(POPPER_CONTAINER_SELECTOR).exists()).toBe(true);
    });

    test('Dropdown lazy', async () => {
        const wrapper = _mount({
            options: OPTIONS,
            appendToContainer: false,
        });
        expect(wrapper.find('.fes-dropdown-option').exists()).toBe(false);
        await wrapper.setProps({
            lazy: false,
        });
        expect(wrapper.find('.fes-dropdown-option').exists()).toBe(true);
    });

    test('Dropdown event', async () => {
        const wrapper = _mount({
            options: [
                {
                    value: '1',
                    label: '删除',
                },
            ],
            appendToContainer: false,
        });
        await wrapper.find('.test-trigger').trigger('mouseenter');
        await wrapper.find('.fes-dropdown-option').trigger('click');
        expect(wrapper.emitted()).toHaveProperty('click');
        expect(wrapper.emitted().click[0]).toEqual(['1']);
    });

    test('Dropdown valueField labelField', async () => {
        const wrapper = _mount({
            options: [
                {
                    v: '1',
                    t: '删除',
                },
            ],
            valueField: 'v',
            labelField: 't',
            appendToContainer: false,
        });
        await wrapper.find('.test-trigger').trigger('mouseenter');
        await wrapper.find('.fes-dropdown-option').trigger('click');
        expect(wrapper.emitted()).toHaveProperty('click');
        expect(wrapper.emitted().click[0]).toEqual(['1']);
        expect(wrapper.find('.fes-dropdown-option').text()).toBe('删除');
    });

    test('Dropdown disabled', async () => {
        const wrapper = _mount({
            options: [
                {
                    value: '1',
                    label: '删除',
                },
            ],
            disabled: true,
            appendToContainer: false,
        });
        await wrapper.find('.test-trigger').trigger('mouseenter');
        expect(wrapper.find('.fes-dropdown-option').exists()).toBe(false);
    });

    test('DropDown item disabled', async () => {
        const wrapper = _mount({
            options: [
                {
                    value: '1',
                    label: '删除',
                    disabled: true,
                },
            ],
            appendToContainer: false,
        });
        await wrapper.find('.test-trigger').trigger('mouseenter');
        expect(wrapper.find('.fes-dropdown-option').exists()).toBe(true);
        await wrapper.find('.fes-dropdown-option').trigger('click');
        expect(wrapper.emitted()).not.toHaveProperty('click');
    });

    test('DropDown trigger click', async () => {
        const wrapper = _mount({
            options: OPTIONS,
            trigger: 'click',
            appendToContainer: false,
        });
        await wrapper.find('.test-trigger').trigger('click');
        expect(wrapper.find('.fes-dropdown-option').exists()).toBe(true);
    });

    test('DropDown trigger focus', async () => {
        const wrapper = _mount({
            options: OPTIONS,
            trigger: 'focus',
            appendToContainer: false,
        });
        await wrapper.find('.test-trigger').trigger('focus');
        expect(wrapper.find('.fes-dropdown-option').exists()).toBe(true);
    });

    test('DropDown trigger contextmenu', async () => {
        const wrapper = _mount({
            options: OPTIONS,
            trigger: 'contextmenu',
            appendToContainer: false,
        });
        await wrapper.find('.test-trigger').trigger('contextmenu');
        expect(wrapper.find('.fes-dropdown-option').exists()).toBe(true);
    });
});
