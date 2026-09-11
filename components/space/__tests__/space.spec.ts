import { mount } from '@vue/test-utils';
import { createCommentVNode, h, nextTick } from 'vue';
import FSpace from '../space';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('space');

const _mount = (props = {}, items = 3) =>
    mount(FSpace, {
        props,
        slots: {
            default: () =>
                Array.from({ length: items }, (_, i) =>
                    h('span', { class: `space-item-${i}` }, `item-${i}`),
                ),
        },
    });

describe('FSpace', () => {
    test('默认渲染 flex 行布局，子元素各占一个 wrapper', async () => {
        const wrapper = _mount();
        await nextTick();
        const space = wrapper.find(`.${prefixCls}`);
        expect(space.exists()).toBe(true);
        const style = space.element.style;
        expect(style.display).toBe('flex');
        expect(style.flexDirection).toBe('row');
        // 默认 wrap: true
        expect(style.flexWrap).toBe('wrap');
        // 默认 align/justify
        expect(style.alignItems).toBe('start');
        expect(style.justifyContent).toBe('flex-start');
        // 默认 size 为 small，对应主题 paddingSmall: 12px
        expect(style.gap).toBe('12px 12px');
        // wrapItem 默认 true，每个子元素包裹一层 div
        const children = space.element.children;
        expect(children.length).toBe(3);
        expect(children[0].querySelector('.space-item-0')).toBeTruthy();
        expect(children[2].textContent).toBe('item-2');
    });

    test('size 为 number 时应用于 gap', async () => {
        const wrapper = _mount({ size: 20 });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).element.style.gap).toBe(
            '20px 20px',
        );
    });

    test('size 为数组时分别应用水平垂直间距', async () => {
        const wrapper = _mount({ size: [10, 24] });
        await nextTick();
        // gap: <row-gap(垂直)> <column-gap(水平)>
        expect(wrapper.find(`.${prefixCls}`).element.style.gap).toBe('24px 10px');
    });

    test('size 为字符串时按主题映射间距', async () => {
        const wrapper = _mount({ size: 'large' });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).element.style.gap).toBe(
            '24px 24px',
        );
    });

    test('vertical 时应用 column 布局且不换行', async () => {
        const wrapper = _mount({ vertical: true });
        await nextTick();
        const style = wrapper.find(`.${prefixCls}`).element.style;
        expect(style.flexDirection).toBe('column');
        expect(style.flexWrap).toBe('nowrap');
    });

    test('wrap 为 false 时不换行', async () => {
        const wrapper = _mount({ wrap: false });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).element.style.flexWrap).toBe(
            'nowrap',
        );
    });

    test('inline 时使用 inline-flex 展示', async () => {
        const wrapper = _mount({ inline: true });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).element.style.display).toBe(
            'inline-flex',
        );
    });

    test('alignment 通过 align 控制 alignItems', async () => {
        const wrapper = _mount({ align: 'center', justify: 'space-between' });
        await nextTick();
        const style = wrapper.find(`.${prefixCls}`).element.style;
        expect(style.alignItems).toBe('center');
        expect(style.justifyContent).toBe('space-between');
    });

    test('wrapItem 为 false 时不包裹子元素', async () => {
        const wrapper = _mount({ wrapItem: false });
        await nextTick();
        const space = wrapper.find(`.${prefixCls}`).element;
        // 子元素直接渲染，无包裹层
        expect(space.children.length).toBe(3);
        expect(space.children[0].classList.contains('space-item-0')).toBe(true);
    });

    test('itemStyle 应用到子元素包裹层', async () => {
        const wrapper = _mount({
            itemStyle: { padding: '10px' },
        });
        await nextTick();
        const first = wrapper.find(`.${prefixCls}`).element.children[0] as HTMLElement;
        expect(first.style.padding).toBe('10px');
        expect(first.style.maxWidth).toBe('100%');
    });

    test('过滤非元素节点（注释节点）', async () => {
        // slot 中混入注释节点（v-if 为 false 的产物），应被过滤
        const wrapper = mount(FSpace, {
            slots: {
                default: () => [
                    h('span', { class: 'space-a' }, 'a'),
                    createCommentVNode('v-if'),
                    h('span', { class: 'space-b' }, 'b'),
                ],
            },
        });
        await nextTick();
        expect(wrapper.find('.space-a').exists()).toBe(true);
        expect(wrapper.find('.space-b').exists()).toBe(true);
        // 注释节点被过滤，不产生包裹层
        const wrappers = wrapper.findAll(`.${prefixCls} > div`);
        expect(wrappers.length).toBe(2);
    });
});
