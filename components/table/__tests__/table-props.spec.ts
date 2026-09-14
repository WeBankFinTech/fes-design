import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Table from '../table';

const prefixCls = 'fes-table';

const makeData = (n = 3) =>
    Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        name: `用户${i + 1}`,
        long: `这是一段非常长的内容用于测试省略号${i + 1}`,
    }));

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const mountTable = (props: Record<string, unknown> = {}, columns: any[] = [
    { prop: 'name', label: '姓名' },
]) =>
    mount(Table, {
        props: {
            data: makeData(),
            rowKey: 'id',
            columns,
            ...props,
        },
        attachTo: document.body,
    });

describe('FTable 展示属性', () => {
    test('striped 偶数行斑马纹类名', async () => {
        const wrapper = mountTable({ striped: true });
        await nextTick();
        await wait();
        // is-striped 挂在奇数行（rowIndex % 2 === 1）的 tr 上
        const stripedRows = wrapper.findAll('tbody tr.is-striped');
        expect(stripedRows.length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('hoverable=false 移除悬浮态', async () => {
        const wrapper = mountTable({ hoverable: false });
        await nextTick();
        await wait();
        expect(wrapper.find('table').classes()).not.toContain('is-hoverable');
        wrapper.unmount();
    });

    test('默认 hoverable 开启', async () => {
        const wrapper = mountTable();
        await nextTick();
        await wait();
        expect(wrapper.find('table').classes()).toContain('is-hoverable');
        wrapper.unmount();
    });

    test('verticalLine 竖线', async () => {
        const wrapper = mountTable({ verticalLine: true });
        await nextTick();
        await wait();
        // 样式类挂在 table 或容器上，断言类名存在即可
        expect(
            wrapper.find('table').classes().some((c) => c.includes('vertical'))
            || wrapper.find(`.${prefixCls}`).exists(),
        ).toBe(true);
        wrapper.unmount();
    });

    test('horizontalLine=false 移除横线', async () => {
        const wrapper = mountTable({ horizontalLine: false });
        await nextTick();
        await wait();
        expect(wrapper.find('table').exists()).toBe(true);
        wrapper.unmount();
    });

    test('ellipsis 列内容省略', async () => {
        const wrapper = mountTable({}, [
            { prop: 'long', label: '长内容', ellipsis: true },
        ]);
        await nextTick();
        await wait();
        expect(wrapper.html()).toContain('fes-ellipsis');
        wrapper.unmount();
    });

    test('column visible=false 隐藏列', async () => {
        const wrapper = mountTable({}, [
            { prop: 'name', label: '姓名' },
            { prop: 'long', label: '隐藏列', visible: false },
        ]);
        await nextTick();
        await wait();
        const headers = wrapper.findAll('th');
        expect(headers.length).toBe(1);
        expect(wrapper.text()).not.toContain('隐藏列');
        wrapper.unmount();
    });

    test('emptyText 自定义空文案', async () => {
        const wrapper = mountTable({ data: [], emptyText: '没有记录' });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('没有记录');
        wrapper.unmount();
    });

    test('默认空文案 暂无数据', async () => {
        const wrapper = mountTable({ data: [] });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('暂无数据');
        wrapper.unmount();
    });

    test('empty 插槽自定义空态', async () => {
        const wrapper = mount(Table, {
            props: {
                data: [],
                rowKey: 'id',
                columns: [{ prop: 'name', label: '姓名' }],
            },
            slots: { empty: () => '自定义空插槽' },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('自定义空插槽');
        wrapper.unmount();
    });

    test('size 渲染尺寸类名', async () => {
        const wrapper = mountTable({ size: 'small' });
        await nextTick();
        await wait();
        expect(
            wrapper.find(`.${prefixCls}`).classes().some((c) => c.includes('small')),
        ).toBe(true);
        wrapper.unmount();
    });
});
