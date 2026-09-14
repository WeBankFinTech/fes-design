import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';
import getPrefixCls from '../../_util/getPrefixCls';
import Virtual from '../virtual';
import VirtualList from '../virtualList';

// jsdom 未内置 ResizeObserver，列表项尺寸测量依赖它
if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = ResizeObserver;
}

const scrollbarPrefixCls = getPrefixCls('scrollbar');

const genData = (count: number) =>
    Array.from({ length: count }, (_, index) => ({
        id: index,
        text: `item-${index}`,
    }));

const genIds = (count: number) => Array.from({ length: count }, (_, index) => index);

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(resolve));

const mountList = (count: number) => mount(VirtualList, {
    props: {
        dataKey: 'id',
        dataSources: genData(count),
        keeps: 30,
        estimateSize: 50,
    },
    slots: {
        default: ({ source, index }) =>
            h('div', { class: 'vl-item' }, `${index}:${source.text}`),
    },
});

const getRenderedIndexes = (wrapper: ReturnType<typeof mountList>) =>
    wrapper
        .findAll('.vl-item')
        .map((item) => Number(item.text().split(':')[0]));

describe('FVirtualList', () => {
    test('基础渲染 keeps 条数据，data 变化后随之更新', async () => {
        const wrapper = mountList(100);
        await nextTick();

        // 首屏渲染 keeps(30) 条
        expect(getRenderedIndexes(wrapper)).toHaveLength(30);
        expect(getRenderedIndexes(wrapper)[0]).toBe(0);
        expect(getRenderedIndexes(wrapper)[29]).toBe(29);

        // 数据少于 keeps 时全量渲染
        await wrapper.setProps({ dataSources: genData(5) });
        await nextTick();
        await flush();
        await nextTick();
        expect(getRenderedIndexes(wrapper)).toEqual([0, 1, 2, 3, 4]);

        // 数据恢复后回到 keeps 条渲染
        await wrapper.setProps({ dataSources: genData(100) });
        await nextTick();
        await flush();
        await nextTick();
        const indexes = getRenderedIndexes(wrapper);
        expect(indexes).toHaveLength(30);
        expect(indexes[0]).toBe(0);
        // expose 方法存在
        expect(typeof (wrapper.vm as any).scrollToBottom).toBe('function');
        expect(typeof (wrapper.vm as any).scrollToIndex).toBe('function');
        wrapper.unmount();
    });

    test('滚动后可见区间变化并触发 scroll / toTop', async () => {
        const wrapper = mountList(100);
        await nextTick();

        const container = wrapper.element.querySelector(
            `.${scrollbarPrefixCls}-container`,
        ) as HTMLElement;
        Object.defineProperty(container, 'scrollHeight', {
            value: 5000,
            configurable: true,
        });
        Object.defineProperty(container, 'clientHeight', {
            value: 100,
            configurable: true,
        });

        // 向下滚动：区间后移，仍渲染 keeps 条
        container.scrollTop = 1000;
        container.dispatchEvent(new Event('scroll'));
        await nextTick();
        await flush();
        await nextTick();
        const indexes = getRenderedIndexes(wrapper);
        expect(indexes).toHaveLength(30);
        expect(indexes[0]).toBe(20);
        expect(indexes[29]).toBe(49);
        expect(wrapper.emitted('scroll')).toBeTruthy();

        // 滚回顶部：区间回到 0 并触发 toTop，未触发 toBottom
        container.scrollTop = 0;
        container.dispatchEvent(new Event('scroll'));
        await nextTick();
        await flush();
        await nextTick();
        const topIndexes = getRenderedIndexes(wrapper);
        expect(topIndexes).toHaveLength(30);
        expect(topIndexes[0]).toBe(0);
        expect(wrapper.emitted('toTop')).toBeTruthy();
        expect(wrapper.emitted('toBottom')).toBeUndefined();
        wrapper.unmount();
    });
});

describe('Virtual 核心类', () => {
    const createVirtual = (
        uniqueIds: (string | number)[],
        params = {},
        ranges: any[] = [],
    ) => new Virtual({
        slotHeaderSize: 0,
        slotFooterSize: 0,
        keeps: 10,
        estimateSize: 50,
        buffer: 3,
        uniqueIds,
        ...params,
    }, (range) => ranges.push(range));

    test('初始 range 按 estimateSize 计算 padFront / padBehind', () => {
        const ranges: any[] = [];
        const virtual = createVirtual(genIds(100), {}, ranges);

        // 初始渲染 [0, keeps - 1]，前置填充 0，后置填充剩余估算高度
        expect(virtual.getRange()).toEqual({
            start: 0,
            end: 9,
            padFront: 0,
            padBehind: (100 - 10) * 50,
        });
        expect(ranges[0]).toEqual(virtual.getRange());
        // 初始方向与固定类型
        expect(virtual.isBehind()).toBe(false);
        expect(virtual.isFront()).toBe(false);
        expect(virtual.isFixedType()).toBe(false);
        expect(virtual.getLastIndex()).toBe(99);
    });

    test('数据量少于 keeps 时全量渲染', () => {
        const virtual = createVirtual(genIds(5), {});
        expect(virtual.getRange()).toEqual({
            start: 0,
            end: 4,
            padFront: 0,
            padBehind: 0,
        });
    });

    test('saveSize 记录尺寸，等高时判定为 fixed 类型', () => {
        const virtual = createVirtual(genIds(100));
        genIds(100).forEach((id) => virtual.saveSize(id, 50));

        expect(virtual.isFixedType()).toBe(true);
        expect(virtual.getTotalSize()).toBe(100 * 50);
        // 固定尺寸下 range 不变
        expect(virtual.getRange()).toEqual({
            start: 0,
            end: 9,
            padFront: 0,
            padBehind: (100 - 10) * 50,
        });
    });

    test('等高数据不一致时判定为 dynamic 类型', () => {
        const virtual = createVirtual(genIds(100));
        virtual.saveSize(0, 50);
        expect(virtual.isFixedType()).toBe(true);
        virtual.saveSize(1, 80);
        expect(virtual.isFixedType()).toBe(false);
        // dynamic 下估算尺寸取首区间实测均值 round((50 + 80) / 2)
        expect(virtual.getEstimateSize()).toBe(65);
    });

    test('getOffset 按 start 计算偏移', () => {
        const virtual = createVirtual(genIds(100));
        genIds(100).forEach((id) => virtual.saveSize(id, 50));

        expect(virtual.getOffset(0)).toBe(0);
        expect(virtual.getOffset(1)).toBe(50);
        expect(virtual.getOffset(3)).toBe(150);

        // slotHeaderSize 计入偏移
        virtual.updateParam('slotHeaderSize', 20);
        expect(virtual.getOffset(3)).toBe(170);
    });

    test('handleScroll 向下滚动更新 range（经 rAF 异步生效）', async () => {
        const ranges: any[] = [];
        const virtual = createVirtual(genIds(100), {}, ranges);
        genIds(100).forEach((id) => virtual.saveSize(id, 50));

        virtual.handleScroll(1000);
        // direction 同步更新，range 在下一帧更新
        expect(virtual.isBehind()).toBe(true);
        await nextFrame();
        await nextTick();
        expect(virtual.getRange()).toEqual({
            start: 20,
            end: 29,
            padFront: 20 * 50,
            padBehind: (99 - 29) * 50,
        });
        expect(ranges[ranges.length - 1]).toEqual(virtual.getRange());
    });

    test('handleScroll 向上滚动按 buffer 回退 range', async () => {
        const virtual = createVirtual(genIds(100));
        genIds(100).forEach((id) => virtual.saveSize(id, 50));

        virtual.handleScroll(1000);
        await nextFrame();
        expect(virtual.getRange().start).toBe(20);

        virtual.handleScroll(500);
        expect(virtual.isFront()).toBe(true);
        await nextFrame();
        await nextTick();
        // overs = 10，未超过当前 start(20)，start 回退 overs - buffer
        expect(virtual.getRange()).toEqual({
            start: 7,
            end: 16,
            padFront: 7 * 50,
            padBehind: (99 - 16) * 50,
        });
    });

    test('updateParam 更新参数后 handleDataSourcesChange 重算 range', async () => {
        const virtual = createVirtual(genIds(100));
        genIds(100).forEach((id) => virtual.saveSize(id, 50));

        virtual.handleScroll(1000);
        await nextFrame();
        expect(virtual.getRange().start).toBe(20);

        // keeps 增大后数据源变化通知：start 保持，end 按 keeps 延伸
        virtual.updateParam('keeps', 20);
        virtual.handleDataSourcesChange();
        expect(virtual.getRange().start).toBe(20);
        expect(virtual.getRange().end).toBe(39);

        // slot 尺寸变化同样触发 range 重算
        virtual.handleSlotSizeChange();
        expect(virtual.getRange().start).toBe(20);
        expect(virtual.getRange().end).toBe(39);
    });

    test('destroy 重置内部状态', () => {
        const virtual = createVirtual(genIds(100));
        genIds(100).forEach((id) => virtual.saveSize(id, 50));
        expect(virtual.isFixedType()).toBe(true);

        virtual.destroy();
        expect(virtual.isFixedType()).toBe(false);
        expect(virtual.getRange().start).toBeUndefined();
        expect(virtual.getTotalSize()).toBe(0);
    });
});
