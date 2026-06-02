import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FButton from '../button';

describe('FButton circle prop (#733)', () => {
    it('circle prop not passed → fes-btn-circle class NOT present', () => {
        const wrapper = mount(FButton, {
            props: {},
            slots: { default: 'Button' },
        });
        expect(wrapper.classes()).not.toContain('fes-btn-circle');
    });

    it('circle true → fes-btn-circle class IS present', () => {
        const wrapper = mount(FButton, {
            props: { circle: true },
            slots: { default: 'Button' },
        });
        expect(wrapper.classes()).toContain('fes-btn-circle');
    });

    it('circle true with type=primary → both fes-btn-type-primary and fes-btn-circle present', () => {
        const wrapper = mount(FButton, {
            props: { circle: true, type: 'primary' },
            slots: { default: 'Button' },
        });
        expect(wrapper.classes()).toContain('fes-btn-type-primary');
        expect(wrapper.classes()).toContain('fes-btn-circle');
    });

    it('circle true with size=small → both fes-btn-small and fes-btn-circle present', () => {
        const wrapper = mount(FButton, {
            props: { circle: true, size: 'small' },
            slots: { default: 'Button' },
        });
        expect(wrapper.classes()).toContain('fes-btn-small');
        expect(wrapper.classes()).toContain('fes-btn-circle');
    });
});