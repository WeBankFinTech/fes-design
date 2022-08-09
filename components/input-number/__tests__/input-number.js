import { mount } from '@vue/test-utils';
import getPrefixCls from '../../_util/getPrefixCls';
import inputNumber from '../input-number.vue';

const prefixCls = getPrefixCls('input-number');

// ---------------- inputNumber disabled -------------------
test('inputNumber disabled', async () => {
    const wrapper = mount(inputNumber, {
        props: {
            modelValue: 1,
            disabled: true,
        },
    });
    await wrapper.find('input[type="text"]').setValue('2');
    expect(wrapper.vm.displayValue).toEqual(1);
});

// ---------------- inputNumber max -------------------
test('inputNumber max', async () => {
    const wrapper = mount(inputNumber, {
        props: {
            modelValue: 1,
            max: 10,
        },
    });
    expect(wrapper.props('modelValue')).toEqual(1);
    await wrapper.find('input[type="text"]').setValue('11');
    expect(wrapper.vm.displayValue).toEqual(10);
});

// ---------------- inputNumber min -------------------
test('inputNumber min', async () => {
    const wrapper = mount(inputNumber, {
        props: {
            modelValue: 1,
            min: -1,
        },
    });
    expect(wrapper.props('modelValue')).toEqual(1);
    await wrapper.find('input[type="text"]').setValue('-10');
    expect(wrapper.vm.displayValue).toEqual(-1);
});

// ---------------- inputNumber preicison -------------------
test('inputNumber preicison', async () => {
    const wrapper = mount(inputNumber, {
        props: {
            modelValue: 1,
            precision: 0,
        },
    });
    expect(wrapper.props('modelValue')).toEqual(1);
    await wrapper.find('input[type="text"]').setValue('1.999');
    expect(wrapper.vm.displayValue).toEqual(2);
});

// ---------------- inputNumber step -------------------
test('inputNumber step', async () => {
    const wrapper = mount(inputNumber, {
        props: {
            modelValue: 1,
            step: 2,
        },
    });
    expect(wrapper.props('modelValue')).toEqual(1);
    await wrapper.find(`.${prefixCls}-increase`).trigger('click');
    expect(wrapper.vm.displayValue).toEqual(3);
    await wrapper.find(`.${prefixCls}-decrease`).trigger('click');
    expect(wrapper.vm.displayValue).toEqual(1);
});
