import { mount } from '@vue/test-utils';

import getPrefixCls from '../../_util/getPrefixCls';
import Input from '../input.vue';

const prefixCls = getPrefixCls('input');
const textareaPrefixCls = getPrefixCls('textarea');

test('input placeholder', () => {
    const placeholder = 'placeholder 提示文案';
    const wrapper = mount(Input, {
        props: {
            placeholder,
        },
    });
    expect(wrapper.find(`.${prefixCls}-inner`).attributes('placeholder')).toBe(
        placeholder,
    );
    expect(() => wrapper.get(`.${textareaPrefixCls}`)).toThrowError();
});

test('textarea placeholder and type', () => {
    const placeholder = 'placeholder 提示文案之 textarea';
    const wrapper = mount(Input, {
        props: {
            type: 'textarea',
            placeholder,
        },
    });
    expect(
        wrapper.find(`.${textareaPrefixCls}-inner`).attributes('placeholder'),
    ).toBe(placeholder);
    expect(() => wrapper.get(`.${prefixCls}`)).toThrowError();
});

test('input disabled', async () => {
    const wrapper = mount(Input, {
        props: {
            disabled: false,
        },
    });

    expect(wrapper.find('input[disabled]').exists()).toBe(false);

    await wrapper.setProps({ disabled: true });

    expect(wrapper.find('input[disabled]').exists()).toBe(true);
});

test('input clearable', async () => {
    const wrapper = mount(Input, {
        props: {
            modelValue: 'hello clearable',
            clearable: true,
        },
    });

    expect(wrapper.find(`.${prefixCls}-with-suffix`).exists()).toBe(true);
    expect(wrapper.find(`.${prefixCls}-suffix`).exists()).toBe(true);
    expect(wrapper.vm.showClear).toBe(false);

    await wrapper.find(`.${prefixCls}-inner`).trigger('focus');

    expect(wrapper.vm.showClear).toBe(true);
});

test('input showPassword', async () => {
    const wrapper = mount(Input, {
        props: {
            modelValue: null,
            showPassword: true,
        },
    });

    expect(wrapper.find(`.${prefixCls}-with-suffix`).exists()).toBe(true);
    expect(wrapper.find(`.${prefixCls}-suffix`).exists()).toBe(true);

    expect(wrapper.vm.showPwdSwitchIcon).toBe(false);
    await wrapper.setProps({ modelValue: 'password icon' });
    expect(wrapper.vm.showPwdSwitchIcon).toBe(true);
});
