import { h } from 'vue';
import { mount } from '@vue/test-utils';
import RadioGroup from '../radio-group.vue';
import Radio from '../../radio';
import getPrefixCls from '../../_util/getPrefixCls';

const radioCls = getPrefixCls('radio');
const buttonCls = getPrefixCls('radio-button');
const groupCls = getPrefixCls('radio-group');

const OPTIONS = [
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
    { value: 3, label: '选项三', disabled: true },
];

const getGroupItems = (wrapper, cls) => wrapper.findAll(`.${cls}`);

describe('RadioGroup', () => {
    test('FRadioGroup 基本渲染', () => {
        const wrapper = mount(RadioGroup, {
            props: {
                options: OPTIONS,
            },
        });
        expect(wrapper.classes(groupCls)).toBe(true);
        const radios = getGroupItems(wrapper, radioCls);
        expect(radios.length).toBe(3);
        expect(radios[0].text()).toBe('选项一');
        expect(radios[2].text()).toBe('选项三');
        // 组内的 radio 带 is-item 样式
        expect(radios[0].classes('is-item')).toBe(true);
        // 单个 option disabled
        expect(radios[2].classes('is-disabled')).toBe(true);
    });

    test('FRadioGroup v-model', async () => {
        let modelValue = 1;
        const wrapper = mount(RadioGroup, {
            props: {
                modelValue,
                'options': OPTIONS,
                'onUpdate:modelValue': (val) => {
                    modelValue = val;
                },
            },
        });
        let radios = getGroupItems(wrapper, radioCls);
        expect(radios[0].classes('is-checked')).toBe(true);
        expect(radios[1].classes('is-checked')).toBe(false);

        await radios[1].trigger('click');
        expect(modelValue).toBe(2);
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(2);
        expect(wrapper.emitted('change')[0][0]).toBe(2);
        await wrapper.setProps({ modelValue });
        radios = getGroupItems(wrapper, radioCls);
        expect(radios[0].classes('is-checked')).toBe(false);
        expect(radios[1].classes('is-checked')).toBe(true);

        // 点击禁用项：选中状态不变
        await radios[2].trigger('click');
        expect(modelValue).toBe(2);
        expect(wrapper.emitted('update:modelValue').length).toBe(1);
    });

    test('FRadioGroup 再次点击取消选中', async () => {
        const wrapper = mount(RadioGroup, {
            props: {
                modelValue: 1,
                options: OPTIONS,
            },
        });
        await getGroupItems(wrapper, radioCls)[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(null);
        await wrapper.setProps({ modelValue: null });
        expect(getGroupItems(wrapper, radioCls)[0].classes('is-checked')).toBe(
            false,
        );
    });

    test('FRadioGroup cancelable=false 不可取消', async () => {
        const wrapper = mount(RadioGroup, {
            props: {
                modelValue: 1,
                options: OPTIONS,
                cancelable: false,
            },
        });
        await getGroupItems(wrapper, radioCls)[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(
            getGroupItems(wrapper, radioCls)[0].classes('is-checked'),
        ).toBe(true);
    });

    test('FRadioGroup disabled', async () => {
        const wrapper = mount(RadioGroup, {
            props: {
                options: OPTIONS,
                disabled: true,
            },
        });
        expect(wrapper.classes('is-disabled')).toBe(true);
        expect(getGroupItems(wrapper, radioCls)[0].classes('is-disabled')).toBe(
            true,
        );
        await getGroupItems(wrapper, radioCls)[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    test('FRadioGroup vertical', () => {
        const wrapper = mount(RadioGroup, {
            props: {
                options: OPTIONS,
                vertical: true,
            },
        });
        expect(wrapper.classes('is-vertical')).toBe(true);
        expect(getGroupItems(wrapper, radioCls)[0].classes('is-item-vertical')).toBe(
            true,
        );
    });

    test('FRadioGroup valueField labelField', async () => {
        const wrapper = mount(RadioGroup, {
            props: {
                options: [
                    { v: 'a', t: '甲' },
                    { v: 'b', t: '乙' },
                ],
                valueField: 'v',
                labelField: 't',
            },
        });
        const radios = getGroupItems(wrapper, radioCls);
        expect(radios[0].text()).toBe('甲');
        await radios[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('b');
        expect(wrapper.emitted('change')[0][0]).toBe('b');
    });

    test('FRadioGroup slot 渲染', async () => {
        const wrapper = mount(RadioGroup, {
            slots: {
                default: () => [
                    h(Radio, { value: 'x' }, 'X'),
                    h(Radio, { value: 'y' }, 'Y'),
                ],
            },
        });
        const radios = getGroupItems(wrapper, radioCls);
        expect(radios.length).toBe(2);
        expect(radios[0].text()).toBe('X');
        await radios[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('x');
        expect(wrapper.emitted('change')[0][0]).toBe('x');
    });

    test('FRadioGroup optionType=button 渲染 RadioButton', async () => {
        const wrapper = mount(RadioGroup, {
            props: {
                options: OPTIONS.slice(0, 2),
                optionType: 'button',
            },
        });
        expect(getGroupItems(wrapper, radioCls).length).toBe(0);
        const buttons = getGroupItems(wrapper, buttonCls);
        expect(buttons.length).toBe(2);
        expect(buttons[0].text()).toBe('选项一');
        await buttons[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(2);
    });

    test('FRadioGroup modelValue 外部更新', async () => {
        const wrapper = mount(RadioGroup, {
            props: {
                modelValue: 1,
                options: OPTIONS,
            },
        });
        await wrapper.setProps({ modelValue: 3 });
        const radios = getGroupItems(wrapper, radioCls);
        expect(radios[0].classes('is-checked')).toBe(false);
        // value 3 是 disabled 的 option，但外部赋值依然选中
        expect(radios[2].classes('is-checked')).toBe(true);
    });
});
