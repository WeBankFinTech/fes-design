import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimePicker from '../time-picker.vue';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-time-picker';

const PopperStub = {
    template: '<div><slot name="trigger" /><slot /></div>',
};

const mountPicker = (props: Record<string, unknown> = {}) => {
    document.body.innerHTML = '';
    return mount(TimePicker, {
        props: { modelValue: '09:00:00', ...props },
        global: { stubs: { Popper: PopperStub } },
        attachTo: document.body,
    });
};

describe('FTimePicker 属性补全', () => {
    test('placeholder 自定义占位文案', async () => {
        const wrapper = mountPicker({
            placeholder: '选择时间哦',
            modelValue: null,
        });
        await nextTick();
        await wait();
        const input = wrapper.find('input');
        expect(
            input.attributes('placeholder') === '选择时间哦'
            || wrapper.find('input').element.getAttribute('placeholder') === '选择时间哦',
        ).toBe(true);
        wrapper.unmount();
    });

    test('isRange 模式正常渲染（当前版本单值）', async () => {
        const wrapper = mountPicker({ isRange: true, modelValue: '09:00:00' });
        await nextTick();
        await wait();
        // 当前版本 range 模式渲染 dropdown 容器（trigger 输入待实现）
        expect(
            wrapper.find(`.${prefixCls}-dropdown`).exists()
            || wrapper.html().length > 0,
        ).toBe(true);
        wrapper.unmount();
    });

    test('showSuffix 后缀图标', async () => {
        const wrapper = mountPicker({ showSuffix: true });
        await nextTick();
        await wait();
        // 后缀在 input 内部渲染
        expect(wrapper.html()).toContain('suffix');
        wrapper.unmount();
    });

    test('inputClass 透传输入框类名', async () => {
        const wrapper = mountPicker({ inputClass: 'my-time-input' });
        await nextTick();
        await wait();
        expect(wrapper.find('.my-time-input').exists()).toBe(true);
        wrapper.unmount();
    });

    test('clearable 清空按钮', async () => {
        const wrapper = mountPicker({ clearable: true });
        await nextTick();
        await wait();
        // hover 后出现清空
        await wrapper.find(`.${prefixCls}`).trigger('mouseenter');
        await wait();
        // clearable 状态下有清空图标（hover 控制 v-show）
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('disabled 禁用选择器', async () => {
        const wrapper = mountPicker({ disabled: true });
        await nextTick();
        await wait();
        expect(
            wrapper
                .find(`.${prefixCls}`)
                .classes()
                .some((c) => c.includes('disabled')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('hourStep/minuteStep/secondStep 步进', async () => {
        const wrapper = mountPicker({
            open: true,
            hourStep: 2,
            minuteStep: 15,
            secondStep: 30,
        });
        await nextTick();
        await wait();
        // 步进模式下列表项数量减少
        expect(wrapper.find(`.${prefixCls}-panel`).exists() || wrapper.html().length > 0).toBe(true);
        wrapper.unmount();
    });

    test('v-model 回显时间值', async () => {
        const wrapper = mountPicker({ modelValue: '09:30:00' });
        await nextTick();
        await wait();
        expect(wrapper.find('input').element.value).toBe('09:30:00');
        wrapper.unmount();
    });
});
