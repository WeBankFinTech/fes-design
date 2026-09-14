import { mount } from '@vue/test-utils';
import { Fragment, defineComponent, h, nextTick } from 'vue';
import Table from '../table';
import FTableColumn from '../column';

const DATA = [
    { id: 1, name: '张三', age: 20 },
    { id: 2, name: '李四', age: 25 },
];

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

// 子列须直接是 FTableColumn 子节点（column.tsx render 收集 children）
const NestedTable = defineComponent({
    setup() {
        return () =>
            h(Table, { data: DATA, rowKey: 'id' }, {
                default: () => [
                    h(FTableColumn, { prop: 'name', label: '姓名' }),
                    h(
                        FTableColumn,
                        { label: '分组列头' },
                        {
                            default: () => [
                                h(FTableColumn, { prop: 'age', label: '年龄' }),
                            ],
                        },
                    ),
                ],
            });
    },
});

describe('FTableColumn 列定义方式', () => {
    test('template 列（FTableColumn 子组件）注册并渲染', async () => {
        const wrapper = mount(NestedTable);
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('张三');
        expect(wrapper.text()).toContain('20');
        wrapper.unmount();
    });

    test('嵌套 children 生成分组表头（两级表头）', async () => {
        const wrapper = mount(NestedTable);
        await nextTick();
        await wait();
        const headerRows = wrapper.findAll('thead tr');
        // 分组列头：两行表头
        expect(headerRows.length).toBe(2);
        expect(wrapper.text()).toContain('分组列头');
        wrapper.unmount();
    });

    test('action 列渲染操作按钮并触发回调', async () => {
        const called: number[] = [];
        const wrapper = mount(Table, {
            props: {
                data: DATA,
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: '姓名',
                        action: {
                            label: '编辑',
                            func: (row: any) => called.push(row.id),
                        },
                    },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('编辑');
        const actionBtn = wrapper
            .findAll('button')
            .find((b) => b.text() === '编辑');
        await actionBtn!.trigger('click');
        await wait();
        expect(called).toEqual([1]);
        wrapper.unmount();
    });

    test('action 数组渲染多个操作按钮', async () => {
        const called: string[] = [];
        const wrapper = mount(Table, {
            props: {
                data: DATA,
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: '姓名',
                        action: [
                            { label: '编辑', func: () => called.push('edit') },
                            { label: '删除', func: () => called.push('del') },
                        ],
                    },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('编辑');
        expect(wrapper.text()).toContain('删除');
        const delBtn = wrapper
            .findAll('button')
            .find((b) => b.text() === '删除');
        await delBtn!.trigger('click');
        await wait();
        expect(called).toEqual(['del']);
        wrapper.unmount();
    });

    test('action 缺 label 的项被过滤', async () => {
        const wrapper = mount(Table, {
            props: {
                data: DATA,
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: '姓名',
                        action: [
                            { label: '', func: () => {} },
                            { label: '有效', func: () => {} },
                        ] as any,
                    },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('有效');
        // 空label的按钮不渲染
        const btns = wrapper
            .findAll('button')
            .filter((b) => b.text().trim() === '');
        expect(btns.length).toBe(0);
        wrapper.unmount();
    });

    test('formatter 格式化单元格值', async () => {
        const wrapper = mount(Table, {
            props: {
                data: DATA,
                rowKey: 'id',
                columns: [
                    {
                        prop: 'age',
                        label: '年龄',
                        formatter: ({ cellValue }: any) => `${cellValue}岁`,
                    },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('20岁');
        wrapper.unmount();
    });

    test('selectable 函数拦截选择列', async () => {
        const wrapper = mount(Table, {
            props: {
                data: DATA,
                rowKey: 'id',
                columns: [
                    {
                        type: 'selection',
                        selectable: ({ row }: any) => row.id !== 1,
                    },
                    { prop: 'name', label: '姓名' },
                ] as any,
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // 第一行 checkbox 禁用
        const disabled = wrapper
            .findAll('.fes-checkbox')
            .filter((c) => c.classes().some((cl) => cl.includes('disabled')));
        expect(disabled.length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('template 中 Fragment 包裹的列被展开收集', async () => {
        // v-if/template 场景 default slot 返回 Fragment vnode（shapeFlag=16），
        // column.tsx 走 shapeFlag!==36 分支收进 children
        const wrapper = mount(defineComponent({
            setup() {
                return () =>
                    h(Table, { data: DATA, rowKey: 'id' }, {
                        default: () =>
                            h(Fragment, {}, [
                                h(FTableColumn, { key: 'name', prop: 'name', label: '姓名' }),
                                h(FTableColumn, { key: 'age', prop: 'age', label: '年龄' }),
                            ]),
                    });
            },
        }));
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('张三');
        expect(wrapper.text()).toContain('20');
        const ths = wrapper.findAll('thead th');
        expect(ths.length).toBe(2);
        wrapper.unmount();
    });

    test('非列子节点（普通元素/组件）不影响列收集', async () => {
        const Child = defineComponent({ name: 'Other', setup: () => () => h('i', 'x') });
        const wrapper = mount(defineComponent({
            setup() {
                return () =>
                    h(Table, { data: DATA, rowKey: 'id' }, {
                        default: () => [
                            h(FTableColumn, { prop: 'name', label: '姓名' }),
                            h(Child),
                            h('span', '普通子节点'),
                        ],
                    });
            },
        }));
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('张三');
        expect(wrapper.text()).toContain('普通子节点');
        wrapper.unmount();
    });

    test('FTableColumn 脱离 Table 使用时告警', async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mount(defineComponent({ setup: () => () => h(FTableColumn, { prop: 'a' }) }));
        await nextTick();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
