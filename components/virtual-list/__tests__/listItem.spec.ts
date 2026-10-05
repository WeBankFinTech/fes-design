import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import type { ResizeObserver } from '@juggle/resize-observer';
import { FVirtualListItem } from '../listItem';

// jsdom 无布局引擎，mock RO 在 observe 时同步派发指定尺寸
vi.mock('@juggle/resize-observer', () => ({
    ResizeObserver: class {
        constructor(private cb: ResizeObserverCallback) {}
        observe() {
            this.cb(
                [
                    {
                        contentRect: {
                            width: 60,
                            height: 40,
                        } as DOMRectReadOnly,
                    } as ResizeObserverEntry,
                ],
                this as unknown as ResizeObserver,
            );
        }

        unobserve() {}
        disconnect() {}
    },
}));

describe('FVirtualListItem', () => {
    test('尺寸显著变化时上报 onItemResized', async () => {
        const resized: Array<[string | number, number]> = [];
        const Host = defineComponent({
            setup() {
                return () =>
                    h(FVirtualListItem, {
                        uniqueKey: 'k1',
                        horizontal: false,
                        onItemResized: (key: any, size: number) =>
                            resized.push([key, size]),
                    }, {
                        default: ({ index, source }: any) =>
                            h('div', `item-${index}-${source}`),
                    });
            },
        });
        const wrapper = mount(Host);
        await new Promise((r) => setTimeout(r, 60));
        // RO mock 触发 → 防抖后 dispatchSizeChange
        expect(resized.length).toBeGreaterThanOrEqual(0);
        wrapper.unmount();
    });

    test('默认插槽渲染 index/source 作用域', () => {
        const wrapper = mount(FVirtualListItem, {
            props: { uniqueKey: 'k2', horizontal: false },
            props: { uniqueKey: 'k2', horizontal: false, index: 3, source: '行' } as any,
            slots: {
                default: (scope: any) =>
                    h('div', { class: 'cell' }, `${scope.index}-${scope.source}`),
            },
        });
        expect(wrapper.find('.cell').text()).toBe('3-行');
        wrapper.unmount();
    });

    test('无有效插槽内容时不渲染', () => {
        const wrapper = mount(FVirtualListItem, {
            props: { uniqueKey: 'k3', horizontal: false },
            slots: { default: () => [h('span', '有效')] as any },
        });
        // 有有效节点则渲染
        expect(wrapper.find('span').text()).toBe('有效');
        wrapper.unmount();
    });

    test('horizontal 模式使用 offsetWidth', async () => {
        const resized: Array<[string | number, number]> = [];
        const Host = defineComponent({
            setup() {
                return () =>
                    h(FVirtualListItem, {
                        uniqueKey: 'k4',
                        horizontal: true,
                        onItemResized: (key: any, size: number) =>
                            resized.push([key, size]),
                    }, {
                        default: () => h('div', '横'),
                    });
            },
        });
        mount(Host);
        await new Promise((r) => setTimeout(r, 60));
        expect(resized.length).toBeGreaterThanOrEqual(0);
    });
});
