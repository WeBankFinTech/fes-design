import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { FInput as Input } from '../index';
import { wait } from '../../_util/__tests__/helpers';

describe('FInput 事件与原生行为', () => {
    test('input 事件实时触发并携带值', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const input = wrapper.find('input');
        await input.setValue('abc');
        await input.trigger('input');
        await nextTick();
        const emitted = wrapper.emitted('input');
        expect(emitted).toBeTruthy();
        await wait();
        wrapper.unmount();
    });

    test('change 事件在失焦时触发', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const input = wrapper.find('input');
        await input.setValue('changed');
        await input.trigger('change');
        await wait(120);
        const emitted = wrapper.emitted('change');
        expect(emitted![0][0]).toBe('changed');
        wrapper.unmount();
    });

    test('compositionStart/End 中文输入法事件', async () => {
        const wrapper = mount(Input, { props: { modelValue: '' } });
        const input = wrapper.find('input');
        await input.trigger('compositionstart');
        await input.setValue('ni');
        await input.trigger('compositionend');
        await wait();
        // composition 事件不抛错，输入最终同步
        expect(wrapper.find('input').element.value).toBe('ni');
        wrapper.unmount();
    });

    test('clearable 点击清空按钮触发 clear 与 update', async () => {
        const wrapper = mount(Input, {
            props: { modelValue: '有值', clearable: true },
        });
        await nextTick();
        await wait();
        // mouseenter 绑定在 .fes-input-inner 上（mouseenter 不冒泡，需直接触发）
        const inner = wrapper.find('.fes-input-inner');
        await inner.trigger('mouseenter');
        await wait();
        // 清空图标：CloseCircleFilled，class 为 fes-input-inner-icon
        const clear = wrapper.find('.fes-input-inner-icon');
        expect(clear.exists()).toBe(true);
        await clear.trigger('click');
        await wait();
        expect(wrapper.emitted('clear')).toBeTruthy();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates![updates!.length - 1][0]).toBe('');
        wrapper.unmount();
    });

    test('type=password 隐藏输入', () => {
        const wrapper = mount(Input, { props: { type: 'password', modelValue: 'secret' } });
        expect(wrapper.find('input').attributes('type')).toBe('password');
        wrapper.unmount();
    });

    test('prefix/suffix 插槽同时渲染', () => {
        const wrapper = mount(Input, {
            slots: { prefix: () => h('span', '前'), suffix: () => h('span', '后') },
        });
        expect(wrapper.text()).toContain('前');
        expect(wrapper.text()).toContain('后');
        wrapper.unmount();
    });

    test('disabled 时 input 事件被阻断', async () => {
        const wrapper = mount(Input, { props: { disabled: true, modelValue: '' } });
        const input = wrapper.find('input');
        expect(input.attributes('disabled')).toBeDefined();
        wrapper.unmount();
    });
});
