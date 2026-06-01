import { mount } from '@vue/test-utils';
import Dropdown from '../dropdown.tsx';
import { ref } from 'vue';

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

describe('Dropdown #910', () => {
    test('trigger slot receives selectedLabel and selectedValue', async () => {
        const wrapper = mount(Dropdown, {
            props: {
                options: OPTIONS,
                appendToContainer: false,
            },
            slots: {
                default: ({ selectedLabel, selectedValue }) => (
                    <div class="trigger-slot">
                        {selectedLabel}-{selectedValue}
                    </div>
                ),
            },
            attachTo: 'body',
        });

        await wrapper.find('.trigger-slot').trigger('mouseenter');
        expect(wrapper.find('.trigger-slot').text()).toBe('-undefined');
    });

    test('mount FDropdown with v-model and default slot displays selectedLabel', async () => {
        const value = ref('2');
        const wrapper = mount(Dropdown, {
            props: {
                options: OPTIONS,
                modelValue: value.value,
                appendToContainer: false,
            },
            slots: {
                default: ({ selectedLabel }) => (
                    <div class="trigger-slot">{selectedLabel}</div>
                ),
            },
            attachTo: 'body',
        });

        await wrapper.find('.trigger-slot').trigger('mouseenter');
        expect(wrapper.find('.trigger-slot').text()).toBe('修改');

        await wrapper.setProps({ modelValue: '3' });
        await wrapper.find('.trigger-slot').trigger('mouseenter');
        expect(wrapper.find('.trigger-slot').text()).toBe('添加');
    });
});