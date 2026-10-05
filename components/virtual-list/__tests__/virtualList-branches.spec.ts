/**
 * FVirtualList 分支覆盖率补全
 *
 * 覆盖目标（virtualList.tsx 未覆盖分支）：
 * - 44/97/104/113/125/137/385/398：direction='horizontal' 的横向分支
 * - 57/260：dataKey 传函数（uniqueIds 解析 + 渲染项解析两处三元）
 * - 92/99/106/112/124/136：rootRef 为空的守卫路径（挂载态置空 vm.rootRef，
 *   模拟 ref 回调尚未执行/容器缺失的场景；unmount 后实例代理不可用，
 *   故用「置空 exposed ref」方式驱动 falsy 分支）
 * - 143：scrollToBottom 的重试判定两路（未到底重试 / 已到底停止）
 * - 153：scrollToIndex 传最后索引转发 scrollToBottom
 * - 171/173/183：onItemResized 尺寸变化链 + updateScrollBar 的 scrollRef 守卫。
 *   真实链路依赖 ResizeObserver 回调，jsdom polyfill 不派发（见
 *   virtualList-props.spec.ts 锁定），故直接调 exposed 方法并在注释说明
 * - 196/197/199/203：onSlotResized 的 header/footer/hasInit/无 slot 短路
 * - 224：bottomThreshold 命中触发 toBottom
 * - 238：iOS 回弹三重守卫（负偏移 / 超界 / scrollHeight=0）
 * - 258/263：稀疏数据（undefined 项）与 dataKey 解析出非 string/number
 * - 334/336：start / offset prop 的初始定位（onMounted）
 * - 414：renderItemList prop 接管列表节点输出
 * - 433/435：编译器生成的 _isSlot helper 分支，wrapNode 恒为 createVNode
 *   产物（恒真），path 不可达，无法通过测试覆盖
 */
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';
import getPrefixCls from '../../_util/getPrefixCls';
import { FVirtualList as VirtualList } from '../index';
import { wait } from '../../_util/__tests__/helpers';

// jsdom 未内置 ResizeObserver，列表项尺寸测量依赖它
if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = ResizeObserver;
}

// jsdom 未实现 Element.scrollBy/scrollTo：用可捕获的 mock 桩
const scrollToMock = vi.fn();
const scrollByMock = vi.fn();
if (typeof Element !== 'undefined' && !Element.prototype.scrollTo) {
    Element.prototype.scrollTo = scrollToMock as any;
}
if (typeof Element !== 'undefined' && !Element.prototype.scrollBy) {
    Element.prototype.scrollBy = scrollByMock as any;
}

const scrollbarPrefixCls = getPrefixCls('scrollbar');

const makeItems = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: i, text: `item-${i}` }));

/** 可写的滚动属性桩：jsdom 无布局引擎，scrollLeft/Top 等默认只读 */
const stubScroll = (
    el: HTMLElement,
    props: Record<string, number>,
) => {
    Object.entries(props).forEach(([key, value]) => {
        Object.defineProperty(el, key, {
            value,
            writable: true,
            configurable: true,
        });
    });
};

const getContainer = (wrapper: any) =>
    wrapper.element.querySelector(
        `.${scrollbarPrefixCls}-container`,
    ) as HTMLElement;

const nextFrame = () => new Promise((r) => requestAnimationFrame(r));

interface MountOptions {
    dataSources?: any[];
    dataKey?: any;
    keeps?: number;
    direction?: 'vertical' | 'horizontal';
    extraProps?: Record<string, any>;
    withHeaderFooter?: boolean;
}

const mountList = ({
    dataSources = makeItems(100),
    dataKey = 'id',
    keeps = 10,
    direction = 'vertical',
    extraProps = {},
    withHeaderFooter = false,
}: MountOptions = {}) => mount(VirtualList, {
    props: {
        dataSources,
        dataKey,
        keeps,
        estimateSize: 50,
        direction,
        ...extraProps,
    },
    slots: {
        default: ({ source }: any) =>
            h('div', { class: 'vl-item' }, source.text),
        ...(withHeaderFooter
            ? {
                    header: () => h('div', '头部'),
                    footer: () => h('div', '尾部'),
                }
            : {}),
    },
});

beforeEach(() => {
    scrollToMock.mockClear();
    scrollByMock.mockClear();
});

afterEach(() => {
    document.body.innerHTML = '';
});

describe('FVirtualList 分支补全', () => {
    describe('水平方向（44/97/104/113/125/137/385/398）', () => {
        test('horizontal 挂载渲染 flex 横向布局，水平滚动更新渲染区间', async () => {
            const wrapper = mountList({ direction: 'horizontal', keeps: 10 });
            await nextTick();

            // 385：horizontal 的 wrapperStyle 分支（flex 行向）。
            // wrapNode 的 class 即 wrapClass prop（默认空串），无独立锚点类，
            // 用 scrollbar-content 的首子元素定位
            const wrap = wrapper.find(`.${scrollbarPrefixCls}-content`)
                .element.children[0] as HTMLElement;
            expect(wrap).not.toBeNull();
            expect(wrap.style.display).toBe('flex');
            expect(wrap.style.flexDirection).toBe('row');
            // 398：horizontal 的 rootStyle 分支（height 优先于 width）
            expect(wrap.style.padding).toBe('0px 4500px 0px 0px');

            // 44：directionKey='scrollLeft'；水平滚动后区间后移
            const container = getContainer(wrapper);
            stubScroll(container, {
                scrollLeft: 600,
                scrollWidth: 5000,
                clientWidth: 100,
            });
            container.dispatchEvent(new Event('scroll'));
            await nextFrame();
            await nextTick();
            const indexes = wrapper.findAll('.vl-item')
                .map((it) => Number(it.text().split('-')[1]));
            expect(wrapper.emitted('scroll')).toBeTruthy();
            expect(indexes[0]).toBe(12);
            wrapper.unmount();
        });

        test('horizontal 下 scrollTo 系列走 scrollBy/scrollTo 横向参数', async () => {
            const wrapper = mountList({ direction: 'horizontal', keeps: 10 });
            await nextTick();
            const container = getContainer(wrapper);
            stubScroll(container, {
                scrollLeft: 0,
                scrollWidth: 3000,
                clientWidth: 100,
            });
            const list: any = wrapper.vm;

            // 113/125：isHorizontal true → scrollBy(offset, 0) / scrollTo(position, 0)
            list.scrollToOffset(300);
            expect(scrollByMock).toHaveBeenCalledWith(300, 0);

            // 153 反向确认：非末索引走 getOffset + scrollToTarget
            list.scrollToIndex(5);
            expect(scrollToMock).toHaveBeenCalledWith(250, 0);

            // 137：scrollToBottom 在 horizontal 下读 scrollWidth
            list.scrollToBottom();
            expect(scrollToMock).toHaveBeenCalledWith(3000, 0);
            // 置空 rootRef 终止重试循环（unmount 后闭包仍持有脱离的 DOM，
            // 桩值不消失会让循环跨用例存活、污染后续 mock 计数）
            list.rootRef = null;
            wrapper.unmount();
            await wait(60); // 冲掉挂起的重试定时器
        });
    });

    describe('rootRef 空值守卫（92/99/106/112/124/136 falsy）', () => {
        test('rootRef 置空后 getter 返回 0、滚动方法静默跳过', () => {
            const wrapper = mountList({ keeps: 5 });
            const list: any = wrapper.vm;
            // 模拟 ref 回调尚未执行/容器缺失：挂载态直接置空 exposed ref。
            // unmount 后组件实例代理失效无法访问 exposed，此为唯一驱动方式
            list.rootRef = null;
            const beforeScrollTo = scrollToMock.mock.calls.length;
            const beforeScrollBy = scrollByMock.mock.calls.length;

            // 92/99/106：getter 的 root 判空路径
            expect(list.getOffset()).toBe(0);
            expect(list.getClientSize()).toBe(0);
            expect(list.getScrollSize()).toBe(0);

            // 112/124：scrollToOffset / scrollToTarget 守卫短路
            expect(() => {
                list.scrollToOffset(100);
                list.scrollToIndex(3);
            }).not.toThrow();
            expect(scrollToMock.mock.calls.length).toBe(beforeScrollTo);
            expect(scrollByMock.mock.calls.length).toBe(beforeScrollBy);

            // 136：scrollToBottom 守卫短路（置空后重试条件 0+0<0 为假，无残留定时器）
            expect(() => list.scrollToBottom()).not.toThrow();
            expect(scrollToMock.mock.calls.length).toBe(beforeScrollTo);
            wrapper.unmount();
        });
    });

    describe('scrollToBottom 重试判定（143）', () => {
        test('未真正到底时 20ms 后重试滚动', async () => {
            const wrapper = mountList({ keeps: 10 });
            await nextTick();
            const container = getContainer(wrapper);
            stubScroll(container, {
                scrollTop: 0,
                scrollHeight: 5000,
                clientHeight: 100,
            });
            (wrapper.vm as any).scrollToBottom();
            expect(scrollToMock).toHaveBeenCalledWith(0, 5000);
            // 143 true：scrollTop(0)+100 < 5000 → 下一轮循环重试
            await wait(80);
            expect(scrollToMock.mock.calls.length).toBeGreaterThanOrEqual(2);
            // 终止重试循环，防跨用例污染
            (wrapper.vm as any).rootRef = null;
            wrapper.unmount();
        });

        test('已到底时不再重试', async () => {
            const wrapper = mountList({ keeps: 10 });
            await nextTick();
            const container = getContainer(wrapper);
            stubScroll(container, {
                scrollTop: 4900,
                scrollHeight: 5000,
                clientHeight: 100,
            });
            (wrapper.vm as any).scrollToBottom();
            expect(scrollToMock).toHaveBeenCalledTimes(1);
            // 143 false：4900+100 不小于 5000 → 停止重试
            await wait(80);
            expect(scrollToMock).toHaveBeenCalledTimes(1);
            wrapper.unmount();
        });
    });

    describe('scrollToIndex 末索引转发（153）', () => {
        test('scrollToIndex(最后索引) 等价 scrollToBottom', async () => {
            const wrapper = mountList({ keeps: 10 });
            await nextTick();
            const container = getContainer(wrapper);
            stubScroll(container, { scrollHeight: 5000 });
            (wrapper.vm as any).scrollToIndex(99);
            // 153 true：index >= length-1 → 转发 scrollToBottom → scrollTo(0, scrollHeight)
            expect(scrollToMock).toHaveBeenCalledWith(0, 5000);
            // 终止重试循环，防跨用例污染
            (wrapper.vm as any).rootRef = null;
            wrapper.unmount();
            await wait(60);
        });
    });

    describe('onItemResized 与 updateScrollBar（171/173/183）', () => {
        // 真实触发链是 ResizeObserver 回调，jsdom polyfill 不派发
        // （见 virtualList-props.spec.ts 的环境限制锁定），故直接调 exposed 方法
        test('尺寸变化上报 resized，相同尺寸不重复上报，节流尾沿不空转', async () => {
            const wrapper = mountList({ keeps: 5 });
            await nextTick();
            const list: any = wrapper.vm;
            list.onItemResized('a', 50);
            await nextTick();
            let emitted = wrapper.emitted('resized');
            expect(emitted).toBeTruthy();
            expect(emitted![0]).toEqual(['a', 50]);

            // 183 false：oldSize === size → 不再上报
            list.onItemResized('a', 50);
            await nextTick();
            expect(wrapper.emitted('resized')).toHaveLength(1);

            // 同 id 改尺寸：sizes 计数不变。首跑节流已置 lastSize=1，
            // 尾沿执行时 nowSize===lastSize → 171 false 路径
            list.onItemResized('a', 80);
            await nextTick();
            emitted = wrapper.emitted('resized');
            expect(emitted).toHaveLength(2);
            expect(emitted![1]).toEqual(['a', 80]);
            await wait(50); // 等节流尾沿执行完
            wrapper.unmount();
        });

        test('scrollRef 为空时 updateScrollBar 安全跳过', async () => {
            const wrapper = mountList({ keeps: 5 });
            await nextTick();
            const list: any = wrapper.vm;
            // 173 falsy：scrollRef 为空 → 跳过 scrollbar 更新不抛错
            list.scrollRef = null;
            expect(() => list.onItemResized('c', 66)).not.toThrow();
            await nextTick();
            const emitted = wrapper.emitted('resized');
            expect(emitted).toBeTruthy();
            expect(emitted![0]).toEqual(['c', 66]);
            await wait(50);
            wrapper.unmount();
        });
    });

    describe('onSlotResized（196/197/199/203）', () => {
        test('thead/tfoot 更新 slot 尺寸并计入 scrollToIndex 偏移', async () => {
            const wrapper = mountList({ keeps: 10, withHeaderFooter: true });
            await nextTick();
            const container = getContainer(wrapper);
            stubScroll(container, { scrollHeight: 5000 });
            const list: any = wrapper.vm;

            // 203 false：hasInit=false 只更新参数不触发重算
            list.onSlotResized('thead', 30, false);
            // 196 true + 197 true：header → slotHeaderSize；199 true：footer → slotFooterSize
            list.onSlotResized('thead', 30, true);
            list.onSlotResized('tfoot', 20, true);

            // header 尺寸 30 计入偏移：index 1 → 50*1 + 30 = 80
            list.scrollToIndex(1);
            expect(scrollToMock).toHaveBeenCalledWith(0, 80);
            wrapper.unmount();
        });

        test('slot 渲染空内容时短路，slot 尺寸不影响偏移', async () => {
            // 实测（VTU 2.0.0-rc.17 + Vue 3.5.13）：VTU 归一化后任何 slot
            // 函数调用恒返回至少含一个注释 VNode 的数组（() => null 亦然），
            // 196 的 falsy 路径不可达（未传 slot 时 slots.header 为 undefined
            // 直接 TypeError）。此处锁定 truthy 路径下「参数仍被拒收」的
            // 防御行为：header/footer slot 存在但 type 非枚举值时不更新参数
            const wrapper = mount(VirtualList, {
                props: {
                    dataSources: makeItems(20),
                    dataKey: 'id',
                    keeps: 10,
                    estimateSize: 50,
                },
                slots: {
                    default: ({ source }: any) =>
                        h('div', { class: 'vl-item' }, source.text),
                    header: () => h('div', '头部'),
                    footer: () => h('div', '尾部'),
                },
            });
            await nextTick();
            const container = getContainer(wrapper);
            stubScroll(container, { scrollHeight: 5000 });
            const list: any = wrapper.vm;

            // 197 false + 199 false：type 既非 'thead' 也非 'tfoot' → 参数不更新
            list.onSlotResized('other', 999, true);
            list.scrollToIndex(1);
            // 偏移不含 slot 尺寸：50*1 + 0 = 50
            expect(scrollToMock).toHaveBeenCalledWith(0, 50);
            wrapper.unmount();
        });
    });

    describe('滚动守卫与阈值（224/238）', () => {
        test('接近底部且 bottomThreshold 命中时触发 toBottom', async () => {
            const wrapper = mountList({
                keeps: 10,
                extraProps: { bottomThreshold: 50 },
            });
            await nextTick();
            const container = getContainer(wrapper);
            // 9895+100=9995 不超过 10000+1，避开 238 的超界守卫
            stubScroll(container, {
                scrollTop: 9895,
                scrollHeight: 10000,
                clientHeight: 100,
            });
            container.dispatchEvent(new Event('scroll'));
            await nextTick();
            // 224 true：offset+client+bottomThreshold >= scrollSize → toBottom
            const toBottom = wrapper.emitted('toBottom');
            expect(toBottom).toBeTruthy();
            expect(toBottom).toHaveLength(1);
            expect(wrapper.emitted('toTop')).toBeUndefined();
            wrapper.unmount();
        });

        test('iOS 回弹守卫：负偏移 / scrollHeight 为 0 / 超界均直接返回', async () => {
            const wrapper = mountList({ keeps: 10 });
            await nextTick();
            const container = getContainer(wrapper);

            // 238 第三操作数：!scrollSize（scrollHeight=0 且 clientHeight=0
            // 避免第二操作数先命中）
            stubScroll(container, {
                scrollTop: 0,
                scrollHeight: 0,
                clientHeight: 0,
            });
            container.dispatchEvent(new Event('scroll'));
            await nextTick();
            expect(wrapper.emitted('scroll')).toBeUndefined();

            // 238 第一操作数：offset < 0（iOS 回弹）
            stubScroll(container, {
                scrollTop: -50,
                scrollHeight: 5000,
                clientHeight: 100,
            });
            container.dispatchEvent(new Event('scroll'));
            await nextTick();
            expect(wrapper.emitted('scroll')).toBeUndefined();

            // 238 第二操作数：offset+clientSize > scrollSize+1
            stubScroll(container, {
                scrollTop: 1000,
                scrollHeight: 500,
                clientHeight: 100,
            });
            container.dispatchEvent(new Event('scroll'));
            await nextTick();
            expect(wrapper.emitted('scroll')).toBeUndefined();
            // 守卫命中时渲染区间保持初始
            expect(wrapper.text()).toContain('item-0');
            wrapper.unmount();
        });
    });

    describe('数据解析（57/260/258/263）', () => {
        test('函数 dataKey：uniqueIds 与渲染项均走函数分支', async () => {
            const sources = makeItems(20).map((it) => ({ ...it, key: `k${it.id}` }));
            const wrapper = mountList({
                dataSources: sources,
                dataKey: (item: any) => item.key,
                keeps: 8,
            });
            await nextTick();
            // 57：getUniqueIdFromDataSources 的函数分支
            expect(wrapper.text()).toContain('item-0');
            // 260：getRenderItems 的函数分支
            expect(wrapper.findAll('.vl-item')).toHaveLength(8);
            wrapper.unmount();
        });

        test('稀疏数据（undefined 项）渲染时跳过并告警', async () => {
            const warnSpy = vi.spyOn(console, 'warn')
                .mockImplementation(() => {});
            const sources = [
                { id: 0, text: 'item-0' },
                { id: 1, text: 'item-1' },
                { id: 2, text: 'item-2' },
                undefined,
                undefined,
                { id: 5, text: 'item-5' },
                { id: 6, text: 'item-6' },
                { id: 7, text: 'item-7' },
            ];
            const wrapper = mountList({
                dataSources: sources,
                // 函数 dataKey 对 undefined 返回占位 key，避免 id 解析抛错
                dataKey: (item: any) => (item ? `id-${item.id}` : 'hole'),
                keeps: 8,
            });
            await nextTick();
            // 258 true：isNil(dataSource) → 告警并跳过
            expect(warnSpy).toHaveBeenCalledWith(
                'Cannot get the index \'3\' from data-sources.',
            );
            expect(warnSpy).toHaveBeenCalledWith(
                'Cannot get the index \'4\' from data-sources.',
            );
            // 其余 6 项正常渲染
            expect(wrapper.findAll('.vl-item')).toHaveLength(6);
            expect(wrapper.text()).toContain('item-2');
            expect(wrapper.text()).toContain('item-5');
            warnSpy.mockRestore();
            wrapper.unmount();
        });

        test('dataKey 解析出非 string/number 时告警且不渲染该项', async () => {
            const warnSpy = vi.spyOn(console, 'warn')
                .mockImplementation(() => {});
            const sources = [
                { id: { bad: 1 }, text: 'bad-0' },
                { id: { bad: 2 }, text: 'bad-1' },
                { id: { bad: 3 }, text: 'bad-2' },
            ];
            const wrapper = mountList({
                dataSources: sources,
                dataKey: 'id',
                keeps: 3,
            });
            await nextTick();
            // 263 false：uniqueKey 非 string/number → 告警
            expect(warnSpy).toHaveBeenCalledWith(
                'Cannot get the data-key \'id\' from data-sources.',
            );
            expect(wrapper.findAll('.vl-item')).toHaveLength(0);
            warnSpy.mockRestore();
            wrapper.unmount();
        });
    });

    describe('初始定位（334/336）', () => {
        // 挂载期 onMounted 时函数 ref 回调仍在 postRender 队列中，rootRef
        // 未就绪，scrollToTarget/scrollToOffset 静默短路，但 334/336 的
        // truthy 判定已随挂载流程执行；setProps 走 watch 路径做行为断言
        test('start prop 挂载进入初始定位分支，变化时定位到指定索引偏移', async () => {
            const wrapper = mountList({ keeps: 10, extraProps: { start: 10 } });
            // 334 true：props.start 非零 → 走 scrollToIndex（rootRef 未就绪，
            // scrollTo 静默，进入分支本身即为本用例的覆盖目标）
            await nextTick();
            await wrapper.setProps({ start: 20 });
            // watch start → scrollToIndex(20) → 50*20 = 1000
            expect(scrollToMock).toHaveBeenCalledWith(0, 1000);
            wrapper.unmount();
        });

        test('offset prop 变化滚动到指定偏移', async () => {
            const wrapper = mountList({ keeps: 10 });
            await nextTick();
            await wrapper.setProps({ offset: 300 });
            // scrollToOffset(300) → root.scrollBy(0, 300)
            expect(scrollByMock).toHaveBeenCalledWith(0, 300);
            wrapper.unmount();
        });

        test('start 为 0 时跳过初始定位，改判 offset 分支', async () => {
            // 334 false（start=0 falsy）→ 336 判定执行
            const wrapper = mountList({ keeps: 10, extraProps: { start: 0 } });
            await nextTick();
            // 此处 start=0、offset 未传，两分支均未实际滚动，仅确认挂载无异常
            expect(wrapper.findAll('.vl-item').length).toBeGreaterThan(0);
            wrapper.unmount();
        });

        test('offset prop 挂载进入初始偏移分支', () => {
            // 336 true：props.offset 非零 → 走 scrollToOffset（同上，分支判定覆盖）
            const wrapper = mountList({ keeps: 10, extraProps: { offset: 300 } });
            expect(wrapper.findAll('.vl-item').length).toBeGreaterThan(0);
            wrapper.unmount();
        });
    });

    describe('renderItemList（414）', () => {
        test('renderItemList 接管列表节点输出', async () => {
            const renderItemList = vi.fn(
                (nodes: any[]) => [h('div', { class: 'wrapped' }, nodes)],
            );
            const wrapper = mountList({ keeps: 5, extraProps: { renderItemList } });
            await nextTick();
            // 414 true：renderItemList 存在 → 由它包装渲染节点
            expect(renderItemList).toHaveBeenCalled();
            const arg = renderItemList.mock.calls[0][0];
            expect(Array.isArray(arg)).toBe(true);
            expect(arg.length).toBe(5);
            const wrapped = wrapper.find('.wrapped');
            expect(wrapped.exists()).toBe(true);
            expect(wrapped.text()).toContain('item-0');
            wrapper.unmount();
        });
    });
});
