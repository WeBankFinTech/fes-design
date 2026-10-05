import { h } from 'vue';
import { mount } from '@vue/test-utils';
import CheckboxGroup from '../checkbox-group.vue';
import Checkbox from '../../checkbox';
import getPrefixCls from '../../_util/getPrefixCls';

const checkboxCls = getPrefixCls('checkbox');

describe('FCheckboxGroup 空值守卫分支（useCheckboxGroup.isSelect）', () => {
    test('options 中 value 为 null：即使 modelValue 含 null 也不判为已选', async () => {
        const wrapper = mount(CheckboxGroup, {
            props: {
                modelValue: [null],
                options: [{ value: null, label: '空值项' }],
            },
        });
        const cb = wrapper.find(`.${checkboxCls}`);
        expect(cb.exists()).toBe(true);
        // isSelect(null) 命中 groupVal/itemVal 为 null 的守卫 → 返回 false
        expect(cb.classes('is-checked')).toBe(false);
        // 点击走 toggle：null 已在数组 → 移除 → 变空数组
        await cb.trigger('click');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toEqual([]);
        expect(wrapper.emitted('change')).toBeTruthy();
        wrapper.unmount();
    });

    test('slot 中 null value 的 checkbox：不受影响且不误判已选', () => {
        const wrapper = mount(CheckboxGroup, {
            props: { modelValue: ['a'] },
            slots: {
                default: () => [
                    h(Checkbox, { value: 'a' }, 'A'),
                    h(Checkbox, { value: null }, 'N'),
                ],
            },
        });
        const cbs = wrapper.findAll(`.${checkboxCls}`);
        expect(cbs.length).toBe(2);
        expect(cbs[0].classes('is-checked')).toBe(true);
        expect(cbs[1].classes('is-checked')).toBe(false);
        wrapper.unmount();
    });
});
