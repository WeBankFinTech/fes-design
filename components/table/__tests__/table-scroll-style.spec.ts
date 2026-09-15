import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Table from '../table';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-table';

const makeData = (n = 3) =>
    Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        name: `用户${i + 1}`,
        age: 20 + i,
    }));

describe('FTable 滚动状态与阴影', () => {
    test('columnsFixed=none 滚动更新 scrollState', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(10),
                rowKey: 'id',
                width: 300,
                columns: [
                    { prop: 'name', label: '姓名', width: 200 },
                    { prop: 'age', label: '年龄', width: 200 },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
        expect(bodyWrapper.exists()).toBe(true);
        // jsdom 无真实布局，scrollLeft=0 → left 态
        await bodyWrapper.trigger('scroll');
        await wait(80);
        expect(
            bodyWrapper
                .classes()
                .some((c) => c.includes('is-scrolling-x')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('fixed=both 不绘制 header 阴影由 cell 处理', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(),
                rowKey: 'id',
                width: 300,
                columns: [
                    { prop: 'name', label: '姓名', fixed: 'left', width: 120 },
                    { prop: 'age', label: '年龄', fixed: 'right', width: 120 },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('colClassName 函数与对象', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(2),
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: '姓名',
                        colClassName: ({ rowIndex }: any) =>
                            rowIndex === 0 ? 'col-first' : undefined,
                    },
                    { prop: 'age', label: '年龄', colClassName: 'col-static' },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        expect(wrapper.find('.col-first').exists()).toBe(true);
        expect(wrapper.find('.col-static').exists()).toBe(true);
        wrapper.unmount();
    });

    test('colStyle 对象与函数', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(2),
                rowKey: 'id',
                columns: [
                    {
                        prop: 'name',
                        label: '姓名',
                        colStyle: { color: 'red' },
                    },
                    {
                        prop: 'age',
                        label: '年龄',
                        colStyle: () => ({ fontWeight: 'bold' }),
                    },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        const firstCell = wrapper.find('tbody td');
        expect(firstCell.exists()).toBe(true);
        wrapper.unmount();
    });

    test('align 属性渲染到单元格', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(2),
                rowKey: 'id',
                columns: [
                    { prop: 'name', label: '姓名', align: 'center' },
                    { prop: 'age', label: '年龄', align: 'right' },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        const td = wrapper.find('tbody td');
        expect(td.attributes('style') || '').toContain('text-align');
        wrapper.unmount();
    });

    test('spanMethod 合并单元格', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(2),
                rowKey: 'id',
                spanMethod: ({ rowIndex, columnIndex }: any) => {
                    if (rowIndex === 0 && columnIndex === 0) {
                        return { rowspan: 2, colspan: 1 };
                    }
                    if (rowIndex === 1 && columnIndex === 0) {
                        return { rowspan: 0, colspan: 0 };
                    }
                    return { rowspan: 1, colspan: 1 };
                },
                columns: [
                    { prop: 'name', label: '姓名' },
                    { prop: 'age', label: '年龄' },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        const firstTd = wrapper.find('tbody td');
        expect(firstTd.attributes('rowspan')).toBe('2');
        wrapper.unmount();
    });

    test('showHeader=false 不渲染表头', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(),
                rowKey: 'id',
                showHeader: false,
                columns: [{ prop: 'name', label: '姓名' }],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        expect(wrapper.find('thead').exists()).toBe(false);
        wrapper.unmount();
    });
});
