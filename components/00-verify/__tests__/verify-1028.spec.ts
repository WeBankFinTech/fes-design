/**
 * #1028 回归：virtual-list 的 header/footer slot 已有渲染出口。
 * 修复内容（virtualList.tsx render）：
 * wrapTag 容器 children 改为 [header, items, footer]——
 * header 插槽渲染在条目之前、footer 在条目之后；
 * renderItemList 仅接管条目区（参数形状不变）。
 */
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';
import { FVirtualList as VirtualList } from '../../virtual-list/index';
import { wait } from '../../_util/__tests__/helpers';

// jsdom 未内置 ResizeObserver，列表项尺寸测量依赖它
if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = ResizeObserver;
}

const makeItems = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: i, text: `条目${i}` }));

const mountList = (slots: any) =>
    mount(VirtualList, {
        props: {
            dataSources: makeItems(10),
            dataKey: 'id',
            keeps: 10,
            estimateSize: 50,
        } as any,
        slots,
        attachTo: document.body,
    });

describe('#1028 FVirtualList header/footer slot 渲染出口（回归）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('传入 header/footer slot → 内容渲染进 DOM，条目正常渲染', async () => {
        const wrapper = mountList({
            default: ({ source }: any) => h('div', source.text),
            header: () => h('div', { class: 'v1028-header' }, '1028头部标记'),
            footer: () => h('div', { class: 'v1028-footer' }, '1028尾部标记'),
        });
        await nextTick();
        await wait();
        // 修复后：slot 内容渲染进 DOM（修复前 render() 无出口）
        expect(wrapper.find('.v1028-header').exists()).toBe(true);
        expect(wrapper.find('.v1028-footer').exists()).toBe(true);
        expect(wrapper.html()).toContain('1028头部标记');
        expect(wrapper.html()).toContain('1028尾部标记');
        // 顺序：header 在条目之前，footer 在条目之后
        const html = wrapper.html();
        expect(html.indexOf('1028头部标记')).toBeLessThan(html.indexOf('条目0'));
        expect(html.indexOf('条目9')).toBeLessThan(html.indexOf('1028尾部标记'));
        // 条目渲染不受影响
        expect(wrapper.text()).toContain('条目0');
        expect(wrapper.text()).toContain('条目9');
        wrapper.unmount();
    });

    test('对照：不传 header/footer 时列表正常渲染', async () => {
        const wrapper = mountList({
            default: ({ source }: any) => h('div', source.text),
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('条目0');
        wrapper.unmount();
    });
});
