import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
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

describe('switch beforeChange 拦截链（异步防误触）', () => {
    test('beforeChange 返回 false 拒绝切换', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: false,
                beforeChange: () => false,
            },
        });
        await wrapper.trigger('click');
        await nextTick();
        // 拒绝：状态不变
        expect(wrapper.classes('is-checked')).toBe(false);
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('beforeChange 抛异常拒绝切换且 loading 复位', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: false,
                beforeChange: () => Promise.reject(new Error('fail')),
            },
        });
        await wrapper.trigger('click');
        await new Promise((r) => setTimeout(r, 0));
        expect(wrapper.classes('is-checked')).toBe(false);
        // loading 复位（不再带 is-loading）
        expect(wrapper.classes('is-loading')).toBe(false);
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('beforeChange 通过后正常切换（异步确认流）', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: false,
                beforeChange: () => Promise.resolve(true),
            },
        });
        await wrapper.trigger('click');
        await new Promise((r) => setTimeout(r, 0));
        expect(wrapper.classes('is-checked')).toBe(true);
        const change = wrapper.emitted('change');
        expect(change).toBeTruthy();
        expect(change![0][0]).toBe(true);
        wrapper.unmount();
    });

    test('pending 期间带 is-loading 类', async () => {
        let resolveConfirm: (v: boolean) => void = () => {};
        const wrapper = mount(FSwitch, {
            props: {
                modelValue: false,
                beforeChange: () =>
                    new Promise<boolean>((r) => {
                        resolveConfirm = r;
                    }),
            },
        });
        await wrapper.trigger('click');
        await nextTick();
        // 异步未决：loading 图标渲染（v-if="loadingRef"，非 class）
        expect(wrapper.find(`.${prefixCls}-loading`).exists()).toBe(true);
        resolveConfirm(true);
        await new Promise((r) => setTimeout(r, 0));
        expect(wrapper.find(`.${prefixCls}-loading`).exists()).toBe(false);
        expect(wrapper.classes('is-checked')).toBe(true);
        wrapper.unmount();
    });

    test('inactiveValue 初始未选时 onMounted 回填非受控值（issue #5290 规避）', async () => {
        const wrapper = mount(FSwitch, {
            props: {
                inactiveValue: 'off',
                activeValue: 'on',
            },
        });
        await nextTick();
        await new Promise((r) => setTimeout(r, 0));
        // 非受控模式：nextTick 后 internal 值 = 'off' → 未选中态
        expect(wrapper.classes('is-checked')).toBe(false);
        // 点击切到 activeValue
        await wrapper.trigger('click');
        await new Promise((r) => setTimeout(r, 0));
        expect(wrapper.classes('is-checked')).toBe(true);
        wrapper.unmount();
    });
});
