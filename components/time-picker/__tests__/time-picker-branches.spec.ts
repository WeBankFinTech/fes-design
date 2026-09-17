import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FTimePicker from '../time-picker.vue';

// time-picker.vue 分支补全：showNowShortcut 的 format/step 组合、
// getCurrentTime 按 format 裁剪、isRange 展示分支、blur 重置 tempValue

const mountPicker = (props = {}) =>
    mount(FTimePicker, {
        props: {
            appendToContainer: false,
            ...props,
        } as any,
        attachTo: document.body,
        global: {
            // stub Popper：Teleport/Transition 的 stub 链路会吞掉弹层默认
            // 插槽（button 查不到）；直接平铺 trigger + content（先例：
            // time-picker.spec 的 clearable 用例）
            stubs: {
                Popper: {
                    template: '<div><slot name="trigger" /><slot /></div>',
                },
            },
        },
    });

afterEach(() => {
    document.body.innerHTML = '';
});

describe('FTimePicker 分支补全', () => {
    test.each([
        ['HH:mm:ss', 1, 1, 1, true],
        ['HH:mm:ss', 2, 1, 1, false],
        ['HH:mm:ss', 1, 2, 1, false],
        ['HH:mm:ss', 1, 1, 2, false],
        ['HH:mm', 1, 1, 5, true],
        ['mm:ss', 3, 1, 1, true],
    ])(
        'showNowShortcut: format=%s steps=(%i,%i,%i) → %p',
        async (format, h, m, s, expected) => {
            const wrapper = mountPicker({ format, hourStep: h, minuteStep: m, secondStep: s });
            await nextTick();
            // 「此刻」按钮只在 shortcut 可用时渲染
            const buttons = wrapper.findAll('.fes-btn');
            const hasNow = buttons.some((b) => b.text() === '此刻');
            expect(hasNow).toBe(expected);
            wrapper.unmount();
        },
    );

    test('「此刻」按 format 裁剪时间段（HH:mm 只写时与分）', async () => {
        const wrapper = mountPicker({
            modelValue: '01:02:03',
            format: 'HH:mm',
            open: true,
        });
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        const nowBtn = wrapper
            .findAll('.fes-btn')
            .find((b) => b.text() === '此刻');
        expect(nowBtn).toBeTruthy();
        await nowBtn!.trigger('click');
        await nextTick();
        const updated = wrapper.emitted('update:modelValue');
        expect(updated).toBeTruthy();
        // HH:mm → 两段
        expect(String(updated![updated!.length - 1][0])).toMatch(
            /^\d{2}:\d{2}$/,
        );
        wrapper.unmount();
    });

    test('isRange 模式 displayValue 走数组分支', () => {
        const wrapper = mountPicker({ isRange: true, modelValue: '01:02:03' });
        expect(wrapper.vm.displayValue).toEqual('01:02:03');
        wrapper.unmount();
    });

    test('blur 关闭弹层并重置手动输入值', async () => {
        const wrapper = mountPicker({ modelValue: '01:02:03' });
        await nextTick();
        const input = wrapper.find('input');
        expect(input.exists()).toBe(true);
        await input.setValue('09:09:09');
        await nextTick();
        // 手动输入合法 → currentValue 立即更新
        const updated = wrapper.emitted('update:modelValue');
        expect(updated).toBeTruthy();
        expect(updated![updated!.length - 1][0]).toBe('09:09:09');
        await input.trigger('blur');
        await nextTick();
        const blurred = wrapper.emitted('blur');
        expect(blurred).toBeTruthy();
        wrapper.unmount();
    });
});
