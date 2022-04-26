import { mount } from '@vue/test-utils';
import CheckboxGroup from '../checkbox-group.vue';
import Checkbox from '../../checkbox';

const TRIGGER_CLASS = 'trigger';

const _mount = (props = {}, slots = {}) =>
    mount(CheckboxGroup, {
        props,
        slots: {
            ...{
                default: () => (
                    <>
                        <Checkbox class={TRIGGER_CLASS} value={1}>
                            1
                        </Checkbox>
                        <Checkbox value={2}>2</Checkbox>
                    </>
                ),
            },
            ...slots,
        },
    });

describe('FCheckboxGroup', () => {
    test('FCheckboxGroup default', async () => {
        const wrapper = _mount();
        await wrapper.find(`.trigger`).trigger('click');
        expect(wrapper.emitted()).toHaveProperty('change');
        expect(wrapper.emitted()['change'][0][0]).toEqual([1]);
        expect(wrapper.emitted()).toHaveProperty('update:modelValue');
        expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual([1]);
        await wrapper.find(`.trigger`).trigger('click');
        expect(wrapper.emitted()).toHaveProperty('change');
        expect(wrapper.emitted()['change'][1][0]).toEqual([]);
        expect(wrapper.emitted()).toHaveProperty('update:modelValue');
        expect(wrapper.emitted()['update:modelValue'][1][0]).toEqual([]);
    });

    test('FCheckboxGroup vertical', async () => {
        const wrapper = _mount({
            vertical: true,
        });
        expect(wrapper.classes('is-vertical')).toBe(true);
    });

    test('FCheckboxGroup disabled', async () => {
        const wrapper = _mount({
            disabled: true,
        });
        expect(wrapper.classes('is-disabled')).toBe(true);
        await wrapper.find(`.${TRIGGER_CLASS}`).trigger('click');
        expect(wrapper.emitted()).not.toHaveProperty('change');
    });
});
