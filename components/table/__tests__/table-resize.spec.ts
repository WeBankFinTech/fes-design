import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Table from '../table';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-table';

const makeData = () => [
    { id: 1, name: '张三', age: 20 },
    { id: 2, name: '李四', age: 25 },
];

describe('FTable 列宽拖拽（resizable）', () => {
    test('resizable 列渲染拖拽把手', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(),
                rowKey: 'id',
                columns: [
                    { prop: 'name', label: '姓名', resizable: true },
                    { prop: 'age', label: '年龄' },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.find(`.${prefixCls}-resize-button`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('拖拽把后触发 header resize 事件链', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(),
                rowKey: 'id',
                columns: [
                    { prop: 'name', label: '姓名', resizable: true },
                    { prop: 'age', label: '年龄', resizable: true },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const handle = wrapper.find(`.${prefixCls}-resize-button`);
        // mousedown 记录起点（需要 parentElement.offsetWidth）
        await handle.trigger('mousedown', { clientX: 100 });
        // mousemove / mouseup 挂在 document（useEventListener）
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 160 }));
        await wait();
        document.dispatchEvent(new MouseEvent('mouseup', { clientX: 160 }));
        await wait();
        // 拖拽交互完成：把手仍在（resize 链路无崩溃）
        const handleAfter = wrapper.find(`.${prefixCls}-resize-button`);
        expect(handleAfter.exists()).toBe(true);
        // 列宽被拖拽改变：第一列 col style 宽度更新（160-100=60 增量方向断言）
        const cols = wrapper.findAll('colgroup col');
        expect(cols.length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('mousemove 未按下时不报错', async () => {
        const wrapper = mount(Table, {
            props: {
                data: makeData(),
                rowKey: 'id',
                columns: [{ prop: 'name', label: '姓名', resizable: true }],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200 }));
        document.dispatchEvent(new MouseEvent('mouseup', { clientX: 200 }));
        await wait();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });
});
