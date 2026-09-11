import { h } from 'vue';
import { mount } from '@vue/test-utils';
import CheckboxGroup from '../checkbox-group.vue';
import Checkbox from '../../checkbox';
import getPrefixCls from '../../_util/getPrefixCls';

const checkboxCls = getPrefixCls('checkbox');
const groupCls = getPrefixCls('checkbox-group');

const OPTIONS = [
    { value: 1, label: '选项一' },
    { value: 2, label: '选项二' },
    { value: 3, label: '选项三', disabled: true },
];

const getCheckboxes = (wrapper) => wrapper.findAll(`.${checkboxCls}`);

describe('CheckboxGroup', () => {
    test('FCheckboxGroup 基本渲染', () => {
        const wrapper = mount(CheckboxGroup, {
            props: {
                options: OPTIONS,
            },
        });
        expect(wrapper.classes(groupCls)).toBe(true);
        const checkboxes = getCheckboxes(wrapper);
        expect(checkboxes.length).toBe(3);
        expect(checkboxes[0].text()).toBe('选项一');
        expect(checkboxes[1].text()).toBe('选项二');
        expect(checkboxes[2].text()).toBe('选项三');
        // 组内的 checkbox 带 is-item 样式
        expect(checkboxes[0].classes('is-item')).toBe(true);
        // 单个 option disabled
        expect(checkboxes[2].classes('is-disabled')).toBe(true);
    });

    test('FCheckboxGroup v-model', async () => {
        let modelValue = [1];
        const wrapper = mount(CheckboxGroup, {
            props: {
                modelValue,
                'options': OPTIONS.slice(0, 2),
                'onUpdate:modelValue': (val) => {
                    modelValue = val;
                },
            },
        });
        let checkboxes = getCheckboxes(wrapper);
        expect(checkboxes[0].classes('is-checked')).toBe(true);
        expect(checkboxes[1].classes('is-checked')).toBe(false);

        await checkboxes[1].trigger('click');
        expect(modelValue).toEqual([1, 2]);
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([1, 2]);
        expect(wrapper.emitted('change')[0][0]).toEqual([1, 2]);
        // 回写 props 后保持选中状态
        await wrapper.setProps({ modelValue });
        checkboxes = getCheckboxes(wrapper);
        expect(checkboxes[0].classes('is-checked')).toBe(true);
        expect(checkboxes[1].classes('is-checked')).toBe(true);

        // 再次点击已选中的取消选中
        await checkboxes[0].trigger('click');
        expect(modelValue).toEqual([2]);
        expect(wrapper.emitted('update:modelValue')[1][0]).toEqual([2]);
        await wrapper.setProps({ modelValue });
        checkboxes = getCheckboxes(wrapper);
        expect(checkboxes[0].classes('is-checked')).toBe(false);
        expect(checkboxes[1].classes('is-checked')).toBe(true);
    });

    test('FCheckboxGroup 再次点击取消选中', async () => {
        const wrapper = mount(CheckboxGroup, {
            props: {
                modelValue: [1, 2],
                options: OPTIONS.slice(0, 2),
            },
        });
        await getCheckboxes(wrapper)[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([2]);
    });

    test('FCheckboxGroup disabled', async () => {
        const wrapper = mount(CheckboxGroup, {
            props: {
                options: OPTIONS,
                disabled: true,
            },
        });
        expect(wrapper.classes('is-disabled')).toBe(true);
        await getCheckboxes(wrapper)[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    test('FCheckboxGroup 单个 option disabled', async () => {
        const wrapper = mount(CheckboxGroup, {
            props: {
                options: OPTIONS,
            },
        });
        await getCheckboxes(wrapper)[2].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    test('FCheckboxGroup vertical', () => {
        const wrapper = mount(CheckboxGroup, {
            props: {
                options: OPTIONS,
                vertical: true,
            },
        });
        expect(wrapper.classes('is-vertical')).toBe(true);
    });

    test('FCheckboxGroup valueField labelField', async () => {
        const wrapper = mount(CheckboxGroup, {
            props: {
                options: [
                    { v: 1, t: '一' },
                    { v: 2, t: '二' },
                ],
                valueField: 'v',
                labelField: 't',
            },
        });
        const checkboxes = getCheckboxes(wrapper);
        expect(checkboxes[0].text()).toBe('一');
        expect(checkboxes[1].text()).toBe('二');
        await checkboxes[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([2]);
    });

    test('FCheckboxGroup slot 渲染', async () => {
        const wrapper = mount(CheckboxGroup, {
            slots: {
                default: () => [
                    h(Checkbox, { value: 'a' }, 'A'),
                    h(Checkbox, { value: 'b' }, 'B'),
                ],
            },
        });
        const checkboxes = getCheckboxes(wrapper);
        expect(checkboxes.length).toBe(2);
        expect(checkboxes[0].text()).toBe('A');
        await checkboxes[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(['a']);
        expect(wrapper.emitted('change')[0][0]).toEqual(['a']);
    });

    test('FCheckboxGroup modelValue 外部更新', async () => {
        const wrapper = mount(CheckboxGroup, {
            props: {
                modelValue: [],
                options: OPTIONS,
            },
        });
        await wrapper.setProps({ modelValue: [2] });
        const checkboxes = getCheckboxes(wrapper);
        expect(checkboxes[0].classes('is-checked')).toBe(false);
        expect(checkboxes[1].classes('is-checked')).toBe(true);
    });
});
