import { mount } from '@vue/test-utils';
import Checkbox from '../checkbox.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('checkbox');

describe('Checkbox indeterminate #864', () => {
    test('indeterminate prop renders the dash icon', async () => {
        const wrapper = mount(Checkbox, {
            props: {
                indeterminate: true,
            },
        });
        expect(wrapper.classes('is-indeterminate')).toBe(true);
    });

    test('click event fires when indeterminate and parent decides what to do', async () => {
        const wrapper = mount(Checkbox, {
            props: {
                indeterminate: true,
                modelValue: false,
            },
        });
        await wrapper.find(`.${prefixCls}`).trigger('click');
        expect(wrapper.emitted()).toHaveProperty('change');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.props('indeterminate')).toBe(true);
    });
});