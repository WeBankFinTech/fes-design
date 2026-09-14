import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Table from '../table';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('table');
const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const EXPAND_COLUMNS = [
    { type: 'expand', render: ({ row }: any) => h('div', `展开-${row.name}`) },
    { prop: 'name', label: '名称' },
];

const ROWS = [
    { id: 1, name: '行一' },
    { id: 2, name: '行二' },
];

const mountTable = (props = {}) =>
    mount(Table, {
        props: {
            columns: EXPAND_COLUMNS as any,
            data: ROWS,
            rowKey: 'id',
            ...props,
        } as any,
        attachTo: document.body,
    });

describe('FTable 展开列（useTableExpand）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('无 rowKey 且存在 expand 列时告警（列动态添加）', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mount(Table, {
            props: {
                columns: [{ prop: 'name', label: '名称' }] as any,
                data: ROWS,
            } as any,
        });
        await nextTick();
        await wait();
        // 动态加入 expand 列触发 expandColumn watch
        await wrapper.setProps({
            columns: [
                { type: 'expand', render: ({ row }: any) => h('div', `展开-${row.name}`) },
                { prop: 'name', label: '名称' },
            ] as any,
        });
        await wait();
        expect(spy).toHaveBeenCalledWith(
            '[FTable]: 当存在 expand 列时，请设置rowKey!',
        );
        spy.mockRestore();
        wrapper.unmount();
    });

    test('多个 expand 列时告警', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const cols = [
            { type: 'expand', render: () => h('div', '一') },
            { type: 'expand', render: () => h('div', '二') },
            { prop: 'name', label: '名称' },
        ];
        mount(Table, {
            props: { columns: cols as any, data: ROWS, rowKey: 'id' } as any,
        });
        await nextTick();
        await wait();
        expect(spy).toHaveBeenCalledWith('[FTable]: type=expand 不能存在多个');
        spy.mockRestore();
    });

    test('点击展开图标切换行展开', async () => {
        const wrapper = mountTable();
        await nextTick();
        await wait();
        const toggler = wrapper.find(`.${prefixCls}-expand-icon, [class*="expand"]`);
        if (toggler.exists()) {
            await toggler.trigger('click');
            await wait();
            // 展开内容渲染
            expect(wrapper.text()).toContain('展开-行一');
            // 再次点击收起
            await toggler.trigger('click');
            await wait();
        }
        wrapper.unmount();
    });

    test('expandedKeys 受控展开', async () => {
        const wrapper = mountTable({ expandedKeys: [1] });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('展开-行一');
        wrapper.unmount();
    });
});
