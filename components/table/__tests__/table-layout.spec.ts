import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import type { ResizeObserver } from '@juggle/resize-observer';
import Table from '../table';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('table');

// jsdom 无布局引擎：mock RO 同步派发，让 useResize 的 computeX/computeY 执行
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

const COLS = [
    { prop: 'name', label: '名称' },
    { prop: 'age', label: '年龄' },
];

const ROWS = [
    { id: 1, name: '一', age: 10 },
    { id: 2, name: '二', age: 20 },
];

const mountTable = (props = {}, cols = COLS) =>
    mount(Table, {
        props: { columns: cols as any, data: ROWS, ...props } as any,
        attachTo: document.body,
    });

const stubWidths = (wrapper: any) => {
    // wrapper 即根 .fes-table；bodyTable 即 <table class="fes-table-body">
    const wrapperEl = wrapper.find(`.${prefixCls}`).element;
    Object.defineProperty(wrapperEl, 'offsetWidth', { value: 800 });
    const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
    Object.defineProperty(bodyTable, 'offsetWidth', { value: 500 });
};

describe('FTable 布局宽度分配（useTableLayout）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('layout=auto：width/minWidth/selection 列宽分支', async () => {
        const cols = [
            { prop: 'name', label: '名称', width: 150 },
            { prop: 'age', label: '年龄', minWidth: 80 },
            { type: 'selection' },
        ];
        const wrapper = mountTable({ layout: 'auto' }, cols);
        await nextTick();
        await wait();
        stubWidths(wrapper);
        // 触发 watch [columns] 重算
        await wrapper.setProps({ columns: cols.map((c) => ({ ...c })) });
        await wait();
        expect(wrapper.findAll(`.${prefixCls}-row`).length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('layout=auto：无宽度列按 min 收集', async () => {
        const wrapper = mountTable({ layout: 'auto' });
        await nextTick();
        await wait();
        stubWidths(wrapper);
        await wrapper.setProps({ columns: COLS.map((c) => ({ ...c })) });
        await wait();
        // auto 布局：原生 table 渲染，th 与 colgroup 直接位于 body 表格内
        const ths = wrapper.findAll('th');
        expect(ths.length).toBe(2);
        expect(wrapper.find('colgroup').exists()).toBe(true);
        wrapper.unmount();
    });

    test('固定高度：wrapper 足够宽时分配 additionalWidth', async () => {
        const cols = [
            { prop: 'name', label: '名称', width: 120 },
            { prop: 'age', label: '年龄' },
            { prop: 'addr', label: '地址', minWidth: 60 },
        ];
        const wrapper = mountTable({ height: 200 }, cols);
        await nextTick();
        await wait();
        stubWidths(wrapper);
        // 触发重算进入 bodyMinWidth < wrapperWidth 分支
        await wrapper.setProps({ columns: cols.map((c) => ({ ...c })) });
        await wait();
        expect(wrapper.text()).toContain('一');
        wrapper.unmount();
    });

    test('固定高度：单 min 列占据末位分配', async () => {
        const cols = [
            { prop: 'name', label: '名称', width: 100 },
            { prop: 'age', label: '年龄' },
        ];
        const wrapper = mountTable({ height: 200 }, cols);
        await nextTick();
        await wait();
        stubWidths(wrapper);
        await wrapper.setProps({ columns: cols.map((c) => ({ ...c })) });
        await wait();
        // 固定宽度列的宽度落在 colgroup 的 col 上（jsdom 无布局引擎）
        const colEls = wrapper.findAll(`.${prefixCls}-header colgroup col`);
        expect(colEls.length).toBe(2);
        expect(colEls[0].attributes('style') || '').toContain('width: 100px');
        wrapper.unmount();
    });

    test('bordered 影响有效宽度计算', async () => {
        const wrapper = mountTable({ height: 200, bordered: true });
        await nextTick();
        await wait();
        stubWidths(wrapper);
        await wrapper.setProps({ columns: COLS.map((c) => ({ ...c })) });
        await wait();
        // bordered 表格带边框类名且列头正常渲染
        expect(wrapper.find(`.${prefixCls}`).classes()).toContain('is-bordered');
        expect(wrapper.findAll(`.${prefixCls}-header th`).length).toBe(2);
        wrapper.unmount();
    });
});
