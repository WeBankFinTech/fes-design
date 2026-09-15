import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';
import Table from '../table';

// jsdom 未内置 ResizeObserver（虚拟/测量依赖）
if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = ResizeObserver;
}

const DATA = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    name: `名字${i}`,
    age: 18 + i,
}));

const SORT_COLUMNS = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄', sortable: true },
];

const SELECT_COLUMNS = [
    { type: 'selection', multiple: true },
    { prop: 'name', label: '姓名' },
];

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const mountTable = (props: Record<string, unknown> = {}) =>
    mount(Table, {
        props: {
            data: DATA,
            columns: props.columns || SORT_COLUMNS,
            rowKey: 'id',
            ...props,
        },
        attachTo: document.body,
    });

describe('FTable exposed 方法', () => {
    test('toggleRowSelection 勾选行并触发 selectionChange', async () => {
        const wrapper = mountTable({ columns: SELECT_COLUMNS });
        await nextTick();
        await wait();
        const table: any = wrapper;
        table.vm.toggleRowSelection({ row: DATA[1] });
        await wait();
        const emitted = wrapper.emitted('selectionChange');
        expect(emitted).toBeTruthy();
        wrapper.unmount();
    });

    test('clearSelection 清空勾选', async () => {
        const wrapper = mountTable({ columns: SELECT_COLUMNS });
        await nextTick();
        await wait();
        const table: any = wrapper;
        table.vm.toggleRowSelection({ row: DATA[0] });
        await wait();
        table.vm.clearSelection();
        await wait();
        // clearSelection 后再全选，确认旧选择已被清空（不残留 DATA[0]）
        table.vm.toggleAllSelection();
        await wait();
        const emitted = wrapper.emitted('selectionChange');
        expect(emitted).toBeTruthy();
        const last = emitted![emitted!.length - 1][0] as { id: number }[];
        expect(last.some((r) => r.id === 0)).toBe(false);
        wrapper.unmount();
    });

    test('toggleAllSelection 全选/全不选', async () => {
        const wrapper = mountTable({ columns: SELECT_COLUMNS });
        await nextTick();
        await wait();
        const table: any = wrapper;
        table.vm.toggleAllSelection();
        await wait();
        const table2: any = wrapper;
        table2.vm.toggleAllSelection();
        await wait();
        const emitted = wrapper.emitted('selectionChange');
        expect(emitted!.length).toBeGreaterThanOrEqual(2);
        wrapper.unmount();
    });

    test('sort 方法编程排序并触发 sortChange', async () => {
        const wrapper = mountTable();
        await nextTick();
        await wait();
        const table: any = wrapper;
        table.vm.sort('age', 'descend');
        await wait();
        const emitted = wrapper.emitted('sortChange');
        expect(emitted).toBeTruthy();
        // 降序后第一行是最大 age
        const firstRow = wrapper.findAll('tbody tr')[0];
        expect(firstRow.text()).toContain(`${18 + DATA.length - 1}`);
        wrapper.unmount();
    });

    test('clearSorter 重置排序', async () => {
        const wrapper = mountTable();
        await nextTick();
        await wait();
        const table: any = wrapper;
        table.vm.sort('age', 'descend');
        await wait();
        table.vm.clearSorter();
        await wait();
        // 重置后恢复原始顺序
        const firstRow = wrapper.findAll('tbody tr')[0];
        expect(firstRow.text()).toContain('名字0');
        wrapper.unmount();
    });
});
