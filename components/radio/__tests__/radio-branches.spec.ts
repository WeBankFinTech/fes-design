import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Radio from '../radio.vue';
import RadioGroup from '../../radio-group/radio-group.vue';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const radioCls = getPrefixCls('radio');

const OPTIONS = [
    { label: '甲', value: 1 },
    { label: '乙', value: 2 },
];

describe('FRadio 交互分支补全', () => {
    test('mouseover/mouseout 切换 is-hover 类', async () => {
        const wrapper = mount(Radio, { props: { label: '悬停项' } });
        const radio = wrapper.find(`.${radioCls}`);
        expect(radio.classes()).not.toContain('is-hover');
        await radio.trigger('mouseover');
        expect(radio.classes()).toContain('is-hover');
        await radio.trigger('mouseout');
        expect(radio.classes()).not.toContain('is-hover');
        wrapper.unmount();
    });

    test('受控组切换：onUpdate:modelValue 回写驱动选中态与 change', async () => {
        let value = 1;
        const wrapper = mount(RadioGroup, {
            props: {
                'modelValue': value,
                'options': OPTIONS,
                'onUpdate:modelValue': (v: number) => {
                    value = v;
                },
            },
        });
        await nextTick();
        await wait(50);
        let radios = wrapper.findAll(`.${radioCls}`);
        expect(radios[0].classes().includes('is-checked')).toBe(true);
        expect(radios[1].classes().includes('is-checked')).toBe(false);
        await radios[1].trigger('click');
        await wait(50);
        expect(value).toBe(2);
        expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toBe(2);
        // 回写 props 后选中态迁移
        await wrapper.setProps({ modelValue: value });
        radios = wrapper.findAll(`.${radioCls}`);
        expect(radios[0].classes().includes('is-checked')).toBe(false);
        expect(radios[1].classes().includes('is-checked')).toBe(true);
        // change 事件携带新选中值（组内 afterSelect 回调）
        expect(wrapper.emitted('change')!.at(-1)![0]).toBe(2);
        wrapper.unmount();
    });

    test('组级 disabled：点击不触发任何切换', async () => {
        const wrapper = mount(RadioGroup, {
            props: { modelValue: 1, options: OPTIONS, disabled: true },
        });
        await nextTick();
        await wait(50);
        const radios = wrapper.findAll(`.${radioCls}`);
        expect(radios[0].classes().includes('is-disabled')).toBe(true);
        await radios[1].trigger('click');
        await wait(50);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });
});
