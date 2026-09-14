import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';
import { FVirtualList as VirtualList } from '../index';
import { FTag as Tag } from '../../tag/index';
import { FEllipsis as Ellipsis } from '../../ellipsis/index';
import { FTooltip } from '../../tooltip/index';

// jsdom 未内置 ResizeObserver，列表项尺寸测量依赖它
if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = ResizeObserver;
}

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

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
