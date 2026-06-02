import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import FSteps from '../steps';
import FStep from '../step';

describe('Step issue #882 - empty title/description', () => {
    const mountComponent = (props = {}, stepSlots = {}) => {
        return mount(FSteps, {
            slots: {
                default: () => [
                    h(FStep, { ...props, ...stepSlots }),
                ],
            },
        });
    };

    it('should NOT render .fes-step-title when title is empty string', () => {
        const wrapper = mountComponent({ title: '' });
        const titleEl = wrapper.findAll('.fes-step-title');
        expect(titleEl.length).toBe(0);
    });

    it('should NOT render .fes-step-title when title is undefined', () => {
        const wrapper = mountComponent({});
        const titleEl = wrapper.findAll('.fes-step-title');
        expect(titleEl.length).toBe(0);
    });

    it('should render .fes-step-title with correct text when title is provided', () => {
        const wrapper = mountComponent({ title: 'Step 1' });
        const titleEl = wrapper.find('.fes-step-title');
        expect(titleEl.exists()).toBe(true);
        expect(titleEl.text()).toBe('Step 1');
    });

    it('should NOT render .fes-step-title or .fes-step-description when both are empty', () => {
        const wrapper = mountComponent({ title: '', description: '' });
        const titleEl = wrapper.findAll('.fes-step-title');
        const descEl = wrapper.findAll('.fes-step-description');
        expect(titleEl.length).toBe(0);
        expect(descEl.length).toBe(0);
    });
});