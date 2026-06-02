import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FButton from '../button';

describe('FButton smoke', () => {
    it('mounts successfully', () => {
        const wrapper = mount(FButton, {
            slots: { default: 'Click me' },
        });
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.text()).toContain('Click me');
    });
});
