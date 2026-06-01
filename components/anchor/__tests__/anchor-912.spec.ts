import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { FAnchor } from '../index';

describe('Anchor component', () => {
    it('should export FAnchor from components/anchor', () => {
        expect(FAnchor).toBeDefined();
        expect(typeof FAnchor).toBe('object');
    });

    it('should render anchor elements when links prop is provided', () => {
        const links = [
            { title: 'Link 1', href: '#link1' },
            { title: 'Link 2', href: '#link2' },
        ];
        const wrapper = mount(FAnchor, {
            props: { links },
        });
        const anchorElements = wrapper.findAll('a');
        expect(anchorElements.length).toBeGreaterThan(0);
    });
});