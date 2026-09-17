import { mount } from '@vue/test-utils';
import { ResizeObserver } from '@juggle/resize-observer';
import { h, nextTick } from 'vue';
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

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const mountScroller = (
    dataSourceCount: number,
    extraProps: Record<string, unknown> = {},
) =>
    mount(VirtualScroller, {
        props: {
            dataSources: genData(dataSourceCount),
            itemSize: 20,
            keeps: 30,
            ...extraProps,
        },
        slots: {
            default: ({ source, index }: any) =>
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

// jsdom 中滚动容器无布局，scrollHeight/clientHeight 等均为 0，
// 用可写属性 stub 模拟真实滚动尺寸（对实例自身生效，不污染原型）
const stubScrollMetrics = (
    el: HTMLElement,
    metrics: { scroll?: number; client?: number },
    horizontal: boolean,
) => {
    if (metrics.scroll != null) {
        Object.defineProperty(el, horizontal ? 'scrollWidth' : 'scrollHeight', {
            value: metrics.scroll,
            configurable: true,
            writable: true,
        });
    }
    if (metrics.client != null) {
        Object.defineProperty(el, horizontal ? 'clientWidth' : 'clientHeight', {
            value: metrics.client,
            configurable: true,
            writable: true,
        });
    }
};

describe('FVirtualScroller 水平方向（L84/L93/L99 horizontal 槽位）', () => {
    test('horizontal：getOffset/getScrollSize/getClientSize 读 scrollLeft/Width 系', async () => {
        const wrapper = mountScroller(100, { direction: 'horizontal' });
        await nextTick();
        await flush();
        await nextTick();

        const container = getScrollContainer(wrapper);
        stubScrollMetrics(
            container,
            { scroll: 2000, client: 500 },
            true,
        );

        // 未滚动时 offset 为 0
        expect(wrapper.vm.getOffset()).toBe(0);

        // 滚动后 offset 读自 scrollLeft（垂直方向读 scrollTop，jsdom 下无法区分）
        (container as any).scrollLeft = 600;
        container.dispatchEvent(new Event('scroll'));
        await nextTick();
        expect(wrapper.vm.getOffset()).toBe(600);
        expect(wrapper.vm.getScrollSize()).toBe(2000);
        expect(wrapper.vm.getClientSize()).toBe(500);

        // 水平滚动同样驱动窗口移动：600/20 = 第 30 项起始
        await flush();
        await nextTick();
        const indexes = getRenderedIndexes(wrapper);
        expect(indexes[0]).toBe(30);
        expect(indexes[indexes.length - 1]).toBe(40);
        wrapper.unmount();
    });

    test('horizontal 滚动至最右触发 toBottom', async () => {
        const wrapper = mountScroller(100, { direction: 'horizontal' });
        await nextTick();

        const container = getScrollContainer(wrapper);
        stubScrollMetrics(container, { scroll: 2000, client: 500 }, true);

        // 向右滚到底：1500 + 500 >= 2000 - 0 → toBottom
        // 注：方向检测（isScrollUp）固定读 scrollTop，横向滚动不触发 toTop，
        // toTop 分支由垂直方向用例覆盖
        (container as any).scrollLeft = 1500;
        container.dispatchEvent(new Event('scroll'));
        await nextTick();
        expect(wrapper.emitted('toBottom')).toBeTruthy();
        expect(wrapper.emitted('toBottom')).toHaveLength(1);
        wrapper.unmount();
    });
});

describe('FVirtualScroller root 空值降级（L89/L95/L101/L107）', () => {
    test('unmount 后暴露的取值方法安全返回 0，scrollToBottom 静默无操作', async () => {
        const wrapper = mountScroller(50);
        await nextTick();
        await flush();

        // 卸载后 scrollContainerRef 复位为 null（组件卸载 ref 解绑）
        wrapper.unmount();
        expect(wrapper.vm.getOffset()).toBe(0);
        expect(wrapper.vm.getScrollSize()).toBe(0);
        expect(wrapper.vm.getClientSize()).toBe(0);
        // L107 if(root) else：root 为 null 直接返回，不调用 virtualRef.scrollTo
        expect(() => wrapper.vm.scrollToBottom()).not.toThrow();
    });
});

describe('FVirtualScroller scrollToBottom 重试链（L113）', () => {
    test('首屏未到底 → 10ms 后复查，已到底则停止递归', async () => {
        const wrapper = mountScroller(100);
        await nextTick();
        await flush();
        await nextTick();

        const container = getScrollContainer(wrapper);
        let scroll = 800; // 初始内容高度
        Object.defineProperty(container, 'scrollHeight', {
            get: () => scroll,
            configurable: true,
        });
        Object.defineProperty(container, 'clientHeight', {
            value: 400,
            configurable: true,
        });
        // scrollTo 落点即 scrollTop（virtua 直接赋值），初始 offset 0：
        // 0 + 400 < 800 → 触发重试
        wrapper.vm.scrollToBottom();

        // 重试间隙虚拟列表完成渲染、内容高度增长
        await flush(25);
        scroll = 1200;
        (container as any).scrollTop = 800; // 模拟已滚动到底
        await flush(25);

        // 800 + 400 >= 1200 → 条件不成立，递归终止（否则会无限 setTimeout）
        await flush(60);
        expect((container as any).scrollTop).toBe(800);
        wrapper.unmount();
    });

    test('滚动被浏览器吞掉（scrollTop 读取不变）→ 重试后仍可收敛', async () => {
        const wrapper = mountScroller(100);
        await nextTick();
        await flush();
        await nextTick();

        const container = getScrollContainer(wrapper);
        // 模拟滚动尚未生效（smooth scroll 进行中）：写入被暂存，读取恒 0
        let staged = 0;
        Object.defineProperty(container, 'scrollTop', {
            get: () => 0,
            set: (v) => {
                staged = v;
            },
            configurable: true,
        });
        Object.defineProperty(container, 'clientHeight', {
            value: 400,
            configurable: true,
        });
        Object.defineProperty(container, 'scrollHeight', {
            value: 2000,
            configurable: true,
        });

        wrapper.vm.scrollToBottom();
        // 第一次检查：0 + 400 < 2000 → 命中重试分支
        await flush(15);
        // 解除吞写恢复真实读取；此后虚拟列表落点已写为 1900，
        // 检查 1900 + 400 >= 2000 → 递归终止
        delete (container as any).scrollTop;
        (container as any).scrollTop = 1900;
        await flush(200);
        // 无限递归未发生（正常返回即验证），且落点已被写入
        expect(staged).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('scrollToIndex 定位后滚动窗口随之移动', async () => {
        const wrapper = mountScroller(100);
        await nextTick();
        await flush();
        await nextTick();

        const container = getScrollContainer(wrapper);
        // stub 尺寸供 virtua 计算落点
        Object.defineProperty(container, 'scrollHeight', {
            value: 2000,
            configurable: true,
            writable: true,
        });
        Object.defineProperty(container, 'clientHeight', {
            value: 400,
            configurable: true,
            writable: true,
        });
        wrapper.vm.scrollToIndex(50);
        await flush(40);
        await nextTick();
        // scrollTo 已写入 scrollTop（50 * 20 = 1000）
        expect((container as any).scrollTop).toBe(1000);
        // virtua 处于 scrolling 抑制态，需真实 scroll 事件通知重算窗口
        container.dispatchEvent(new Event('scroll'));
        await flush(40);
        await nextTick();
        const indexes = getRenderedIndexes(wrapper);
        expect(indexes).toContain(50);
        expect(indexes[0]).toBe(40);
        expect(indexes[indexes.length - 1]).toBe(60);
        wrapper.unmount();
    });
});
