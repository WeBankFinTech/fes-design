import { mount } from '@vue/test-utils';
import CheckboxGroup from '../checkbox-group.vue';
import Checkbox from '../../checkbox/checkbox.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('checkbox-group');

const _mount = (props, slots = {}) =>
    mount(CheckboxGroup, {
        props,
        slots,
    });

describe('Checkbox', () => {
    test('FCheckbox default', async () => {
        const wrapper = _mount(
            {},
            {
                default: () => (
                    <>
                        <Checkbox class={'trigger'} value={1}>
                            1
                        </Checkbox>
                        <Checkbox value={2}>2</Checkbox>
                    </>
                ),
            },
        );
        await wrapper.find(`.trigger`).trigger('click');
        expect(wrapper.emitted()).toHaveProperty('change');
        expect(wrapper.emitted()['change'][0][0]).toEqual([1]);
        // const wrapper = mount(CheckboxGroup, {
        //     props: {},
        // });
        // await wrapper.find(`.${prefixCls}`).trigger('click');
        // expect(wrapper.classes('is-checked')).toBe(true);
        // expect(wrapper.emitted()).toHaveProperty('change');
        // await wrapper.find(`.${prefixCls}`).trigger('click');
        // expect(wrapper.classes('is-checked')).toBe(false);
        // await wrapper.find(`.${prefixCls}`).trigger('mouseover');
        // expect(wrapper.classes('is-hover')).toBe(true);
        // await wrapper.find(`.${prefixCls}`).trigger('mouseout');
        // expect(wrapper.classes('is-hover')).toBe(false);
    });

    // test('FCheckbox indeterminate', async () => {
    //     const wrapper = mount(Checkbox, {
    //         props: {
    //             indeterminate: true,
    //         },
    //     });
    //     expect(wrapper.classes('is-indeterminate')).toBe(true);
    // });

    // test('FCheckbox disabled', async () => {
    //     const wrapper = mount(Checkbox, {
    //         props: {
    //             disabled: true,
    //         },
    //     });
    //     expect(wrapper.classes('is-disabled')).toBe(true);
    //     await wrapper.find(`.${prefixCls}`).trigger('click');
    //     expect(wrapper.classes('is-checked')).toBe(false);
    //     expect(wrapper.emitted()).not.toHaveProperty('change');
    // });
});
