import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FCard from '../card.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('card');

describe('FCard', () => {
    test('FCard default render', async () => {
        const wrapper = mount(FCard, {
            slots: {
                default: () => '卡片内容',
            },
        });
        await nextTick();
        expect(wrapper.classes()).toContain(prefixCls);
        // 默认 size middle / shadow always / bordered
        expect(wrapper.classes()).toContain(`${prefixCls}-size--middle`);
        expect(wrapper.classes()).toContain(`${prefixCls}-shadow--always`);
        expect(wrapper.classes()).toContain('is-bordered');
        // 默认无 header/footer
        expect(wrapper.find(`.${prefixCls}__header`).exists()).toBe(false);
        expect(wrapper.find(`.${prefixCls}__footer`).exists()).toBe(false);
        // body 渲染默认插槽内容
        expect(wrapper.find(`.${prefixCls}__body`).text()).toBe('卡片内容');
    });

    test('FCard header prop and slot', async () => {
        const wrapper = mount(FCard, {
            props: {
                header: '卡片标题',
            },
        });
        await nextTick();
        const header = wrapper.find(`.${prefixCls}__header`);
        expect(header.exists()).toBe(true);
        expect(header.text()).toBe('卡片标题');
        // slot 优先于 header prop
        const wrapper2 = mount(FCard, {
            props: {
                header: '卡片标题',
            },
            slots: {
                header: () => '插槽标题',
            },
        });
        await nextTick();
        expect(wrapper2.find(`.${prefixCls}__header`).text()).toBe('插槽标题');
    });

    test('FCard footer slot', async () => {
        const wrapper = mount(FCard, {
            slots: {
                default: () => '卡片内容',
                footer: () => '底部操作',
            },
        });
        await nextTick();
        const footer = wrapper.find(`.${prefixCls}__footer`);
        expect(footer.exists()).toBe(true);
        expect(footer.text()).toBe('底部操作');
    });

    test('FCard divider', async () => {
        const wrapper = mount(FCard, {
            props: {
                header: '卡片标题',
                divider: false,
            },
            slots: {
                footer: () => '底部操作',
            },
        });
        await nextTick();
        // divider=false 时 header/footer 不带分隔线
        expect(
            wrapper.find(`.${prefixCls}__header`).classes('no-divider'),
        ).toBe(true);
        expect(
            wrapper.find(`.${prefixCls}__footer`).classes('no-divider'),
        ).toBe(true);
        // divider 默认 true（无 no-divider）
        const wrapper2 = mount(FCard, {
            props: {
                header: '卡片标题',
            },
        });
        await nextTick();
        expect(
            wrapper2.find(`.${prefixCls}__header`).classes('no-divider'),
        ).toBe(false);
    });

    test('FCard size and shadow', async () => {
        const wrapper = mount(FCard, {
            props: {
                size: 'small',
                shadow: 'hover',
            },
        });
        await nextTick();
        expect(wrapper.classes()).toContain(`${prefixCls}-size--small`);
        expect(wrapper.classes()).toContain(`${prefixCls}-shadow--hover`);
    });

    test('FCard bordered false', async () => {
        const wrapper = mount(FCard, {
            props: {
                bordered: false,
            },
        });
        await nextTick();
        expect(wrapper.classes()).not.toContain('is-bordered');
    });

    test('FCard bodyStyle', async () => {
        const wrapper = mount(FCard, {
            props: {
                bodyStyle: { color: 'red' },
            },
            slots: {
                default: () => '卡片内容',
            },
        });
        await nextTick();
        expect(
            wrapper.find(`.${prefixCls}__body`).attributes('style'),
        ).toContain('color: red');
    });
});
