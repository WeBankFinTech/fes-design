import { mount } from '@vue/test-utils';
import FSwitch from '../switch.vue';

const prefixCls = 'fes-switch';

describe('switch loading prop #914', () => {
    test('loading: true shows the loading icon', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: false,
                loading: true,
            },
        });

        const loadingIcon = wrapper.find(`.${prefixCls}-loading`);
        expect(loadingIcon.exists()).toBe(true);
    });

    test('loading: true blocks click toggle', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: false,
                loading: true,
            },
        });

        expect(wrapper.classes('is-checked')).toBe(false);

        await wrapper.trigger('click');

        expect(wrapper.classes('is-checked')).toBe(false);
    });

    test('loading: true shows loading icon in checked state', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: true,
                loading: true,
            },
        });

        expect(wrapper.classes('is-checked')).toBe(true);
        const loadingIcon = wrapper.find(`.${prefixCls}-loading`);
        expect(loadingIcon.exists()).toBe(true);
    });

    test('loading: false does not show loading icon', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: false,
                loading: false,
            },
        });

        const loadingIcon = wrapper.find(`.${prefixCls}-loading`);
        expect(loadingIcon.exists()).toBe(false);
    });

    test('normal toggle works when loading is false', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: false,
                loading: false,
            },
        });

        expect(wrapper.classes('is-checked')).toBe(false);

        await wrapper.trigger('click');

        expect(wrapper.classes('is-checked')).toBe(true);
    });
});