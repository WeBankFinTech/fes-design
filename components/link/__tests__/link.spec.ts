import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FLink from '../link';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('link');

describe('FLink', () => {
    test('FLink default render', async () => {
        const wrapper = mount(FLink, {
            slots: {
                default: () => h('span', '链接'),
            },
        });
        await nextTick();
        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.classes()).toContain(prefixCls);
        expect(wrapper.classes()).toContain(`${prefixCls}-type-default`);
        expect(wrapper.classes()).toContain(`${prefixCls}-size-middle`);
        expect(wrapper.classes()).not.toContain('is-disabled');
        expect(wrapper.classes()).not.toContain('is-underline');
        expect(wrapper.find('div').text()).toBe('链接');
    });

    test('FLink type and size', async () => {
        const wrapper = mount(FLink, {
            props: {
                type: 'primary',
                size: 'small',
            },
            slots: {
                default: '链接',
            },
        });
        await nextTick();
        expect(wrapper.classes()).toContain(`${prefixCls}-type-primary`);
        expect(wrapper.classes()).toContain(`${prefixCls}-size-small`);
    });

    test('FLink underline and disabled', async () => {
        const wrapper = mount(FLink, {
            props: {
                underline: true,
                disabled: true,
            },
        });
        await nextTick();
        expect(wrapper.classes()).toContain('is-underline');
        expect(wrapper.classes()).toContain('is-disabled');
    });

    test('FLink href and target', async () => {
        const wrapper = mount(FLink, {
            props: {
                href: 'https://fesjs.mumblefe.cn/',
                target: '_blank',
            },
            slots: {
                default: '链接',
            },
        });
        await nextTick();
        expect(wrapper.attributes('href')).toBe('https://fesjs.mumblefe.cn/');
        expect(wrapper.attributes('target')).toBe('_blank');
    });

    test('FLink click emit', async () => {
        const wrapper = mount(FLink, {
            slots: {
                default: '链接',
            },
        });
        await nextTick();
        await wrapper.trigger('click');
        expect(wrapper.emitted('click')).toHaveLength(1);
    });

    test('FLink disabled not emit click', async () => {
        const wrapper = mount(FLink, {
            props: {
                disabled: true,
            },
            slots: {
                default: '链接',
            },
        });
        await nextTick();
        await wrapper.trigger('click');
        expect(wrapper.emitted('click')).toBeUndefined();
    });

    test('FLink icon slot', async () => {
        const wrapper = mount(FLink, {
            slots: {
                icon: () => h('i', 'icon'),
                default: () => h('span', '链接'),
            },
        });
        await nextTick();
        expect(wrapper.find('.icon i').text()).toBe('icon');
    });
});
