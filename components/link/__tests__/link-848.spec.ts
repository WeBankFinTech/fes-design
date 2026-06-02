import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import FLink from '../link';

describe('FLink loading', () => {
    it('no loading prop → no fes-link--loading class, no spinner', () => {
        const wrapper = mount(FLink, {
            slots: { default: 'Link' },
        });
        expect(wrapper.classes()).not.toContain('fes-link--loading');
        expect(wrapper.find('.fes-link-loading-icon').exists()).toBe(false);
    });

    it('loading=true → fes-link--loading class present, spinner element present', () => {
        const wrapper = mount(FLink, {
            props: { loading: true },
            slots: { default: 'Link' },
        });
        expect(wrapper.classes()).toContain('fes-link--loading');
        expect(wrapper.find('.fes-link-loading-icon').exists()).toBe(true);
    });

    it('loading=true + click → onClick NOT called', () => {
        const onClick = vi.fn();
        const wrapper = mount(FLink, {
            props: { loading: true },
            slots: { default: 'Link' },
            listeners: { click: onClick },
        });
        wrapper.trigger('click');
        expect(onClick).not.toHaveBeenCalled();
    });

    it('loading=true + disabled=true → still shows spinner, no click', () => {
        const onClick = vi.fn();
        const wrapper = mount(FLink, {
            props: { loading: true, disabled: true },
            slots: { default: 'Link' },
            listeners: { click: onClick },
        });
        expect(wrapper.find('.fes-link-loading-icon').exists()).toBe(true);
        expect(wrapper.classes()).toContain('fes-link--loading');
        wrapper.trigger('click');
        expect(onClick).not.toHaveBeenCalled();
    });
});