import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { FGrid, FGridItem } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('grid');
const itemPrefixCls = getPrefixCls('grid-item');

const mountGrid = (props = {}, itemProps = {}) =>
    mount(FGrid, {
        props,
        slots: {
            default: () => [h(FGridItem, { ...itemProps, class: 'grid-item-target' })],
        },
    });

describe('Grid', () => {
    test('grid default render', () => {
        const wrapper = mountGrid();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.find(`.${itemPrefixCls}`).exists()).toBe(true);
    });

    test('grid gutter number applies negative margins and item paddings', async () => {
        const gutter = 20;
        const wrapper = mountGrid({ gutter });
        const gridStyle = wrapper.find(`.${prefixCls}`).attributes('style');
        expect(gridStyle).toContain(`margin-left: -${gutter / 2}px;`);
        expect(gridStyle).toContain(`margin-right: -${gutter / 2}px;`);
        const itemStyle = wrapper.find('.grid-item-target').attributes('style');
        expect(itemStyle).toContain(`padding-left: ${gutter / 2}px;`);
        expect(itemStyle).toContain(`padding-right: ${gutter / 2}px;`);

        // gutter 数组第二位控制 row-gap
        await wrapper.setProps({ gutter: [gutter, 10] });
        expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain(
            'row-gap: 10px;',
        );
    });

    test.each(['flex-start', 'center', 'flex-end', 'baseline', 'stretch'])(
        'grid align %s',
        (align) => {
            const wrapper = mountGrid({ align });
            expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain(
                `align-items: ${align};`,
            );
        },
    );

    test.each([
        'flex-start',
        'flex-end',
        'center',
        'space-around',
        'space-between',
    ])('grid justify %s', (justify) => {
        const wrapper = mountGrid({ justify });
        expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain(
            `justify-content: ${justify};`,
        );
    });

    test('grid wrap', () => {
        const wrapper = mountGrid({ wrap: true });
        expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain(
            'flex-wrap: wrap;',
        );
    });

    test('item span', () => {
        const wrapper = mountGrid({}, { span: 6 });
        expect(wrapper.find(`.${itemPrefixCls}-6`).exists()).toBe(true);
    });

    test('item offset', () => {
        const wrapper = mountGrid({}, { offset: 2 });
        expect(wrapper.find(`.${itemPrefixCls}-offset-2`).exists()).toBe(true);
    });

    test('item pull / push', () => {
        const wrapper = mountGrid({}, { pull: 3, push: 4 });
        expect(wrapper.find(`.${itemPrefixCls}-pull-3`).exists()).toBe(true);
        expect(wrapper.find(`.${itemPrefixCls}-push-4`).exists()).toBe(true);
    });

    test('item order', () => {
        const wrapper = mountGrid({}, { order: 2 });
        expect(wrapper.find(`.${itemPrefixCls}`).attributes('style')).toContain(
            'order: 2;',
        );
    });

    test('item flex', () => {
        const wrapper = mountGrid({}, { flex: '0 0 100px' });
        expect(wrapper.find(`.${itemPrefixCls}`).attributes('style')).toContain(
            'flex: 0 0 100px;',
        );
    });

    test.each(['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'])(
        'item responsive breakpoint %s with number span',
        (size) => {
            const wrapper = mountGrid({}, { [size]: 8 });
            expect(wrapper.find(`.${itemPrefixCls}-${size}-8`).exists()).toBe(
                true,
            );
        },
    );

    test('item responsive breakpoint with object props', () => {
        const wrapper = mountGrid(
            {},
            {
                md: { span: 6, offset: 2, push: 1, pull: 1 },
            },
        );
        expect(wrapper.find(`.${itemPrefixCls}-md-6`).exists()).toBe(true);
        expect(wrapper.find(`.${itemPrefixCls}-md-offset-2`).exists()).toBe(
            true,
        );
        expect(wrapper.find(`.${itemPrefixCls}-md-push-1`).exists()).toBe(true);
        expect(wrapper.find(`.${itemPrefixCls}-md-pull-1`).exists()).toBe(true);
    });
});
