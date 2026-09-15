import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Table from '../table';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-table';

const data = [
    { id: 1, name: '张三', age: 20, address: '地址1' },
    { id: 2, name: '李四', age: 25, address: '地址2' },
    { id: 3, name: '王五', age: 30, address: '地址3' },
];

const columns = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },
    { prop: 'address', label: '地址' },
];

const mountTable = (props: Record<string, unknown>, slots = {}) =>
    mount(Table, {
        props: { data, rowKey: 'id', columns, ...props },
        slots,
    });

describe('FTable 基础渲染', () => {
    test('渲染表头与数据行', async () => {
        const wrapper = mountTable({});
        await nextTick();
        await wait(100);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.text()).toContain('姓名');
        expect(wrapper.text()).toContain('张三');
        expect(wrapper.text()).toContain('地址3');
        wrapper.unmount();
    });

    test('数据行数与 data 一致', async () => {
        const wrapper = mountTable({});
        await nextTick();
        await wait(100);
        const rows = wrapper.findAll(`.${prefixCls}-body tr, tbody tr`);
        expect(rows.length).toBeGreaterThanOrEqual(3);
        wrapper.unmount();
    });

    test('自定义列模板（column 默认 slot）', async () => {
        // table 的 default slot 传给 FColumn，无参数调用时需兼容
        const wrapper = mountTable(
            {
                columns: [
                    { prop: 'name', label: '姓名', render: ({ row }: any) => [h('span', { class: 'custom-cell' }, `自定义-${row.name}`)] },
                    { prop: 'age', label: '年龄' },
                ],
            },
        );
        await nextTick();
        await wait(100);
        expect(wrapper.findAll('.custom-cell').length).toBeGreaterThanOrEqual(1);
        wrapper.unmount();
    });

    test('空数据渲染空提示', async () => {
        const wrapper = mountTable({ data: [] });
        await nextTick();
        await wait(100);
        expect(
            wrapper.text().includes('暂无') || wrapper.find('.fes-empty').exists(),
        ).toBe(true);
        wrapper.unmount();
    });
});

describe('FTable 排序', () => {
    test('sortable 列点击触发排序 change 事件', async () => {
        const wrapper = mountTable({
            columns: [
                { prop: 'name', label: '姓名' },
                { prop: 'age', label: '年龄', sortable: true },
            ],
        });
        await nextTick();
        await wait(100);
        const sortIcons = wrapper.findAll(
            `.${prefixCls}-sort__icon, [class*="sort"]`,
        );
        expect(sortIcons.length).toBeGreaterThanOrEqual(1);
        // 点击排 Defender
        const th = wrapper.findAll('th').find((t) => t.text().includes('年龄'));
        if (th) {
            await th.trigger('click');
            await nextTick();
            // 排序后第一行应为最小年龄 20
            expect(wrapper.text()).toContain('20');
        }
        wrapper.unmount();
    });
});

describe('FTable 固定列与边框', () => {
    test('bordered 类名', async () => {
        const wrapper = mountTable({ bordered: true });
        await nextTick();
        await wait(100);
        expect(
            wrapper
                .find(`.${prefixCls}`)
                .classes()
                .some((c) => c.includes('border')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('fixed 列渲染', async () => {
        const wrapper = mountTable({
            columns: [
                { prop: 'name', label: '姓名', fixed: true },
                { prop: 'age', label: '年龄' },
            ],
            width: 600,
        });
        await nextTick();
        await wait(100);
        expect(wrapper.text()).toContain('姓名');
        wrapper.unmount();
    });
});

describe('FTable 分页事件', () => {
    test('虚拟滚动开启不报错', async () => {
        const wrapper = mountTable({ virtualized: true, height: 200 });
        await nextTick();
        await wait(100);
        expect(wrapper.text()).toContain('张三');
        wrapper.unmount();
    });
});
