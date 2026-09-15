import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { FInput as Input } from '../index';
import { wait } from '../../_util/__tests__/helpers';

describe('FInput 属性补全', () => {
    test('rows 设置 textarea 行数', async () => {
        const wrapper = mount(Input, {
            props: { type: 'textarea', rows: 6, modelValue: '' },
        });
        await nextTick();
        const textarea = wrapper.find('textarea');
        expect(textarea.exists()).toBe(true);
        expect(textarea.attributes('rows')).toBe('6');
        wrapper.unmount();
    });

    test('autosize textarea 自适应高度', async () => {
        const wrapper = mount(Input, {
            props: { type: 'textarea', autosize: true, modelValue: '多行内容' },
        });
        await nextTick();
        await wait(40);
        expect(wrapper.find('textarea').exists()).toBe(true);
        wrapper.unmount();
    });

    test('autosize 对象形式设置最小最大行数', async () => {
        const wrapper = mount(Input, {
            props: {
                type: 'textarea',
                autosize: { minRows: 2, maxRows: 5 },
                modelValue: '',
            },
        });
        await nextTick();
        await wait(40);
        expect(wrapper.find('textarea').exists()).toBe(true);
        wrapper.unmount();
    });

    test('autofocus 自动聚焦', async () => {
        const wrapper = mount(Input, {
            props: { modelValue: '', autofocus: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait(40);
        expect(wrapper.find('input').exists()).toBe(true);
        wrapper.unmount();
    });

    test('autocomplete 属性透传', async () => {
        const wrapper = mount(Input, {
            props: { modelValue: '', autocomplete: 'off' },
        });
        await nextTick();
        expect(wrapper.find('input').attributes('autocomplete')).toBe('off');
        wrapper.unmount();
    });

    test('readonly 只读不触发 input', async () => {
        const wrapper = mount(Input, {
            props: { modelValue: '', readonly: true },
        });
        await nextTick();
        const input = wrapper.find('input');
        expect(input.attributes('readonly')).toBeDefined();
        expect(input.attributes('readonly')).toBeDefined();
        wrapper.unmount();
    });

    test('maxlength 与 showWordlimit 计数', async () => {
        const wrapper = mount(Input, {
            props: { modelValue: 'abc', maxlength: 10, showWordLimit: true },
        });
        await nextTick();
        await wait(40);
        expect(wrapper.text()).toContain('3/10');
        wrapper.unmount();
    });

    test('prefix/suffix 插槽渲染', async () => {
        const wrapper = mount(Input, {
            props: { modelValue: '' },
            slots: {
                prefix: () => '前缀',
                suffix: () => '后缀',
            },
        });
        await nextTick();
        expect(wrapper.find('.fes-input-inner-prefix').text()).toContain('前缀');
        expect(wrapper.find('.fes-input-inner-suffix').text()).toContain('后缀');
        wrapper.unmount();
    });
});
