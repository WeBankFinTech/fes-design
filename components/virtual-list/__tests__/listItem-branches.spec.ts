import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { describe, expect, test, vi } from 'vitest';
import type { ResizeObserver } from '@juggle/resize-observer';
import { FVirtualListItem } from '../listItem';

/**
 * FVirtualListItem 分支补全（基线 13/18，死分支）：
 * - L22[0] dispatchSizeChange 时 itemRef 未就绪 → 早退
 * - L32[0] 尺寸变化 ≥ 阈值(2px) 时上报 onItemResized
 * - L40[0] 防抖重入：已有计时器时 clearTimeout 重新排程
 * - L69[1] 无 default 插槽 → $slots.default?.() 为 undefined → ?? []
 * - L71[0] 无有效 vNode → 渲染空
 *
 * 与既有 listItem.spec.ts 的可控点差异：本文件 RO mock 不自动派发，
 * 由测试手工调用 fire()，从而精确控制尺寸上报/防抖时序。
 */
type MockROEntry = Partial<ResizeObserverEntry> & { contentRect: any };

// vi.hoisted：mock 工厂被提升到文件顶部，类定义也一并提升
const { MockResizeObserver } = vi.hoisted(() => {
    class MockResizeObserver {
        static instances: MockResizeObserver[] = [];

        cb: ResizeObserverCallback;

        observed: Element | null = null;

        constructor(cb: ResizeObserverCallback) {
            this.cb = cb;
            MockResizeObserver.instances.push(this);
        }

        observe(target: Element) {
            this.observed = target;
        }

        unobserve() {}

        disconnect() {}

        fire(entry: MockROEntry) {
            this.cb(
                [entry as ResizeObserverEntry],
                this as unknown as ResizeObserver,
            );
        }
    }
    return { MockResizeObserver };
});

vi.mock('@juggle/resize-observer', () => ({
    ResizeObserver: MockResizeObserver,
}));

const wait = (ms = 40) => new Promise((r) => setTimeout(r, ms));

// 构造可挂载宿主：插槽渲染单个 div（itemRef 指向该元素）
function mountItem(props: Record<string, any> = {}, slot = true) {
    MockResizeObserver.instances = [];
    const resized: Array<[string | number, number]> = [];
    const Host = defineComponent({
        setup() {
            return () =>
                h(
                    FVirtualListItem,
                    {
                        uniqueKey: 'k1',
                        onItemResized: (key: any, size: number) =>
                            resized.push([key, size]),
                        ...props,
                    },
                    slot
                        ? {
                                default: () => h('div', { class: 'cell' }, '内容'),
                            }
                        : undefined,
                );
        },
    });
    const wrapper = mount(Host);
    return { wrapper, resized };
}

function stubSize(el: Element, key: 'offsetHeight' | 'offsetWidth', v: number) {
    Object.defineProperty(el, key, {
        value: v,
        configurable: true,
        writable: true,
    });
}

describe('FVirtualListItem 分支', () => {
    test('尺寸变化 ≥2px 上报 onItemResized；同尺寸不再重复上报（L32）', async () => {
        const { wrapper, resized } = mountItem({ horizontal: false });
        await nextTick();
        await wait(30);

        const ro = MockResizeObserver.instances[0];
        expect(ro).toBeTruthy();
        const el = wrapper.find('.cell').element;
        expect(el).toBeTruthy();

        // 首次 60px：|60-0| ≥ 2 → 上报 60；lastReported=60
        stubSize(el, 'offsetHeight', 60);
        ro.fire({ contentRect: { width: 80, height: 60 } });
        await wait(30);
        expect(resized).toEqual([['k1', 60]]);

        // 同尺寸 60：|60-60| < 2 → 不上报
        ro.fire({ contentRect: { width: 80, height: 60 } });
        await wait(30);
        expect(resized).toHaveLength(1);

        // 尺寸变化 60→64：|64-60|=4 ≥ 2 → 再上报
        stubSize(el, 'offsetHeight', 64);
        ro.fire({ contentRect: { width: 80, height: 64 } });
        await wait(30);
        expect(resized).toEqual([
            ['k1', 60],
            ['k1', 64],
        ]);
        wrapper.unmount();
    });

    test('horizontal 模式使用 offsetWidth 上报（L26 分支）', async () => {
        const { wrapper, resized } = mountItem({ horizontal: true });
        await nextTick();
        await wait(30);
        const ro = MockResizeObserver.instances[0];
        const el = wrapper.find('.cell').element;
        stubSize(el, 'offsetWidth', 120);
        ro.fire({ contentRect: { width: 120, height: 0 } });
        await wait(30);
        expect(resized).toEqual([['k1', 120]]);
        wrapper.unmount();
    });

    test('防抖重入：同 tick 两次 RO 回调只触发一次上报，并清掉旧计时器（L40）', async () => {
        const { wrapper, resized } = mountItem({ horizontal: false });
        await nextTick();
        await wait(30);
        const ro = MockResizeObserver.instances[0];
        const el = wrapper.find('.cell').element;
        stubSize(el, 'offsetHeight', 50);

        // 连续两次 fire（16ms 防抖窗口内）→ 第二次 clearTimeout 重排
        ro.fire({ contentRect: { height: 50 } });
        ro.fire({ contentRect: { height: 50 } });
        await wait(30);
        expect(resized).toEqual([['k1', 50]]);
        wrapper.unmount();
    });

    test('dispatchSizeChange 时 itemRef 未就绪 → 早退不崩溃（L22）', async () => {
        // 模拟异步 RO 回调早于 ref 挂载的竞态：组件无 default 插槽时
        // itemRef 保持 null，手工触发 RO 回调 → L22 守卫早退
        const { wrapper, resized } = mountItem({ horizontal: false }, false);
        await nextTick();
        await wait(10);
        const ro = MockResizeObserver.instances[0];
        // 无插槽 → 组件不渲染元素，itemRef.value 为 null
        expect(wrapper.element.childNodes.length).toBe(0);
        ro.fire({ contentRect: { height: 50 } });
        await wait(30);
        expect(resized).toHaveLength(0);
        wrapper.unmount();
    });

    test('无 default 插槽：$slots.default 缺失 → ?? [] → 渲染空（L69/L71）', async () => {
        const { wrapper } = mountItem({ horizontal: false }, false);
        await nextTick();
        // getFirstValidNode([]) → null → render 返回 undefined，无任何 DOM
        expect(wrapper.element.childNodes.length).toBe(0);
        wrapper.unmount();
    });

    test('observeResize=false 时禁用尺寸观察：RO 回调被忽略不上报', async () => {
        const { wrapper, resized } = mountItem(
            { horizontal: false, observeResize: false },
            true,
        );
        await nextTick();
        await wait(10);
        const ro = MockResizeObserver.instances[0];
        const el = wrapper.find('.cell').element;
        stubSize(el, 'offsetHeight', 80);
        ro.fire({ contentRect: { height: 80 } });
        await wait(30);
        expect(resized).toHaveLength(0);
        wrapper.unmount();
    });
});
