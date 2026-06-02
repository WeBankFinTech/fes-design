import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FTooltip from '../tooltip';

describe('FTooltip showDelay/hideDelay', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('showDelay delays the tooltip appearance', async () => {
        const wrapper = mount(FTooltip, {
            props: { modelValue: false, showDelay: 300 },
            slots: { default: '<button>trigger</button>' },
        });

        const trigger = wrapper.find('button');
        trigger.trigger('mouseenter');

        vi.advanceTimersByTime(100);
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        vi.advanceTimersByTime(200);
        await wrapper.vm.$nextTick();

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeDefined();
        expect(emitted![0]).toEqual([true]);
    });

    it('hideDelay delays the tooltip disappearance', async () => {
        const wrapper = mount(FTooltip, {
            props: { modelValue: true, hideDelay: 200 },
            slots: { default: '<button>trigger</button>' },
        });

        const trigger = wrapper.find('button');
        trigger.trigger('mouseleave');

        vi.advanceTimersByTime(100);
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        vi.advanceTimersByTime(200);
        await wrapper.vm.$nextTick();

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeDefined();
        expect(emitted![0]).toEqual([false]);
    });
});