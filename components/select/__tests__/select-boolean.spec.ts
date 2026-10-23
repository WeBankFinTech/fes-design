import { mount } from '@vue/test-utils';
import { FSelect } from '../index';
import OptionList from '../optionList';

const options = [
    { value: true, label: 'true' },
    { value: false, label: 'false' },
];

describe('FSelect boolean option values', () => {
    test('opening an unselected dropdown does not warn', async () => {
        const warnings: string[] = [];
        const warnHandler = (message: string) => warnings.push(message);
        const wrapper = mount(FSelect, {
            props: { options, appendToContainer: false },
            global: { config: { warnHandler } },
            attachTo: document.body,
        });

        try {
            await wrapper.find('.fes-select-trigger').trigger('click');
            expect(wrapper.find('.fes-select-option.is-hover').text()).toBe('true');
            expect(warnings).toEqual([]);
        } finally {
            wrapper.unmount();
        }
    });

    test.each([true, false])('hovering and selecting with modelValue=%s does not warn', async (value) => {
        const warnings: string[] = [];
        const warnHandler = (message: string) => warnings.push(message);
        const wrapper = mount(FSelect, {
            props: { options, modelValue: value, appendToContainer: false },
            global: { config: { warnHandler } },
            attachTo: document.body,
        });

        try {
            const trigger = wrapper.find('.fes-select-trigger');
            await trigger.trigger('click');
            expect(wrapper.find('.fes-select-option.is-hover').text()).toBe(String(value));
            expect(wrapper.find('.fes-select-option.is-checked').text()).toBe(String(value));

            const otherOption = wrapper.findAll('.fes-select-option')[value ? 1 : 0];
            await otherOption.trigger('mouseover');
            expect(wrapper.find('.fes-select-option.is-hover').text()).toBe(String(!value));
            await trigger.trigger('keydown.enter');
            expect(wrapper.emitted('update:modelValue')).toEqual([[!value]]);
            expect(wrapper.emitted('change')?.[0][0]).toBe(!value);
            expect(wrapper.find('.fes-select-trigger-label-text').text()).toBe(String(!value));
            expect(warnings).toEqual([]);
        } finally {
            wrapper.unmount();
        }
    });

    test('an omitted hover value does not highlight the false option', () => {
        const wrapper = mount(OptionList, {
            props: { options, prefixCls: 'fes-select', virtualScroll: false },
        });

        try {
            expect(wrapper.find('.is-hover').exists()).toBe(false);
        } finally {
            wrapper.unmount();
        }
    });
});
