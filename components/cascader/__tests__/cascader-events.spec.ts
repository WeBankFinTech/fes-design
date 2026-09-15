import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Cascader from '../cascader';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-cascader';

const data = [
    {
        label: '广东',
        value: 'gd',
        children: [
            { label: '深圳', value: 'sz' },
            { label: '广州', value: 'gz' },
        ],
    },
    { label: '湖南', value: 'hn' },
];

const mountCascader = (props: Record<string, unknown> = {}) =>
    mount(Cascader, {
        props: { data, ...props },
        attachTo: document.body,
    });

const node = (wrapper: any, value: string) =>
    wrapper.find(`.${prefixCls}-node[data-value='${value}']`);

describe('FCascader select 事件', () => {
    test('单选点击叶子节点触发 select', async () => {
        const wrapper = mountCascader({ selectable: true });
        await nextTick();
        await wait();
        await node(wrapper, 'hn').find(`.${prefixCls}-node-content`).trigger('click');
        await nextTick();
        const events = wrapper.emitted('select');
        expect(events![0][0]).toMatchObject({ selectedKeys: ['hn'], selected: true });
        wrapper.unmount();
    });

    test('cancelable 点击已选节点取消', async () => {
        const wrapper = mountCascader({
            selectable: true,
            selectedKeys: ['hn'],
            cancelable: true,
        });
        await nextTick();
        await wait();
        await node(wrapper, 'hn').find(`.${prefixCls}-node-content`).trigger('click');
        await nextTick();
        const events = wrapper.emitted('select');
        expect(events![events!.length - 1][0]).toMatchObject({ selectedKeys: [] });
        wrapper.unmount();
    });

    test('cancelable=false 不可取消', async () => {
        const wrapper = mountCascader({
            selectable: true,
            modelValue: 'hn',
            cancelable: false,
        });
        await nextTick();
        await wait();
        await node(wrapper, 'hn').find(`.${prefixCls}-node-content`).trigger('click');
        await nextTick();
        const events = wrapper.emitted('select');
        expect(events![events!.length - 1][0]).toMatchObject({ selectedKeys: ['hn'] });
        wrapper.unmount();
    });

    test('multiple 模式 select 累加', async () => {
        const wrapper = mount(Cascader, {
            props: {
                data: [{ label: '湖南', value: 'hn' }, { label: '河南', value: 'he' }],
                selectable: true,
                multiple: true,
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        await node(wrapper, 'hn').find(`.${prefixCls}-node-content`).trigger('click');
        await nextTick();
        await wait(30);
        await node(wrapper, 'he').find(`.${prefixCls}-node-content`).trigger('click');
        await nextTick();
        const events = wrapper.emitted('select');
        expect(events!.length).toBe(2);
        expect(events![1][0]).toMatchObject({ selectedKeys: ['hn', 'he'] });
        wrapper.unmount();
    });

    test('selectable=false 点击无效', async () => {
        const wrapper = mountCascader({ selectable: false });
        await nextTick();
        await wait();
        await node(wrapper, 'hn').find(`.${prefixCls}-node-content`).trigger('click');
        await nextTick();
        expect(wrapper.emitted('select')).toBeUndefined();
        wrapper.unmount();
    });

    test('expose selectNode/expandNode 方法', async () => {
        const wrapper = mountCascader({ selectable: true });
        await nextTick();
        await wait();
        const vm: any = wrapper.vm;
        expect(typeof vm.selectNode).toBe('function');
        vm.selectNode('hn');
        await nextTick();
        expect(wrapper.emitted('select')).toBeTruthy();
        expect(typeof vm.expandNode).toBe('function');
        vm.expandNode('gd');
        await nextTick();
        expect(wrapper.emitted('expand')).toBeTruthy();
        wrapper.unmount();
    });
});

describe('FCascader check 事件', () => {
    test('multiple + cascade 勾父级联动子级', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
        });
        await nextTick();
        await wait();
        const gd = node(wrapper, 'gd');
        await gd.find(`.${prefixCls}-node-checkbox .fes-checkbox`).trigger('click');
        await nextTick();
        const events = wrapper.emitted('check');
        expect(events).toBeTruthy();
        const payload = events![0][0] as any;
        // 默认 checkStrictly=child：仅叶子节点入 keys
        expect(payload.checkedKeys).toContain('sz');
        expect(payload.checkedKeys).toContain('gz');
        expect(payload.checkedKeys).not.toContain('gd');
        expect(payload.checked).toBe(true);
        wrapper.unmount();
    });

    test('cascade + checkStrictly=child 仅叶子入 keys', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkStrictly: 'child',
            checkable: true,
        });
        await nextTick();
        await wait();
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        const payload = wrapper.emitted('check')![0][0] as any;
        expect(payload.checkedKeys).toContain('sz');
        expect(payload.checkedKeys).not.toContain('gd');
        wrapper.unmount();
    });

    test('cascade + checkStrictly=parent 仅父级入 keys', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkStrictly: 'parent',
            checkable: true,
        });
        await nextTick();
        await wait();
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        const payload = wrapper.emitted('check')![0][0] as any;
        expect(payload.checkedKeys).toContain('gd');
        expect(payload.checkedKeys).not.toContain('sz');
        wrapper.unmount();
    });

    test('无 cascade 勾选不联动', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: false,
            checkable: true,
        });
        await nextTick();
        await wait();
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        const payload = wrapper.emitted('check')![0][0] as any;
        expect(payload.checkedKeys).toEqual(['gd']);
        wrapper.unmount();
    });

    test('再次点击取消勾选', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: false,
            checkable: true,
        });
        await nextTick();
        await wait();
        await node(wrapper, 'hn')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        await node(wrapper, 'hn')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        const events = wrapper.emitted('check');
        expect(events![events!.length - 1][0]).toMatchObject({ checkedKeys: [] });
        wrapper.unmount();
    });
});
