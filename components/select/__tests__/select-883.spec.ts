import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FSelect from '../index';

const OPTIONS = [
    { value: '选项1', label: '选项一' },
    { value: '选项2', label: '选项二' },
    { value: '选项3', label: '选项三' },
];

describe('FSelect multiple mode issue #883', () => {
    it('renders tags for each selected value in multiple mode', async () => {
        const wrapper = mount(FSelect, {
            props: {
                multiple: true,
                modelValue: ['选项1', '选项2'],
                options: OPTIONS,
            },
            global: {
                stubs: {
                    Popper: false,
                    OptionList: false,
                },
            },
            attachTo: document.body,
        });

        await wrapper.vm.$nextTick();

        const tags = wrapper.findAll('.fes-select-trigger-label-item');
        expect(tags.length).toBe(2);

        const tagTexts = tags.map((tag) => tag.text());
        expect(tagTexts).toContain('选项一');
        expect(tagTexts).toContain('选项二');

        wrapper.unmount();
    });

    it('removes value when remove button is clicked', async () => {
        const wrapper = mount(FSelect, {
            props: {
                multiple: true,
                modelValue: ['选项1', '选项2'],
                options: OPTIONS,
            },
            global: {
                stubs: {
                    Popper: false,
                    OptionList: false,
                },
            },
            attachTo: document.body,
        });

        await wrapper.vm.$nextTick();

        const initialTags = wrapper.findAll('.fes-select-trigger-label-item');
        expect(initialTags.length).toBe(2);

        // Get the internal select component and call onSelect with remove action
        const selectVm = wrapper.vm as any;
        // In multiple mode, calling onSelect with an already selected value removes it
        selectVm.onSelect('选项1');
        await wrapper.vm.$nextTick();
        await new Promise((r) => setTimeout(r, 50));

        const updatedTags = wrapper.findAll('.fes-select-trigger-label-item');
        expect(updatedTags.length).toBe(1);

        const remainingText = updatedTags[0]?.text();
        expect(remainingText).toBe('选项二');

        wrapper.unmount();
    });
});