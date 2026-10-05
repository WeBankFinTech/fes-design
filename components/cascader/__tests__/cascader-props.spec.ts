import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Cascader from '../cascader';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-cascader';

// 自定义字段名数据（childrenField/labelField/valueField）
const FIELD_DATA = [
    {
        id: 'gd1',
        title: '广东',
        subs: [
            { id: 'sz1', title: '深圳' },
            { id: 'gz1', title: '广州' },
        ],
    },
];

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

describe('FCascader 属性补全', () => {
    test('childrenField/labelField/valueField 自定义字段', async () => {
        const wrapper = mountCascader({
            data: FIELD_DATA,
            childrenField: 'subs',
            labelField: 'title',
            valueField: 'id',
        });
        await nextTick();
        await wait();
        expect(node(wrapper, 'gd1').exists()).toBe(true);
        expect(wrapper.text()).toContain('广东');
        // 展开子级
        await node(wrapper, 'gd1')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('click');
        await wait();
        expect(node(wrapper, 'sz1').exists()).toBe(true);
        wrapper.unmount();
    });

    test('emptyText 自定义空文案', async () => {
        const wrapper = mountCascader({ data: [], emptyText: '暂无地区' });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('暂无地区');
        wrapper.unmount();
    });

    test('默认空文案 暂无数据', async () => {
        const wrapper = mountCascader({ data: [] });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('暂无数据');
        wrapper.unmount();
    });

    test('emitPath=true 选中叶子返回选中 keys', async () => {
        const wrapper = mountCascader({
            selectable: true,
            emitPath: true,
        });
        await nextTick();
        await wait();
        // 先展开父级
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('click');
        await wait();
        await node(wrapper, 'sz')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        const updates = wrapper.emitted('update:selectedKeys');
        expect(updates).toBeTruthy();
        const last = updates![updates!.length - 1][0];
        expect(last).toContain('sz');
        wrapper.unmount();
    });

    test('disabled 节点点击无效', async () => {
        const wrapper = mountCascader({
            selectable: true,
            data: [
                { label: '湖南', value: 'hn', disabled: true },
            ],
        });
        await nextTick();
        await wait();
        expect(node(wrapper, 'hn').classes()).toContain('is-disabled');
        await node(wrapper, 'hn')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        expect(wrapper.emitted('select')).toBeUndefined();
        wrapper.unmount();
    });

    test('checkable 状态下 cascade=false 勾选独立', async () => {
        const wrapper = mountCascader({
            checkable: true,
            cascade: false,
            data,
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

    test('expandTrigger=hover 展开子级', async () => {
        const wrapper = mountCascader({
            expandTrigger: 'hover',
            data,
        });
        await nextTick();
        await wait();
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-content`)
            .trigger('mouseenter');
        await wait();
        expect(node(wrapper, 'sz').exists()).toBe(true);
        wrapper.unmount();
    });
});
