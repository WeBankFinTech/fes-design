import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import { FInput as Input } from '../index';
import { getPasteExceedPayload, isPasteExceed } from '../useInput';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-input';
const textareaPrefixCls = 'fes-textarea';
const innerPrefixCls = 'fes-input-inner';

/** 构造带 clipboardData 的 paste 事件（与 input.spec.ts 同款） */
const pasteWith = (text: string) => {
    const event = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', {
        value: {
            getData: (type: string) => (type === 'text/plain' ? text : ''),
        },
    });
    return event;
};

describe('input 分支补全：prepend/append 插槽与 group 类', () => {
    test('prepend 插槽渲染出前缀容器并带 group-prepend 类', () => {
        const wrapper = mount(Input, {
            slots: { prepend: () => 'http://' },
        });
        const prepend = wrapper.find(`.${prefixCls}-prepend`);
        expect(prepend.exists()).toBe(true);
        expect(prepend.text()).toBe('http://');
        const root = wrapper.find(`.${prefixCls}`);
        expect(root.classes()).toContain(`${prefixCls}-group`);
        expect(root.classes()).toContain(`${prefixCls}-group-prepend`);
        wrapper.unmount();
    });

    test('append 插槽渲染出后缀容器并带 group-append 类', () => {
        const wrapper = mount(Input, {
            slots: { append: () => '.com' },
        });
        const append = wrapper.find(`.${prefixCls}-append`);
        expect(append.exists()).toBe(true);
        expect(append.text()).toBe('.com');
        const root = wrapper.find(`.${prefixCls}`);
        expect(root.classes()).toContain(`${prefixCls}-group`);
        expect(root.classes()).toContain(`${prefixCls}-group-append`);
        wrapper.unmount();
    });

    test('prepend 与 append 同时存在时三类 group 类齐全', () => {
        const wrapper = mount(Input, {
            slots: {
                prepend: () => '￥',
                append: () => '元',
            },
        });
        expect(wrapper.find(`.${prefixCls}-prepend`).exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls}-append`).exists()).toBe(true);
        const root = wrapper.find(`.${prefixCls}`);
        expect(root.classes()).toContain(`${prefixCls}-group-prepend`);
        expect(root.classes()).toContain(`${prefixCls}-group-append`);
        wrapper.unmount();
    });
});

describe('input 分支补全：textarea 真实交互链', () => {
    test('textarea 聚焦/失焦/keydown 事件真实触发并回传', async () => {
        const wrapper = mount(Input, { props: { type: 'textarea', modelValue: '' } });
        const textarea = wrapper.find('textarea');
        expect(textarea.exists()).toBe(true);
        await textarea.trigger('focus');
        await textarea.trigger('blur');
        expect(wrapper.emitted('focus')).toBeTruthy();
        expect(wrapper.emitted('blur')).toBeTruthy();
        await textarea.trigger('keydown', { key: 'Enter' });
        const keydown = wrapper.emitted('keydown');
        expect(keydown).toBeTruthy();
        expect((keydown![0][0] as KeyboardEvent).key).toBe('Enter');
        wrapper.unmount();
    });

    test('textarea input 实时回传值并驱动字数统计', async () => {
        const wrapper = mount(Input, {
            props: {
                type: 'textarea',
                modelValue: '',
                maxlength: 5,
                showWordLimit: true,
            },
        });
        const textarea = wrapper.find('textarea');
        expect(textarea.attributes('maxlength')).toBe('5');
        await textarea.setValue('ab');
        await nextTick();
        const inputEmits = wrapper.emitted('input');
        expect(inputEmits).toBeTruthy();
        expect(inputEmits![inputEmits!.length - 1][0]).toBe('ab');
        const count = wrapper.find(`.${textareaPrefixCls}-count`);
        expect(count.exists()).toBe(true);
        expect(count.text()).toBe('2/5');
        wrapper.unmount();
    });

    test('textarea change 事件提交当前值', async () => {
        const wrapper = mount(Input, { props: { type: 'textarea', modelValue: '' } });
        const textarea = wrapper.find('textarea');
        expect(textarea.exists()).toBe(true);
        await textarea.setValue('content');
        await textarea.trigger('change');
        const changeEmits = wrapper.emitted('change');
        expect(changeEmits).toBeTruthy();
        expect(changeEmits![changeEmits!.length - 1][0]).toBe('content');
        wrapper.unmount();
    });

    test('textarea 输入法组合事件链不丢值', async () => {
        const wrapper = mount(Input, { props: { type: 'textarea', modelValue: '' } });
        const textarea = wrapper.find('textarea');
        await textarea.trigger('compositionstart');
        await textarea.setValue('ni');
        await textarea.trigger('compositionend');
        await nextTick();
        expect((textarea.element as HTMLTextAreaElement).value).toBe('ni');
        const inputEmits = wrapper.emitted('input');
        expect(inputEmits).toBeTruthy();
        expect(inputEmits![inputEmits!.length - 1][0]).toBe('ni');
        wrapper.unmount();
    });

    test('textarea autofocus 聚焦到 textarea 元素', async () => {
        const wrapper = mount(Input, {
            props: { type: 'textarea', autofocus: true, modelValue: '' },
            attachTo: document.body,
        });
        await nextTick();
        expect(document.activeElement).toBe(wrapper.find('textarea').element);
        wrapper.unmount();
    });
});

describe('input useInput 语义（真实交互链）', () => {
    test('focus 与 blur 事件回传', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const input = wrapper.find('input');
        await input.trigger('focus');
        await input.trigger('blur');
        const focusEmits = wrapper.emitted('focus');
        const blurEmits = wrapper.emitted('blur');
        expect(focusEmits).toBeTruthy();
        expect(blurEmits).toBeTruthy();
        expect((focusEmits![0][0] as Event).type).toBe('focus');
        expect((blurEmits![0][0] as Event).type).toBe('blur');
        wrapper.unmount();
    });

    test('mouseenter 与 mouseleave 事件回传', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        await wrapper.find(`.${prefixCls}`).trigger('mouseenter');
        await wrapper.find(`.${prefixCls}`).trigger('mouseleave');
        expect(wrapper.emitted('mouseenter')).toBeTruthy();
        expect(wrapper.emitted('mouseleave')).toBeTruthy();
        expect(wrapper.emitted('mouseenter')![0]).toHaveLength(1);
        expect(wrapper.emitted('mouseleave')![0]).toHaveLength(1);
        wrapper.unmount();
    });

    test('enter 键提交 change 事件', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const input = wrapper.find('input');
        await input.setValue('submit-me');
        await input.trigger('keydown', { key: 'Enter' });
        await wait();
        const changeEmits = wrapper.emitted('change');
        expect(changeEmits).toBeTruthy();
        expect(changeEmits![changeEmits!.length - 1][0]).toBe('submit-me');
        wrapper.unmount();
    });

    test('受控 modelValue 双向：输入回写、外部回显', async () => {
        const value = ref('');
        const wrapper = mount(Input, {
            props: {
                'modelValue': value.value,
                'onUpdate:modelValue': (v: string) => {
                    value.value = v;
                },
            },
        });
        await wrapper.find('input').setValue('from-input');
        await nextTick();
        expect(value.value).toBe('from-input');
        await wrapper.setProps({ modelValue: 'from-outside' });
        await nextTick();
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            'from-outside',
        );
        wrapper.unmount();
    });
});

describe('input useInput 纯函数：粘贴超长判定', () => {
    test('未设置 maxlength 时返回 null', () => {
        const el = document.createElement('input');
        const event = new Event('paste', { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'clipboardData', {
            value: { getData: () => '12345' },
        });
        el.dispatchEvent(event);
        expect(getPasteExceedPayload(event)).toBeNull();
        expect(isPasteExceed(event)).toBe(false);
    });

    test('无剪贴板数据时返回 null', () => {
        const el = document.createElement('input');
        el.value = 'abc';
        const event = new Event('paste', { bubbles: true, cancelable: true });
        el.dispatchEvent(event);
        expect(getPasteExceedPayload(event, 5)).toBeNull();
        expect(isPasteExceed(event, 5)).toBe(false);
    });

    test('粘贴选中替换场景返回结构化载荷', () => {
        const el = document.createElement('input');
        el.value = 'abc';
        el.selectionStart = 0;
        el.selectionEnd = 2;
        const event = pasteWith('1234567890');
        el.dispatchEvent(event);
        const payload = getPasteExceedPayload(event, 5);
        expect(payload).not.toBeNull();
        expect(payload!.pasteLength).toBe(10);
        expect(payload!.currentLength).toBe(3);
        expect(payload!.maxlength).toBe(5);
    });

    test('选中替换后未超长时返回 null', () => {
        const el = document.createElement('input');
        el.value = 'abc';
        el.selectionStart = 0;
        el.selectionEnd = 2;
        const event = pasteWith('ab');
        el.dispatchEvent(event);
        expect(getPasteExceedPayload(event, 5)).toBeNull();
        expect(isPasteExceed(event, 5)).toBe(false);
    });

    test('不支持选区（type=number）时按全量长度计算', () => {
        // 覆盖 getPasteExceedPayload 中 selectionStart/End 为 null 的 ?? 0 兜底分支：
        // 浏览器对不支持选区的输入类型（number/email）返回 null，jsdom 同样如此。
        // 注：v8 覆盖率对同表达式 `(a ?? 0) - (b ?? 0)` 的第二个 ?? 存在归因缺失
        // （L36 第二位置恒 0，实际行为已被本用例验证：选区为 0、按全量长度计算）。
        const el = document.createElement('input');
        el.type = 'number';
        el.value = '12345';
        const event = pasteWith('1234567890');
        el.dispatchEvent(event);
        const payload = getPasteExceedPayload(event, 5);
        expect(payload).not.toBeNull();
        expect(payload!.currentLength).toBe(5);
        expect(payload!.pasteLength).toBe(10);
        expect(isPasteExceed(event, 5)).toBe(true);
    });
});

describe('input 分支补全：清除/密码/字数统计', () => {
    test('清除按钮仅在可清时出现，点击后清空并回传', async () => {
        const wrapper = mount(Input, {
            props: { modelValue: 'value-to-clear', clearable: true },
        });
        expect(wrapper.find(`.${innerPrefixCls}-icon`).exists()).toBe(false);
        await wrapper.find(`.${innerPrefixCls}`).trigger('mouseenter');
        expect(wrapper.find(`.${innerPrefixCls}-icon`).exists()).toBe(true);
        await wrapper.find(`.${innerPrefixCls}-icon`).trigger('click');
        await nextTick();
        expect(wrapper.emitted('clear')).toBeTruthy();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBe('');
        expect(wrapper.find(`.${innerPrefixCls}-icon`).exists()).toBe(false);
        wrapper.unmount();
    });

    test('密码明文切换：点击图标在 password/text 间切换', async () => {
        const wrapper = mount(Input, {
            props: { modelValue: 'secret', showPassword: true },
        });
        const input = wrapper.find('input');
        expect(input.attributes('type')).toBe('password');
        await wrapper.find(`.${innerPrefixCls}-icon`).trigger('click');
        await nextTick();
        expect(input.attributes('type')).toBe('text');
        await wrapper.find(`.${innerPrefixCls}-icon`).trigger('click');
        await nextTick();
        expect(input.attributes('type')).toBe('password');
        wrapper.unmount();
    });

    test('readonly 时不显示密码切换图标', () => {
        const wrapper = mount(Input, {
            props: { modelValue: 'x', showPassword: true, readonly: true },
        });
        expect(wrapper.find(`.${innerPrefixCls}-icon`).exists()).toBe(false);
        expect(wrapper.find('input').attributes('readonly')).toBeDefined();
        wrapper.unmount();
    });

    test('输入时字数统计实时更新', async () => {
        const wrapper = mount(Input, {
            props: { modelValue: '', maxlength: 10, showWordLimit: true },
        });
        await wrapper.find('input').setValue('ab');
        await nextTick();
        const count = wrapper.find(`.${prefixCls}-count`);
        expect(count.exists()).toBe(true);
        expect(count.text()).toBe('2/10');
        expect(
            wrapper.find('input').attributes('maxlength'),
        ).toBe('10');
        wrapper.unmount();
    });

    test('disabled 时隐藏字数统计', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: 'abc',
                maxlength: 5,
                showWordLimit: true,
                disabled: true,
            },
        });
        expect(wrapper.find('input[disabled]').exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls}-count`).exists()).toBe(false);
        wrapper.unmount();
    });
});

describe('input 分支补全：InputEvent 与组合事件', () => {
    test('InputEvent 非组合输入走真实事件链回传值', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const el = wrapper.find('input').element as HTMLInputElement;
        el.value = 'ab';
        el.dispatchEvent(
            new InputEvent('input', { bubbles: true, data: 'ab', isComposing: false }),
        );
        await nextTick();
        const inputEmits = wrapper.emitted('input');
        expect(inputEmits).toBeTruthy();
        expect(inputEmits![inputEmits!.length - 1][0]).toBe('ab');
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            'ab',
        );
        wrapper.unmount();
    });

    test('InputEvent isComposing 时仍能回传值', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const el = wrapper.find('input').element as HTMLInputElement;
        el.value = 'cd';
        el.dispatchEvent(
            new InputEvent('input', { bubbles: true, data: 'cd', isComposing: true }),
        );
        await nextTick();
        const inputEmits = wrapper.emitted('input');
        expect(inputEmits).toBeTruthy();
        expect(inputEmits![inputEmits!.length - 1][0]).toBe('cd');
        wrapper.unmount();
    });

    test('未组合时 compositionend 不触发值提交', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const input = wrapper.find('input');
        await input.trigger('compositionend');
        await nextTick();
        expect(wrapper.emitted('input')).toBeUndefined();
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe('');
        wrapper.unmount();
    });
});
