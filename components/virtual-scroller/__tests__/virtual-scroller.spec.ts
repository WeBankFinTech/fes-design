import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';
import getPrefixCls from '../../_util/getPrefixCls';
import VirtualScroller from '../virtual-scroller';

// jsdom 未内置 ResizeObserver，virtua 内部通过 window.ResizeObserver 测量尺寸
if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = ResizeObserver;
}

const scrollbarPrefixCls = getPrefixCls('scrollbar');

const genData = (count: number) =>
    Array.from({ length: count }, (_, index) => ({
        id: index,
        text: `item-${index}`,
    }));

const flush = (ms = 30) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const mountScroller = (dataSourceCount: number, extraProps = {}) => mount(VirtualScroller, {
    props: {
        dataSources: genData(dataSourceCount),
        itemSize: 20,
        keeps: 30,
        ...extraProps,
    },
    slots: {
        default: ({ source, index }) =>
            h('div', { class: 'vs-item' }, `${index}:${source.text}`),
    },
});

const getScrollContainer = (wrapper: ReturnType<typeof mountScroller>) =>
    wrapper.element.querySelector(
        `.${scrollbarPrefixCls}-container`,
    ) as HTMLElement;

const getRenderedIndexes = (wrapper: ReturnType<typeof mountScroller>) =>
    wrapper
        .findAll('.vs-item')
        .map((item) => Number(item.text().split(':')[0]));

describe('FVirtualScroller', () => {
    test('基础渲染：渲染可见区间项且与数据一一对应', async () => {
        const _dataSources = genData(100);
        const wrapper = mountScroller(100, { wrapClass: 'vs-wrap-class' });
        await nextTick();

        // jsdom 中视口高度为 0，首屏渲染区间为 [0, overscan]，keeps 30 时 overscan 为 10
        const indexes = getRenderedIndexes(wrapper);
        expect(indexes).toHaveLength(11);
        expect(indexes[0]).toBe(0);
        expect(indexes[indexes.length - 1]).toBe(10);
        // 渲染项与数据一一对应
        indexes.forEach((index) => {
            expect(
                wrapper.findAll('.vs-item')[index].text(),
            ).toBe(`${index}:item-${index}`);
        });
        // wrapClass 应用在虚拟滚动容器上
        expect(wrapper.find('.vs-wrap-class').exists()).toBe(true);
        wrapper.unmount();
    });

    test('滚动后可见区间变化', async () => {
        const wrapper = mountScroller(100);
        await nextTick();

        const container = getScrollContainer(wrapper);
        // scrollTop 1000 / itemSize 20，起始项为第 50 项，向后多渲染 10 项
        container.scrollTop = 1000;
        container.dispatchEvent(new Event('scroll'));
        await nextTick();
        await flush();
        await nextTick();
        expect(getRenderedIndexes(wrapper)).toEqual([
            50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        ]);

        // 继续向下滚动，起始项 = scrollTop / itemSize，再向后多渲染 10 项
        container.scrollTop = 1500;
        container.dispatchEvent(new Event('scroll'));
        await nextTick();
        await flush();
        await nextTick();
        expect(getRenderedIndexes(wrapper)).toEqual([
            75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
        ]);

        // scrollTop 超出数据总量时，起始项收敛并截断到最后一项
        container.scrollTop = 2000;
        container.dispatchEvent(new Event('scroll'));
        await nextTick();
        await flush();
        await nextTick();
        expect(getRenderedIndexes(wrapper)).toEqual([99]);
        wrapper.unmount();
    });

    test('数据条数少于 keeps 时全量渲染，数据变化后区间随之更新', async () => {
        const wrapper = mountScroller(5);
        await nextTick();
        await flush();
        await nextTick();
        // 5 条数据全部渲染
        expect(getRenderedIndexes(wrapper)).toEqual([0, 1, 2, 3, 4]);

        // 数据增长超过 keeps，恢复虚拟区间渲染
        await wrapper.setProps({ dataSources: genData(40) });
        await nextTick();
        await flush();
        await nextTick();
        const indexes = getRenderedIndexes(wrapper);
        expect(indexes).toHaveLength(11);
        expect(indexes[0]).toBe(0);
        expect(indexes[indexes.length - 1]).toBe(10);

        // 数据缩回 5 条，重新全量渲染
        await wrapper.setProps({ dataSources: genData(5) });
        await nextTick();
        await flush();
        await nextTick();
        expect(getRenderedIndexes(wrapper)).toEqual([0, 1, 2, 3, 4]);
        wrapper.unmount();
    });

    test('滚动触发 scroll 事件及 toBottom / toTop', async () => {
        const wrapper = mountScroller(100);
        await nextTick();

        const container = getScrollContainer(wrapper);
        // jsdom 中 scrollHeight / clientHeight 均为 0，向下滚动即满足 toBottom 条件
        container.scrollTop = 1000;
        container.dispatchEvent(new Event('scroll'));
        await nextTick();
        expect(wrapper.emitted('scroll')).toBeTruthy();
        expect(wrapper.emitted('toBottom')).toBeTruthy();

        // 向上滚动回到顶部触发 toTop
        container.scrollTop = 0;
        container.dispatchEvent(new Event('scroll'));
        await nextTick();
        expect(wrapper.emitted('toTop')).toBeTruthy();
        wrapper.unmount();
    });

    test('expose 的尺寸/偏移方法基于 itemSize 计算', async () => {
        const wrapper = mountScroller(100);
        await nextTick();

        expect(wrapper.vm.getItemSize(0)).toBe(20);
        expect(wrapper.vm.getItemOffset(3)).toBe(60);
        expect(wrapper.vm.getOffset()).toBe(0);
        expect(typeof wrapper.vm.scrollToIndex).toBe('function');
        expect(typeof wrapper.vm.scrollToBottom).toBe('function');
        wrapper.unmount();
    });

    test('wrapTag / itemTag / renderItemList 自定义渲染结构', async () => {
        const wrapper = mount(VirtualScroller, {
            props: {
                dataSources: genData(100),
                itemSize: 20,
                keeps: 30,
                wrapTag: 'ul',
                itemTag: 'li',
                wrapClass: 'vs-ul-wrap',
                renderItemList: (itemVNodes) =>
                    h('section', { class: 'vs-custom-list' }, [
                        h('p', { class: 'vs-custom-head' }, 'header'),
                        itemVNodes,
                    ]),
            },
            slots: {
                default: ({ source, index }) =>
                    h('div', { class: 'vs-item' }, `${index}:${source.text}`),
            },
        });
        await nextTick();

        // wrapTag / itemTag 生效：每项被 itemTag 包裹，slot 内容在其内部
        expect(wrapper.find('ul.vs-ul-wrap').exists()).toBe(true);
        // renderItemList 包裹了虚拟滚动节点
        expect(wrapper.find('.vs-custom-list').exists()).toBe(true);
        expect(wrapper.find('.vs-custom-head').text()).toBe('header');
        expect(wrapper.findAll('.vs-custom-list li')).toHaveLength(11);
        expect(wrapper.findAll('.vs-custom-list li .vs-item')).toHaveLength(
            11,
        );
        wrapper.unmount();
    });
});
