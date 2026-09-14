import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Table from '../table';

const DATA = [
    { id: 1, name: '张三', age: 20, city: '北京' },
    { id: 2, name: '李四', age: 25, city: '上海' },
    { id: 3, name: '王五', age: 30, city: '深圳' },
];

const COLUMNS = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },
];

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const mountTable = (props: Record<string, unknown> = {}) =>
    mount(Table, {
        props: {
            data: DATA,
            columns: COLUMNS,
            rowKey: 'id',
            ...props,
        },
        attachTo: document.body,
    });

describe('FTable 行事件', () => {
    test('rowClick 点击数据行触发并带行数据', async () => {
        const wrapper = mountTable();
        await nextTick();
        await wait();
        const rows = wrapper.findAll('tbody tr');
        await rows[1].find('td').trigger('click');
        await nextTick();
        const emitted = wrapper.emitted('rowClick');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toMatchObject({
            row: { id: 2, name: '李四' },
            rowIndex: 1,
        });
        expect(emitted![0][0].event).toBeInstanceOf(Event);
        wrapper.unmount();
    });

    test('cellClick 触发并带单元格信息', async () => {
        const wrapper = mountTable();
        await nextTick();
        await wait();
        const cells = wrapper.findAll('tbody td');
        // 第二行第二列
        await cells[3].trigger('click');
        await nextTick();
        const emitted = wrapper.emitted('cellClick');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toMatchObject({
            row: { id: 2 },
            cellValue: 25,
        });
        wrapper.unmount();
    });

    test('headerClick 点击表头触发', async () => {
        const wrapper = mountTable();
        await nextTick();
        await wait();
        const ths = wrapper.findAll('thead th');
        await ths[0].trigger('click');
        await nextTick();
        const emitted = wrapper.emitted('headerClick');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0].column.props).toMatchObject({ prop: 'name' });
        expect(emitted![0][0].event).toBeInstanceOf(Event);
        wrapper.unmount();
    });

    test('rowClick 的行数据与点击列匹配', async () => {
        const wrapper = mountTable();
        await nextTick();
        await wait();
        const rows = wrapper.findAll('tbody tr');
        await rows[2].trigger('click');
        await nextTick();
        const emitted = wrapper.emitted('rowClick');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toMatchObject({
            row: { id: 3, city: '深圳' },
            rowIndex: 2,
        });
        wrapper.unmount();
    });
});
