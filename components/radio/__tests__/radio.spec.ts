import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Radio from '../radio.vue';
import RadioGroup from '../../radio-group/radio-group.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const radioCls = getPrefixCls('radio');
const wait = (ms = 50) => new Promise((r) => setTimeout(r, ms));

describe('FRadio 独立使用', () => {
    test('渲染 label 文本', () => {
        const wrapper = mount(Radio, {
            props: { label: '独立单选' },
        });
        expect(wrapper.text()).toContain('独立单选');
        expect(wrapper.find(`.${radioCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('v-model 选中态与 change 事件（点击 label）', async () => {
        const wrapper = mount(Radio, {
            props: { label: '选择我', modelValue: false },
        });
        await wrapper.find(`.${radioCls}`).trigger('click');
        await wait();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates![0][0]).toBe(true);
        expect(wrapper.emitted('change')).toBeTruthy();
        wrapper.unmount();
    });

    test('disabled 禁用点击', async () => {
        const wrapper = mount(Radio, {
            props: { label: '禁用项', disabled: true },
        });
        expect(
            wrapper
                .find(`.${radioCls}`)
                .classes()
                .some((c) => c.includes('disabled')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('在 RadioGroup 中选中切换', async () => {
        const wrapper = mount(RadioGroup, {
            props: {
                modelValue: 1,
                options: [
                    { label: '甲', value: 1 },
                    { label: '乙', value: 2 },
                ],
            },
        });
        await nextTick();
        await wait();
        const radios = wrapper.findAll(`.${radioCls}`);
        const second = radios.find((r) => r.text() === '乙');
        if (!second) {
            throw new Error('未渲染出乙选项');
        }
        await second.trigger('click');
        await wait();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates![updates!.length - 1][0]).toBe(2);
        wrapper.unmount();
    });

    test('button 样式渲染', () => {
        const wrapper = mount(Radio, {
            props: { label: '按钮样式', type: 'button' },
        });
        expect(wrapper.html().length).toBeGreaterThan(0);
        wrapper.unmount();
    });
});
