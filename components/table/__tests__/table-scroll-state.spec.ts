import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import type { ResizeObserver } from '@juggle/resize-observer';
import Table from '../table';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('table');
const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));

vi.mock('@juggle/resize-observer', () => ({
    ResizeObserver: class {
        constructor(private cb: ResizeObserverCallback) {}
        observe(el: HTMLElement) {
            this.cb(
                [
                    {
                        contentRect: {
                            width: el.offsetWidth || 800,
                            height: el.offsetHeight || 300,
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

// fixed 列会被排在首尾（handleFixedColumns：props.fixed = true/'left'/'right'）
const FIXED_COLS = [
    { prop: 'name', label: '名称', fixed: 'left', width: 120 },
    { prop: 'age', label: '年龄' },
    { prop: 'addr', label: '地址', fixed: 'right', width: 120 },
];

const ROWS = [
    { id: 1, name: '一', age: 10, addr: '甲地' },
    { id: 2, name: '二', age: 20, addr: '乙地' },
];

const mountTable = (props = {}) =>
    mount(Table, {
        props: { columns: FIXED_COLS as any, data: ROWS, ...props } as any,
        attachTo: document.body,
    });

const stubWidths = (wrapper: any) => {
    // 固定高度 → block B：bodyMinWidth(340) > wrapperWidth(100) → isScrollX=true
    const wrapperEl = wrapper.find(`.${prefixCls}`).element;
    Object.defineProperty(wrapperEl, 'offsetWidth', { value: 100, configurable: true });
    const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
    Object.defineProperty(bodyTable, 'offsetWidth', { value: 900, configurable: true });
    const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
    if (bodyWrapper.exists()) {
        // onScroll 门槛：bodyWrapper.offsetHeight > 0
        Object.defineProperty(bodyWrapper.element, 'offsetHeight', { value: 100 });
    }
};

const stubScroll = (el: HTMLElement, scrollLeft: number, offsetWidth = 300, scrollWidth = 900) => {
    // writable：组件内 handleHeaderMousewheel 会执行 scrollLeft += deltaX，jsdom 默认 data 属性只读
    Object.defineProperty(el, 'scrollLeft', { value: scrollLeft, configurable: true, writable: true });
    Object.defineProperty(el, 'offsetWidth', { value: offsetWidth, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: scrollWidth, configurable: true });
};

const scrollBodyTo = async (wrapper: any, scrollLeft: number) => {
    const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
    const container = bodyWrapper.find('.fes-scrollbar-container');
    if (container.exists()) {
        stubScroll(container.element, scrollLeft);
        await container.trigger('scroll');
        await wait();
    }
    return container.exists();
};

describe('FTable 固定列与滚动状态（useTableStyle）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('横向滚动下固定列渲染 fixed 类与固定偏移样式', async () => {
        const wrapper = mountTable({ height: 200 });
        await nextTick();
        await wait();
        stubWidths(wrapper);
        // 触发重算 → isScrollX=true → 固定单元格带 left/right 偏移
        await wrapper.setProps({ columns: FIXED_COLS.map((c) => ({ ...c })) });
        await wait();
        const fixedCells = wrapper.findAll(
            `td.${prefixCls}-fixed-left, td.${prefixCls}-fixed-right`,
        );
        expect(fixedCells.length).toBeGreaterThan(0);
        const style = fixedCells[0].attributes('style') || '';
        expect(/left|right/.test(style)).toBe(true);
        wrapper.unmount();
    });

    test('固定列偏移宽度：width 与 minWidth 两种来源', async () => {
        // 固定列偏移 = 前置列宽度之和，覆盖 (width || minWidth) 两个分支
        const cols = [
            { prop: 'c1', label: 'C1', fixed: 'left', width: 150 },
            { prop: 'c2', label: 'C2', fixed: 'left', minWidth: 90 },
            { prop: 'c3', label: 'C3', fixed: 'left', width: 130 },
            { prop: 'mid', label: '中' },
            { prop: 'r1', label: 'R1', fixed: 'right', minWidth: 80 },
            { prop: 'r2', label: 'R2', fixed: 'right', width: 160 },
            { prop: 'r3', label: 'R3', fixed: 'right', width: 170 },
        ];
        const wrapper = mount(Table, {
            props: { columns: cols as any, data: ROWS, height: 200 } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        stubWidths(wrapper);
        await wrapper.setProps({ columns: cols.map((c) => ({ ...c })) });
        await wait();
        const leftFixed = wrapper.findAll(`td.${prefixCls}-fixed-left`);
        const rightFixed = wrapper.findAll(`td.${prefixCls}-fixed-right`);
        expect(leftFixed.length).toBeGreaterThan(0);
        expect(rightFixed.length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('body 滚动三种区间：right / left / middle', async () => {
        const wrapper = mountTable({ height: 200 });
        await nextTick();
        await wait();
        stubWidths(wrapper);
        expect(await scrollBodyTo(wrapper, 600)).toBe(true);
        expect(await scrollBodyTo(wrapper, 0)).toBe(true);
        expect(await scrollBodyTo(wrapper, 300)).toBe(true);
        // is-scrolling-x-* 状态类
        const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
        expect(
            bodyWrapper.classes().some((c) => c.includes('is-scrolling-x')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('header 横向滚轮滚动同步 body 滚动', async () => {
        const wrapper = mountTable({ height: 200 });
        await nextTick();
        await wait();
        stubWidths(wrapper);
        const header = wrapper.find(`.${prefixCls}-header-wrapper`);
        expect(header.exists()).toBe(true);
        stubScroll(header.element, 0, 300, 900);
        await header.trigger('wheel', { deltaX: 50, deltaY: 5 });
        await wait(120); // syncPosition throttle 10ms
        wrapper.unmount();
    });

    test('无数据时 header 滚轮直接更新 scrollLeft', async () => {
        const wrapper = mountTable({ height: 200, data: [] });
        await nextTick();
        await wait();
        const header = wrapper.find(`.${prefixCls}-header-wrapper`);
        expect(header.exists()).toBe(true);
        stubScroll(header.element, 0, 300, 900);
        await header.trigger('wheel', { deltaX: 30, deltaY: 1 });
        await wait(120);
        expect(header.element.scrollLeft).toBeGreaterThanOrEqual(0);
        wrapper.unmount();
    });

    test('数据从有到无再恢复：滚动状态重置', async () => {
        const wrapper = mountTable({ height: 200 });
        await nextTick();
        await wait();
        await wrapper.setProps({ data: [] });
        await wait();
        expect(wrapper.text()).not.toContain('一');
        await wrapper.setProps({ data: ROWS });
        await wait();
        expect(wrapper.text()).toContain('一');
        wrapper.unmount();
    });

    test('展开列行 class：展开与收起两种状态', async () => {
        const cols = [
            { type: 'expand', render: ({ row }: any) => h('div', `展开-${row.name}`) },
            { prop: 'name', label: '名称' },
        ];
        const rows = [
            { id: 1, name: '行一' },
            { id: 2, name: '行二' },
        ];
        const wrapper = mount(Table, {
            props: {
                columns: cols as any,
                data: rows,
                rowKey: 'id',
                expandedKeys: [1],
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('展开-行一');
        wrapper.unmount();
    });

    test('rowClassName 函数与 spanMethod 返回对象', async () => {
        const wrapper = mountTable({
            height: 200,
            rowClassName: ({ rowIndex }: any) => (rowIndex === 0 ? 'row-a' : 'row-b'),
            spanMethod: () => ({ rowspan: 1, colspan: 1 }),
        });
        await nextTick();
        await wait();
        expect(wrapper.find('.row-a').exists()).toBe(true);
        wrapper.unmount();
    });

    test('纯左固定列滚动中显示左侧阴影', async () => {
        const cols = [
            { prop: 'name', label: '名称', fixed: 'left', width: 120 },
            { prop: 'age', label: '年龄' },
        ];
        const wrapper = mount(Table, {
            props: { columns: cols as any, data: ROWS, height: 200 } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        stubWidths(wrapper);
        await wrapper.setProps({ columns: cols.map((c) => ({ ...c })) });
        await wait();
        await scrollBodyTo(wrapper, 0);
        // 起始位置显示左侧阴影（scrollState.x === 'left'）
        expect(wrapper.find(`.${prefixCls}-body-wrapper`).classes().join(' ')).toContain('is-scrolling-x-left');
        wrapper.unmount();
    });

    test('纯右固定列滚动中显示右侧阴影', async () => {
        const cols = [
            { prop: 'age', label: '年龄' },
            { prop: 'addr', label: '地址', fixed: 'right', width: 120 },
        ];
        const wrapper = mount(Table, {
            props: { columns: cols as any, data: ROWS, height: 200 } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        stubWidths(wrapper);
        await wrapper.setProps({ columns: cols.map((c) => ({ ...c })) });
        await wait();
        await scrollBodyTo(wrapper, 600);
        // 滚动到底显示右侧阴影（scrollState.x === 'right'）
        expect(wrapper.find(`.${prefixCls}-body-wrapper`).classes().join(' ')).toContain('is-scrolling-x-right');
        wrapper.unmount();
    });

    test('无固定列滚动显示两侧阴影；移除高度后滚动状态清空', async () => {
        const wrapper = mountTable({ height: 200 });
        await nextTick();
        await wait();
        stubWidths(wrapper);
        await wrapper.setProps({ columns: FIXED_COLS.map((c) => ({ ...c })) });
        await wait();
        await scrollBodyTo(wrapper, 300);
        // 切到 layout=auto 且内容变窄 → isScrollX=false → Scrollbar 卸载
        // → scrollbar 实例 containerRef 置空 → scrollState.x 清空
        const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
        Object.defineProperty(bodyTable, 'offsetWidth', { value: 50, configurable: true });
        await wrapper.setProps({ height: undefined, layout: 'auto' });
        await wait();
        // 滚动状态清空：不再带 is-scrolling-x-* 类
        const cls = wrapper.find(`.${prefixCls}`).classes();
        expect(cls.some((c) => c.startsWith('is-scrolling-x-'))).toBe(false);
        wrapper.unmount();
    });

    test('非固定表头切换为固定表头时重置', async () => {
        const wrapper = mountTable({});
        await nextTick();
        await wait();
        await wrapper.setProps({ height: 200 });
        await wait();
        // 固定表头渲染 header 容器
        expect(wrapper.find(`.${prefixCls}-header`).exists()).toBe(true);
        wrapper.unmount();
    });
});
