import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FDatePicker from '../datePicker.vue';

const CLOSE_ICON_PATH = 'M512 42.667C771.2 42.667 981.333 252.8';

describe('FDatePicker clearable prop (#815)', () => {
    it('clearable: true (default) shows the X clear icon when value is set', async () => {
        const wrapper = mount(FDatePicker, {
            props: {
                modelValue: Date.now(),
            },
        });
        const input = wrapper.find('input');
        await input.trigger('focus');
        await wrapper.vm.$nextTick();
        const html = wrapper.html();
        expect(html).toContain(CLOSE_ICON_PATH);
    });

    it('clearable: false hides the X clear icon when value is set', async () => {
        const wrapper = mount(FDatePicker, {
            props: {
                modelValue: Date.now(),
                clearable: false,
            },
        });
        const input = wrapper.find('input');
        await input.trigger('focus');
        await wrapper.vm.$nextTick();
        const html = wrapper.html();
        expect(html).not.toContain(CLOSE_ICON_PATH);
    });
});