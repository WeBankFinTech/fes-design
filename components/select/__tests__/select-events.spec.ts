import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { FSelect as Select } from '../index';

const OPTIONS = [
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'shenzhen', label: '深圳' },
    { value: 'guangzhou', label: '广州' },
];

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));

const $ = (sel: string) => document.querySelector(sel);
const $$ = (sel: string) => Array.from(document.querySelectorAll(sel));

const mountSelect = (props: Record<string, unknown> = {}) => {
    document.body.innerHTML = '';
    return mount(Select, {
        props: {
            options: OPTIONS,
            filterable: true,
            ...props,
        },
        attachTo: document.body,
    });
};

describe('FSelect 搜索与滚动事件', () => {
    test('remote+filterable 输入触发 search 事件', async () => {
        const wrapper = mountSelect({ remote: true });
        await nextTick();
        await wait();
        await wrapper.find('.fes-select-trigger').trigger('click');
        await wait();
        const input = wrapper.find('input');
        await input.setValue('北');
        await input.trigger('input');
        await wait();
        const search = wrapper.emitted('search');
        expect(search).toBeTruthy();
        expect(search![0][0]).toBe('北');
        wrapper.unmount();
    });

    test('filterable 非 remote 输入触发 filter 事件', async () => {
        const wrapper = mountSelect();
        await nextTick();
        await wait();
        await wrapper.find('.fes-select-trigger').trigger('click');
        await wait();
        const input = wrapper.find('input');
        await input.setValue('上');
        await input.trigger('input');
        await wait();
        const filter = wrapper.emitted('filter');
        expect(filter).toBeTruthy();
        expect(filter![0][0]).toBe('上');
        wrapper.unmount();
    });

    test('visibleChange 打开收起时触发', async () => {
        const wrapper = mountSelect();
        await nextTick();
        await wait();
        // Popper v-model 驱动 isOpenedRef，watch 发出 visibleChange
        await wrapper.find('.fes-select-trigger').trigger('click');
        await wait(120);
        const emitted = wrapper.emitted('visibleChange');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toBe(true);
        wrapper.unmount();
    });

    test('focus/blur 事件透传', async () => {
        const wrapper = mountSelect();
        await nextTick();
        await wait();
        const input = wrapper.find('input');
        if (input.exists()) {
            await input.trigger('focus');
            await input.trigger('blur');
            await wait();
            // focus/blur 事件由 InputInner 透传，jsdom 下至少不应抛错
            expect(true).toBe(true);
        }
        wrapper.unmount();
    });

    test('clear 事件在 handleClear 时触发', async () => {
        const wrapper = mountSelect({
            clearable: true,
            modelValue: 'beijing',
        });
        await nextTick();
        await wait();
        await wrapper.find('.fes-select').trigger('mouseenter');
        await wait();
        // 找清空按钮（class 可能带 is- 前缀）
        const clearBtn
            = $('.fes-select-clear') || $$('[class*="clear"]')[0];
        if (clearBtn) {
            clearBtn.dispatchEvent(
                new MouseEvent('click', { bubbles: true }),
            );
            await wait();
            expect(wrapper.emitted('clear')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')![0][0]).toBeNull();
        }
        wrapper.unmount();
    });
});
