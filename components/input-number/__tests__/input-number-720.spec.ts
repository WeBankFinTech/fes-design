import { mount } from '@vue/test-utils';
import getPrefixCls from '../../_util/getPrefixCls';
import inputNumber from '../input-number.vue';

const prefixCls = getPrefixCls('input-number');

test('inputNumber size small', async () => {
    const wrapper = mount(inputNumber, {
        props: {
            modelValue: 1,
            size: 'small',
        },
    });
    expect(wrapper.classes()).toContain(`${prefixCls}--small`);
    expect(wrapper.classes()).not.toContain(`${prefixCls}--large`);
});

test('inputNumber size large', async () => {
    const wrapper = mount(inputNumber, {
        props: {
            modelValue: 1,
            size: 'large',
        },
    });
    expect(wrapper.classes()).toContain(`${prefixCls}--large`);
    expect(wrapper.classes()).not.toContain(`${prefixCls}--small`);
});

test('inputNumber size medium (default)', async () => {
    const wrapper = mount(inputNumber, {
        props: {
            modelValue: 1,
        },
    });
    expect(wrapper.classes()).not.toContain(`${prefixCls}--small`);
    expect(wrapper.classes()).not.toContain(`${prefixCls}--large`);
});

test('inputNumber size is reactive', async () => {
    const wrapper = mount(inputNumber, {
        props: {
            modelValue: 1,
            size: 'small',
        },
    });
    expect(wrapper.classes()).toContain(`${prefixCls}--small`);
    await wrapper.setProps({ size: 'large' });
    expect(wrapper.classes()).toContain(`${prefixCls}--large`);
    expect(wrapper.classes()).not.toContain(`${prefixCls}--small`);
});