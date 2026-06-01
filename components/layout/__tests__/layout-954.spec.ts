import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import FLayout from '../layout.vue';
import { layoutProps } from '../const';

describe('layout.vue disabled prop', () => {
    const layoutVuePath = resolve(__dirname, '../layout.vue');
    const constTsPath = resolve(__dirname, '../const.ts');

    it('should have v-if="!disabled" and <slot v-else /> in template', () => {
        const content = readFileSync(layoutVuePath, 'utf-8');
        expect(content).toContain('v-if="!disabled"');
        expect(content).toContain('<slot v-else />');
    });

    it('should have disabled prop in const.ts', () => {
        const content = readFileSync(constTsPath, 'utf-8');
        expect(content).toContain('disabled');
        expect(layoutProps).toHaveProperty('disabled');
        expect(layoutProps.disabled.type).toBe(Boolean);
        expect(layoutProps.disabled.default).toBe(false);
    });

    it('should NOT render section wrapper when disabled=true', () => {
        const wrapper = mount(FLayout, {
            props: {
                disabled: true,
            },
            slots: {
                default: () => '<div class="slot-content">Slot Content</div>',
            },
        });
        const section = wrapper.find('section.fes-layout');
        expect(section.exists()).toBe(false);
        const slotContent = wrapper.find('.slot-content');
        expect(slotContent.exists()).toBe(true);
        expect(slotContent.text()).toBe('Slot Content');
    });

    it('should render section wrapper when disabled is not set', () => {
        const wrapper = mount(FLayout, {
            slots: {
                default: () => '<div class="slot-content">Slot Content</div>',
            },
        });
        const section = wrapper.find('section.fes-layout');
        expect(section.exists()).toBe(true);
    });
});