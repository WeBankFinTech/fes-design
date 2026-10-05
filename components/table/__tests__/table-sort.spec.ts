import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Table from '../table';
import { wait } from '../../_util/__tests__/helpers';

const makeData = () => [
    { id: 3, name: '王五', age: 30 },
    { id: 1, name: '张三', age: 20 },
    { id: 2, name: '李四', age: 25 },
];

const mountSortableTable = (columns: any[]) =>
    mount(Table, {
        props: {
            data: makeData(),
            rowKey: 'id',
            columns,
        },
        attachTo: document.body,
    });

describe('FTable 排序', () => {
    test('sorter=default ascend/descend 排序', async () => {
        const wrapper = mountSortableTable([
            { prop: 'age', label: '年龄', sortable: true, sorter: 'default' },
        ]);
        await nextTick();
        await wait();
        const th = wrapper.findAll('th').find((t) => t.text().includes('年龄'))!;
        // 第一次点击 → descend（sortDirections 默认 ['descend','ascend']）
        await th.trigger('click');
        await nextTick();
        await wait();
        const sortChange = wrapper.emitted('sortChange');
        expect(sortChange![0][0]).toMatchObject({ prop: 'age', order: 'descend' });
        // 第二次点击 → ascend
        await th.trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('sortChange')![1][0]).toMatchObject({
            prop: 'age',
            order: 'ascend',
        });
        // ascend 后首行应为最小年龄
        expect(wrapper.text()).toContain('20');
        wrapper.unmount();
    });

    test('自定义 sorter 函数', async () => {
        const wrapper = mountSortableTable([
            {
                prop: 'age',
                label: '年龄',
                sortable: true,
                sorter: (a: any, b: any) => a.age < b.age,
            },
        ]);
        await nextTick();
        await wait();
        const th = wrapper.findAll('th').find((t) => t.text().includes('年龄'))!;
        await th.trigger('click');
        await nextTick();
        expect(wrapper.emitted('sortChange')).toBeTruthy();
        wrapper.unmount();
    });

    test('expose sort 方法远程排序', async () => {
        const wrapper = mountSortableTable([
            { prop: 'age', label: '年龄', sortable: true, sorter: 'default' },
        ]);
        await nextTick();
        await wait();
        const vm: any = wrapper.vm;
        vm.sort('age', 'ascend');
        await nextTick();
        await wait();
        expect(wrapper.emitted('sortChange')).toBeTruthy();
        expect(wrapper.text()).toContain('20');
        wrapper.unmount();
    });

    test('expose clearSorter 清除排序', async () => {
        const wrapper = mountSortableTable([
            { prop: 'age', label: '年龄', sortable: true, sorter: 'default' },
        ]);
        await nextTick();
        await wait();
        const vm: any = wrapper.vm;
        vm.sort('age', 'descend');
        await nextTick();
        vm.clearSorter();
        await nextTick();
        const events = wrapper.emitted('sortChange')!;
        expect(events[events.length - 1][0]).toMatchObject({
            prop: undefined,
            order: undefined,
        });
        wrapper.unmount();
    });

    test('sortable=false 列点击不触发', async () => {
        const wrapper = mountSortableTable([
            { prop: 'age', label: '年龄' },
        ]);
        await nextTick();
        await wait();
        const th = wrapper.findAll('th').find((t) => t.text().includes('年龄'))!;
        await th.trigger('click');
        await nextTick();
        expect(wrapper.emitted('sortChange')).toBeUndefined();
        wrapper.unmount();
    });

    test('sortDirections 自定义顺序循环', async () => {
        const wrapper = mountSortableTable([
            {
                prop: 'age',
                label: '年龄',
                sortable: true,
                sorter: 'default',
                sortDirections: ['ascend'],
            },
        ]);
        await nextTick();
        const th = wrapper.findAll('th').find((t) => t.text().includes('年龄'))!;
        // 同步连点：ascend → false（取消）→ ascend 循环
        await th.trigger('click');
        await nextTick();
        const events1 = wrapper.emitted('sortChange')!;
        expect(events1[events1.length - 1][0]).toMatchObject({ order: 'ascend' });
        await th.trigger('click');
        await nextTick();
        const events2 = wrapper.emitted('sortChange')!;
        expect(events2[events2.length - 1][0]).toMatchObject({ order: false });
        await th.trigger('click');
        await nextTick();
        const events3 = wrapper.emitted('sortChange')!;
        expect(events3[events3.length - 1][0]).toMatchObject({ order: 'ascend' });
        wrapper.unmount();
    });
});
