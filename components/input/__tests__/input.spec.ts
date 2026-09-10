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
    expect(wrapper.find('input').attributes('placeholder')).toBe(placeholder);
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

    // clearable -> suffix 容器渲染
    expect(wrapper.find(`.${prefixCls}-inner-suffix`).exists()).toBe(true);
    // 未聚焦 -> 无清除图标
    expect(wrapper.find(`.${prefixCls}-inner-icon`).exists()).toBe(false);

    await wrapper.find('input').trigger('focus');

    // 聚焦后 -> 显示清除图标
    expect(wrapper.find(`.${prefixCls}-inner-icon`).exists()).toBe(true);
});

test('input showPassword', async () => {
    const wrapper = mount(Input, {
        props: {
            modelValue: null,
            showPassword: true,
        },
    });

    // showPassword -> suffix 容器渲染
    expect(wrapper.find(`.${prefixCls}-inner-suffix`).exists()).toBe(true);
    // 无值 -> 无密码切换图标
    expect(wrapper.find(`.${prefixCls}-inner-icon`).exists()).toBe(false);

    await wrapper.setProps({ modelValue: 'password icon' });
    // 有值 -> 显示密码切换图标
    expect(wrapper.find(`.${prefixCls}-inner-icon`).exists()).toBe(true);
});
