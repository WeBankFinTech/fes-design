import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FForm from '../form.vue';
import FFormItem from '../formItem.vue';

describe('FForm labelWidth #911', () => {
    it('FForm labelWidth propagates to FFormItem', async () => {
        const wrapper = mount(FForm, {
            props: { labelWidth: '100px' },
            slots: {
                default: () => [h(FFormItem, { label: 'Name' }, { default: () => 'input' })],
            },
        });
        await nextTick();
        const html = wrapper.html();
        console.log('HTML:', JSON.stringify(html));
        expect(html).toContain('width: 100px');
    });

    it('FFormItem own labelWidth overrides FForm labelWidth', async () => {
        const wrapper = mount(FForm, {
            props: { labelWidth: '80px' },
            slots: {
                default: () => [h(FFormItem, { label: 'Email', labelWidth: '120px' }, { default: () => 'input' })],
            },
        });
        await nextTick();
        const html = wrapper.html();
        console.log('HTML:', JSON.stringify(html));
        expect(html).toContain('width: 120px');
    });
});