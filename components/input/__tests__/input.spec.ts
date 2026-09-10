import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { FMessage } from '../../message';

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

describe('input paste exceed tip', () => {
    let warnSpy;
    const mountInput = (props = {}) =>
        mount(Input, {
            props: { maxlength: 5, ...props },
            attachTo: document.body,
        });

    // 构造带 clipboardData 的 paste 事件
    const paste = (wrapper, selector, text) => {
        const event = new Event('paste', { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'clipboardData', {
            value: {
                getData: (type) => (type === 'text/plain' ? text : ''),
            },
        });
        wrapper.find(selector).element.dispatchEvent(event);
    };

    beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        FMessage.config({ getContainer: () => document.body });
    });

    afterEach(() => {
        warnSpy.mockRestore();
        document.body.innerHTML = '';
    });

    test('粘贴超长时默认弹出提示', async () => {
        const infoSpy = vi
            .spyOn(FMessage, 'warning')
            .mockImplementation(() => ({ destroy: () => {} }));
        const wrapper = mountInput();
        paste(wrapper, 'input', '1234567890');
        await nextTick();
        expect(infoSpy).toHaveBeenCalledTimes(1);
        expect(infoSpy.mock.calls[0][0]).toContain('5');
        infoSpy.mockRestore();
        wrapper.unmount();
    });

    test('粘贴未超长时不提示', async () => {
        const infoSpy = vi
            .spyOn(FMessage, 'warning')
            .mockImplementation(() => ({ destroy: () => {} }));
        const wrapper = mountInput();
        paste(wrapper, 'input', '123');
        await nextTick();
        expect(infoSpy).not.toHaveBeenCalled();
        infoSpy.mockRestore();
        wrapper.unmount();
    });

    test('粘贴提示节流，500ms 内只弹一次', async () => {
        const infoSpy = vi
            .spyOn(FMessage, 'warning')
            .mockImplementation(() => ({ destroy: () => {} }));
        const wrapper = mountInput();
        paste(wrapper, 'input', '1234567890');
        paste(wrapper, 'input', '1234567890');
        await nextTick();
        expect(infoSpy).toHaveBeenCalledTimes(1);
        infoSpy.mockRestore();
        wrapper.unmount();
    });

    test('textarea 粘贴超长时同样提示', async () => {
        const infoSpy = vi
            .spyOn(FMessage, 'warning')
            .mockImplementation(() => ({ destroy: () => {} }));
        const wrapper = mountInput({ type: 'textarea' });
        paste(wrapper, 'textarea', '1234567890');
        await nextTick();
        expect(infoSpy).toHaveBeenCalledTimes(1);
        infoSpy.mockRestore();
        wrapper.unmount();
    });

    test('disabled 时不提示', async () => {
        const infoSpy = vi
            .spyOn(FMessage, 'warning')
            .mockImplementation(() => ({ destroy: () => {} }));
        const wrapper = mountInput({ disabled: true });
        paste(wrapper, 'input', '1234567890');
        await nextTick();
        expect(infoSpy).not.toHaveBeenCalled();
        infoSpy.mockRestore();
        wrapper.unmount();
    });

    test('未设置 maxlength 时不提示', async () => {
        const infoSpy = vi
            .spyOn(FMessage, 'warning')
            .mockImplementation(() => ({ destroy: () => {} }));
        const wrapper = mount(Input, { attachTo: document.body });
        paste(wrapper, 'input', 'a'.repeat(200));
        await nextTick();
        expect(infoSpy).not.toHaveBeenCalled();
        infoSpy.mockRestore();
        wrapper.unmount();
    });
});

describe('input exceed count style', () => {
    test('程序赋值超长时自动显示计数并标红', async () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
                maxlength: 5,
            },
        });

        // 未超长 -> 不显示计数
        expect(wrapper.find(`.${prefixCls}-count`).exists()).toBe(false);

        await wrapper.setProps({ modelValue: '1234567' });
        // 超长 -> 显示计数且带 is-exceed 类
        const count = wrapper.find(`.${prefixCls}-count`);
        expect(count.exists()).toBe(true);
        expect(count.classes()).toContain('is-exceed');
        expect(count.text()).toBe('7/5');

        await wrapper.setProps({ modelValue: '123' });
        // 恢复正常 -> 计数隐藏
        expect(wrapper.find(`.${prefixCls}-count`).exists()).toBe(false);
    });

    test('showWordLimit 时超长计数标红，未超长正常', async () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '123',
                maxlength: 5,
                showWordLimit: true,
            },
        });

        let count = wrapper.find(`.${prefixCls}-count`);
        expect(count.exists()).toBe(true);
        expect(count.classes()).not.toContain('is-exceed');
        expect(count.text()).toBe('3/5');

        await wrapper.setProps({ modelValue: '12345678' });
        count = wrapper.find(`.${prefixCls}-count`);
        expect(count.classes()).toContain('is-exceed');
        expect(count.text()).toBe('8/5');
    });

    test('textarea 程序赋值超长时计数标红', async () => {
        const wrapper = mount(Input, {
            props: {
                type: 'textarea',
                modelValue: '',
                maxlength: 5,
            },
        });

        expect(
            wrapper.find(`.${textareaPrefixCls}-count`).exists(),
        ).toBe(false);

        await wrapper.setProps({ modelValue: '1234567' });
        const count = wrapper.find(`.${textareaPrefixCls}-count`);
        expect(count.exists()).toBe(true);
        expect(count.classes()).toContain('is-exceed');
    });
});

describe('input paste exceed misc', () => {
    const mountInput = (props = {}) =>
        mount(Input, {
            props: { maxlength: 5, ...props },
            attachTo: document.body,
        });

    const paste = (wrapper, selector, text) => {
        const event = new Event('paste', { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'clipboardData', {
            value: {
                getData: (type) => (type === 'text/plain' ? text : ''),
            },
        });
        wrapper.find(selector).element.dispatchEvent(event);
    };

    beforeEach(() => {
        FMessage.config({ getContainer: () => document.body });
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('粘贴超长时 paste 事件不应修改 input 值（截断由原生 maxlength 完成）', async () => {
        const wrapper = mountInput();
        const input = wrapper.find('input').element;
        input.value = 'abc';
        paste(wrapper, 'input', '1234567890');
        // jsdom 不实现原生 maxlength 截断，paste 处理器只负责提示，不改值
        expect(input.value).toBe('abc');
        wrapper.unmount();
    });

    test('英文 locale 下提示文案为英文', async () => {
        const { enUS } = await import('../../locales');
        const infoSpy = vi
            .spyOn(FMessage, 'warning')
            .mockImplementation(() => ({ destroy: () => {} }));
        const { default: ConfigProvider } = await import(
            '../../config-provider/configProvider.tsx'
        );
        const wrapper = mount(ConfigProvider, {
            props: { locale: enUS },
            slots: { default: { template: '<FInput maxlength="5" />' } },
            global: {
                components: { FInput: Input },
            },
            attachTo: document.body,
        });
        paste(wrapper, 'input', '1234567890');
        await nextTick();
        expect(infoSpy).toHaveBeenCalledTimes(1);
        expect(infoSpy.mock.calls[0][0]).toBe(
            'Pasted content exceeds the 5-character limit, the excess has been truncated.',
        );
        infoSpy.mockRestore();
        wrapper.unmount();
    });

    test('readonly 时不提示', async () => {
        const infoSpy = vi
            .spyOn(FMessage, 'warning')
            .mockImplementation(() => ({ destroy: () => {} }));
        const wrapper = mountInput({ readonly: true });
        paste(wrapper, 'input', '1234567890');
        await nextTick();
        expect(infoSpy).not.toHaveBeenCalled();
        infoSpy.mockRestore();
        wrapper.unmount();
    });

    test('剪贴板为空字符串时不提示', async () => {
        const infoSpy = vi
            .spyOn(FMessage, 'warning')
            .mockImplementation(() => ({ destroy: () => {} }));
        const wrapper = mountInput({ modelValue: 'a'.repeat(10) });
        paste(wrapper, 'input', '');
        await nextTick();
        expect(infoSpy).not.toHaveBeenCalled();
        infoSpy.mockRestore();
        wrapper.unmount();
    });
});
