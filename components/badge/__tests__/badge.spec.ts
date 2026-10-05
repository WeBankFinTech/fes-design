import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FBadge from '../badge';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('badge');

describe('FBadge', () => {
    test('FBadge value string', async () => {
        const wrapper = mount(FBadge, {
            props: {
                value: 'new',
            },
        });
        await nextTick();
        const sup = wrapper.find(`.${prefixCls}-sup`);
        expect(sup.exists()).toBe(true);
        expect(sup.text()).toBe('new');
        expect(sup.classes()).toContain(`${prefixCls}-sup-type-danger`);
        expect(sup.classes()).toContain(`${prefixCls}-sup-alone`);
    });

    test('FBadge value number with max', async () => {
        const wrapper = mount(FBadge, {
            props: {
                value: 100,
                max: 99,
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-sup`).text()).toBe('99+');
    });

    test('FBadge value 0 hidden without showZero', async () => {
        const wrapper = mount(FBadge, {
            props: {
                value: 0,
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-sup`).exists()).toBe(false);
        await wrapper.setProps({ showZero: true });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-sup`).text()).toBe('0');
    });

    test('FBadge dot', async () => {
        const wrapper = mount(FBadge, {
            props: {
                dot: true,
            },
        });
        await nextTick();
        const sup = wrapper.find(`.${prefixCls}-sup`);
        expect(sup.classes()).toContain(`${prefixCls}-sup-dot`);
        expect(sup.text()).toBe('');
    });

    test('FBadge hidden', async () => {
        const wrapper = mount(FBadge, {
            props: {
                value: 'new',
                hidden: true,
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-sup`).exists()).toBe(false);
    });

    test('FBadge type and size', async () => {
        const wrapper = mount(FBadge, {
            props: {
                value: 'new',
                type: 'primary',
                size: 'small',
            },
        });
        await nextTick();
        const sup = wrapper.find(`.${prefixCls}-sup`);
        expect(sup.classes()).toContain(`${prefixCls}-sup-type-primary`);
        expect(sup.classes()).toContain(`${prefixCls}-sup-size-small`);
    });

    test('FBadge backgroundColor', async () => {
        const wrapper = mount(FBadge, {
            props: {
                value: 'new',
                backgroundColor: '#52c41a',
            },
        });
        await nextTick();
        expect(
            wrapper.find(`.${prefixCls}-sup`).attributes('style'),
        ).toContain('background-color: rgb(82, 196, 26)');
    });

    test('FBadge default slot', async () => {
        const wrapper = mount(FBadge, {
            props: {
                value: 'new',
            },
            slots: {
                default: () => h('button', 'button'),
            },
        });
        await nextTick();
        expect(wrapper.find('button').text()).toBe('button');
        expect(
            wrapper.find(`.${prefixCls}-sup`).classes(),
        ).not.toContain(`${prefixCls}-sup-alone`);
    });

    test('FBadge content slot', async () => {
        const wrapper = mount(FBadge, {
            slots: {
                content: () => h('span', 'custom'),
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-sup`).text()).toBe('custom');
    });
});
