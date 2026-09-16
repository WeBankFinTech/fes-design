import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';
import { FVirtualList as VirtualList } from '../index';
import { FTag as Tag } from '../../tag/index';
import { FEllipsis as Ellipsis } from '../../ellipsis/index';
import { FTooltip } from '../../tooltip/index';
import { wait } from '../../_util/__tests__/helpers';

// jsdom 未内置 ResizeObserver，列表项尺寸测量依赖它
if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = ResizeObserver;
}

const makeItems = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: i, text: `项目${i}` }));

describe('FVirtualList 属性补全', () => {
    test('slot 渲染与 index/source 注入', async () => {
        const wrapper = mount(VirtualList, {
            props: {
                dataSources: makeItems(100),
                dataKey: 'id',
                keeps: 30,
                estimateSize: 50,
            },
            slots: {
                default: ({ source, index }: any) =>
                    h('div', `S:${index}:${source.text}`),
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('S:0:项目0');
        wrapper.unmount();
    });

    test('estimateSize/keeps 控制虚拟渲染', async () => {
        const wrapper = mount(VirtualList, {
            props: {
                dataSources: makeItems(100),
                dataKey: 'id',
                keeps: 10,
                estimateSize: 50,
            },
            slots: {
                default: ({ source }: any) => h('div', source.text),
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // 虚拟渲染：只渲染可视区附近条目，首条可见
        expect(wrapper.text()).toContain('项目0');
        expect(wrapper.text()).not.toContain('项目99');
        wrapper.unmount();
    });

    test('wrapTag/wrapClass/wrapStyle 自定义容器', async () => {
        const wrapper = mount(VirtualList, {
            props: {
                dataSources: makeItems(50),
                dataKey: 'id',
                keeps: 20,
                estimateSize: 50,
                wrapClass: 'my-vl-wrap',
            },
            slots: {
                default: ({ source }: any) => h('div', source.text),
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.find('.my-vl-wrap').exists()).toBe(true);
        wrapper.unmount();
    });

    test('pageMode 分页模式渲染全部', async () => {
        const wrapper = mount(VirtualList, {
            props: {
                dataSources: makeItems(20),
                dataKey: 'id',
                pageMode: true,
                keeps: 30,
                estimateSize: 50,
            },
            slots: {
                default: ({ source }: any) => h('div', source.text),
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // pageMode 全渲染：首尾都在
        expect(wrapper.text()).toContain('项目0');
        expect(wrapper.text()).toContain('项目19');
        wrapper.unmount();
    });

    test('topThreshold/bottomThreshold 不影响正常渲染', async () => {
        const wrapper = mount(VirtualList, {
            props: {
                dataSources: makeItems(100),
                dataKey: 'id',
                topThreshold: 20,
                bottomThreshold: 20,
                keeps: 30,
                estimateSize: 50,
            },
            slots: {
                default: ({ source }: any) => h('div', source.text),
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('项目0');
        wrapper.unmount();
    });
});

describe('其他小组件属性补全', () => {
    test('Ellipsis tooltip 属性透传', async () => {
        const wrapper = mount(Ellipsis, {
            props: { content: '一段很长很长的文本内容', tooltip: true },
        });
        await nextTick();
        expect(wrapper.find('.fes-ellipsis').exists()).toBe(true);
        expect(wrapper.html()).toContain('一段很长很长的文本内容');
        wrapper.unmount();
    });

    test('Tooltip arrow=false', async () => {
        const wrapper = mount(FTooltip, {
            props: { content: '提示', arrow: false },
            slots: {
                default: () => h('span', '悬停目标'),
            },
            attachTo: document.body,
        });
        await nextTick();
        // trigger 渲染；content 由 popper 管理
        expect(wrapper.find('span').text()).toBe('悬停目标');
        wrapper.unmount();
    });

    test('Tag closable 显示关闭', async () => {
        const wrapper = mount(Tag, {
            props: { closable: true },
        });
        expect(wrapper.find('[class*="close"]').exists()).toBe(true);
        wrapper.unmount();
    });
});

describe('VirtualList 尺寸上报与 slot 现状锁定', () => {
    // listItem.dispatchSizeChange 读 offsetHeight/offsetWidth（非 getBoundingClientRect），
    // jsdom 原生为 0；stub 成非零值后初始量测 0→50 超过 2px 阈值会真实上报
    const stubOffset = (value: number) => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
            configurable: true,
            value,
        });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
            configurable: true,
            value,
        });
    };
    const restoreOffset = () => {
        delete (HTMLElement.prototype as any).offsetHeight;
        delete (HTMLElement.prototype as any).offsetWidth;
    };

    test('已知环境限制：jsdom 下 ResizeObserver polyfill 不派发回调，resized 保持静默', async () => {
        // @juggle/resize-observer 在 jsdom 无布局引擎，observe() 后不产生任何回调，
        // useResize → debouncedSizeCheck → dispatchSizeChange 整链不触发。
        // 锁定该环境行为（真实浏览器中初始量测会正常上报）：
        stubOffset(50);
        const onResized = vi.fn();
        const wrapper = mount(VirtualList, {
            props: {
                dataSources: makeItems(5),
                dataKey: 'id',
                keeps: 5,
                estimateSize: 50,
                onResized,
            },
            slots: { default: ({ source }: any) => h('div', source.text) },
            attachTo: document.body,
        });
        await nextTick();
        await wait(100);
        // jsdom 静默锁定；若未来 setup 中 mock RO 派发，此断言升级为 >0
        expect(onResized.mock.calls.length).toBe(0);
        wrapper.unmount();
        restoreOffset();
    });

    // 组件侧缺口已提 issue：WeBankFinTech/fes-design#1028
    // （修复后翻转断言：header/footer 应渲染进滚动区域）
    test('已知缺口锁定：header/footer slot 声明了 onSlotResized 但模板无渲染出口', async () => {
        // virtualList.tsx:196 判断 slots.header()/footer() 存在后更新 slot 尺寸，
        // 但 render() 只输出 getRenderItems()——header/footer 从未进 DOM。
        // 锁定当前行为（若未来补渲染出口，此用例需同步调整并升级为正向断言）。
        const wrapper = mount(VirtualList, {
            props: {
                dataSources: makeItems(5),
                dataKey: 'id',
                keeps: 5,
                estimateSize: 50,
            },
            slots: {
                default: ({ source }: any) => h('div', source.text),
                header: () => h('div', { class: 'vl-header' }, '头部'),
                footer: () => h('div', { class: 'vl-footer' }, '尾部'),
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // 当前行为：slot 内容不渲染（功能缺口，需组件侧修复）
        expect(wrapper.find('.vl-header').exists()).toBe(false);
        expect(wrapper.find('.vl-footer').exists()).toBe(false);
        // 条目渲染不受影响
        expect(wrapper.text()).toContain('项目0');
        wrapper.unmount();
    });
});
