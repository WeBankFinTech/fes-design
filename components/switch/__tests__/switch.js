import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import FSwitch from '../switch.vue';

import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('switch');

describe('switch', () => {
    test('actived test', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: true,
            },
        });

        expect(wrapper.classes('is-checked')).toBe(true);

        await wrapper.trigger('click');

        expect(wrapper.classes('is-checked')).toBe(false);
    });

    test('unactived test', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: false,
            },
        });

        expect(wrapper.classes('is-checked')).toBe(false);

        await wrapper.trigger('click');

        expect(wrapper.classes('is-checked')).toBe(true);
    });

    test('activeValue and inactiveValue test', async () => {
        const val = ref(1);
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: val,
                activeValue: 1,
                inactiveValue: 2,
            },
        });

        expect(wrapper.classes('is-checked')).toBe(true);

        val.value = 2;

        await nextTick();

        expect(wrapper.classes('is-checked')).toBe(false);
    });

    test('change event test', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: true,
            },
        });

        await wrapper.trigger('click');
        const changeEvent = wrapper.emitted('change');

        expect(changeEvent).toHaveLength(1);

        expect(changeEvent[0]).toEqual([false]);

        await wrapper.trigger('click');

        expect(changeEvent).toHaveLength(2);

        expect(changeEvent[1]).toEqual([true]);
    });

    test('slot test', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: true,
            },
            slots: {
                active: 'open',
                inactive: 'closed',
            },
        });

        const inner = wrapper.find(`.${prefixCls}-inner`);

        expect(inner.text()).toBe('open');

        await wrapper.trigger('click');

        expect(inner.text()).toBe('closed');
    });
});
