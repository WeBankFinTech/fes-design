import { h } from 'vue';
import { mount } from '@vue/test-utils';
import RadioButton from '../radio-button';
import RadioGroup from '../../radio-group';
import getPrefixCls from '../../_util/getPrefixCls';

// FRadioButton 依赖 group 注入（读取 group.props.size 等），
// 单独使用会报错，必须在 FRadioGroup 内部测试。
const buttonCls = getPrefixCls('radio-button');

const getBtns = (wrapper) => wrapper.findAll(`.${buttonCls}`);

describe('RadioButton', () => {
    test('FRadioButton 基本渲染与默认样式', () => {
        const wrapper = mount(RadioGroup, {
            props: { modelValue: 'a' },
            slots: {
                default: () => [
                    h(RadioButton, { class: 'btn-a', value: 'a' }, 'A'),
                    h(RadioButton, { class: 'btn-b', value: 'b' }, 'B'),
                ],
            },
        });
        const btnA = wrapper.find('.btn-a');
        const btnB = wrapper.find('.btn-b');
        expect(btnA.classes(buttonCls)).toBe(true);
        // group 默认 size=middle、bordered=true
        expect(btnA.classes(`${buttonCls}-middle`)).toBe(true);
        expect(btnA.classes(`${buttonCls}-border`)).toBe(true);
        expect(btnB.classes(`${buttonCls}-middle`)).toBe(true);
        expect(btnA.text()).toBe('A');
    });

    test('FRadioButton v-model 选中切换', async () => {
        let modelValue = 'a';
        const wrapper = mount(RadioGroup, {
            props: {
                modelValue,
                'onUpdate:modelValue': (val) => {
                    modelValue = val;
                },
            },
            slots: {
                default: () => [
                    h(RadioButton, { value: 'a' }, 'A'),
                    h(RadioButton, { value: 'b' }, 'B'),
                ],
            },
        });
        expect(getBtns(wrapper)[0].classes('is-checked-default-border')).toBe(true);
        expect(getBtns(wrapper)[1].classes('is-checked-default-border')).toBe(false);

        await getBtns(wrapper)[1].trigger('click');
        expect(modelValue).toBe('b');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('b');
        expect(wrapper.emitted('change')[0][0]).toBe('b');
        await wrapper.setProps({ modelValue });
        expect(getBtns(wrapper)[0].classes('is-checked-default-border')).toBe(false);
        expect(getBtns(wrapper)[1].classes('is-checked-default-border')).toBe(true);
    });

    test('FRadioButton disabled', async () => {
        const wrapper = mount(RadioGroup, {
            props: { disabled: true },
            slots: {
                default: () => h(RadioButton, { value: 'a' }, 'A'),
            },
        });
        const btn = getBtns(wrapper)[0];
        expect(btn.classes('is-disabled')).toBe(true);
        await btn.trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    test('FRadioButton 单个 disabled', async () => {
        const wrapper = mount(RadioGroup, {
            props: {},
            slots: {
                default: () => [
                    h(RadioButton, { value: 'a' }, 'A'),
                    h(RadioButton, { value: 'b', disabled: true }, 'B'),
                ],
            },
        });
        expect(getBtns(wrapper)[1].classes('is-disabled')).toBe(true);
        await getBtns(wrapper)[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        await getBtns(wrapper)[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('a');
    });

    test('FRadioButton size type 样式', () => {
        const wrapper = mount(RadioGroup, {
            props: { modelValue: 'a', size: 'small', type: 'primary' },
            slots: {
                default: () => h(RadioButton, { value: 'a' }, 'A'),
            },
        });
        const btn = getBtns(wrapper)[0];
        expect(btn.classes(`${buttonCls}-small`)).toBe(true);
        expect(btn.classes('is-checked-primary-border')).toBe(true);
    });

    test('FRadioButton bordered=false 无边框样式', () => {
        const wrapper = mount(RadioGroup, {
            props: { modelValue: 'a', bordered: false },
            slots: {
                default: () => h(RadioButton, { value: 'a' }, 'A'),
            },
        });
        const btn = getBtns(wrapper)[0];
        expect(btn.classes(`${buttonCls}-no-border`)).toBe(true);
        // 无边框选中样式在 content 上
        const content = btn.find(`.${buttonCls}-content`);
        expect(content.classes(`${buttonCls}-content-checked`)).toBe(true);
        expect(content.classes(`${buttonCls}-content-checked-middle`)).toBe(
            true,
        );
        expect(content.classes(`${buttonCls}-content-checked-default`)).toBe(
            true,
        );
    });

    test('FRadioButton fullLine', () => {
        const wrapper = mount(RadioGroup, {
            props: { fullLine: true },
            slots: {
                default: () => h(RadioButton, { value: 'a' }, 'A'),
            },
        });
        expect(getBtns(wrapper)[0].classes('is-flex')).toBe(true);
    });

    test('FRadioButton 插槽 label 渲染', () => {
        const wrapper = mount(RadioGroup, {
            props: {},
            slots: {
                default: () => h(
                    RadioButton,
                    { value: 'a', label: '文本label' },
                    {
                        default: () => '插槽内容',
                        icon: () => h('i', { class: 'icon-mock' }),
                    },
                ),
            },
        });
        const btn = getBtns(wrapper)[0];
        expect(btn.text()).toContain('插槽内容');
        expect(btn.find('.icon-mock').exists()).toBe(true);
    });
});
