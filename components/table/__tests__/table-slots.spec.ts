import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Table from '../table';
import { wait } from '../../_util/__tests__/helpers';

const DATA = [
    { id: 1, name: '张三', age: 20 },
    { id: 2, name: '李四', age: 25 },
];

describe('FTable 插槽', () => {
    test('column render 函数自定义单元格内容', async () => {
        const received: unknown[] = [];
        const wrapper = mount(Table, {
            props: {
                data: DATA,
                columns: [
                    {
                        prop: 'name',
                        label: '姓名',
                        render: ({ row }: any) => {
                            received.push(row);
                            return h('em', `自定义-${row.name}`);
                        },
                    },
                ],
                rowKey: 'id',
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('自定义-张三');
        expect(received[0]).toMatchObject({ id: 1 });
        wrapper.unmount();
    });

    test('renderHeader 函数自定义表头', async () => {
        const wrapper = mount(Table, {
            props: {
                data: DATA,
                columns: [
                    {
                        prop: 'name',
                        label: '姓名',
                        renderHeader: ({ column }: any) =>
                            h('span', `表头-${column?.props?.label ?? ''}`),
                    },
                ],
                rowKey: 'id',
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('表头-姓名');
        wrapper.unmount();
    });
});
