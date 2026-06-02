import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { FAnchor } from '../index';

describe('Anchor component', () => {
    const links = [
        { title: 'Link 1', href: '#link1' },
        { title: 'Link 2', href: '#link2' },
    ];

    it('renders link titles from the links prop', () => {
        const wrapper = mount(FAnchor, { props: { links } });
        const text = wrapper.text();
        expect(text).toContain('Link 1');
        expect(text).toContain('Link 2');
    });

    it('emits click with the link href when a link is clicked', async () => {
        const wrapper = mount(FAnchor, { props: { links } });
        await wrapper.find('a').trigger('click');
        const emitted = wrapper.emitted('click');
        expect(emitted).toBeTruthy();
        expect(emitted?.[0][1]).toBe('#link1');
    });

    it('renders default slot content when provided', () => {
        const wrapper = mount(FAnchor, {
            props: { links },
            slots: { default: () => 'slot-anchor-content' },
        });
        expect(wrapper.text()).toContain('slot-anchor-content');
    });
});
