import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tree from '../tree';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-tree';

const data = [
    {
        label: '根节点1',
        value: 'n1',
        children: [
            { label: '子节点1-1', value: 'n1-1' },
            {
                label: '子节点1-2',
                value: 'n1-2',
                children: [{ label: '孙节点1-2-1', value: 'n1-2-1' }],
            },
        ],
    },
    {
        label: '根节点2',
        value: 'n2',
        children: [{ label: '子节点2-1', value: 'n2-1' }],
    },
];

// 自定义字段名
const FIELD_DATA = [
    {
        title: '自定义根',
        key: 'r1',
        subs: [{ title: '自定义子', key: 'r1-1' }],
    },
];

const mountTree = (props: Record<string, unknown> = {}) =>
    mount(Tree, {
        props: { data, ...props },
        attachTo: document.body,
    });

const node = (wrapper: any, value: string) =>
    wrapper.find(`.${prefixCls}-node[data-value='${value}']`);

const expand = async (wrapper: any, value: string) => {
    await node(wrapper, value)
        .find(`.${prefixCls}-node-switcher`)
        .trigger('click');
    await wait(100);
};

describe('FTree 属性补全', () => {
    test('accordion 手风琴：同级互斥展开', async () => {
        const wrapper = mountTree({ accordion: true });
        await nextTick();
        await wait(100);
        await expand(wrapper, 'n1');
        expect(node(wrapper, 'n1-1').exists()).toBe(true);
        await expand(wrapper, 'n2');
        await wait(100);
        // n1 展开时展开 n2，n1 应被收起
        expect(node(wrapper, 'n2-1').exists()).toBe(true);
        expect(node(wrapper, 'n1-1').exists()).toBe(false);
        wrapper.unmount();
    });

    test('非 accordion 同级可同时展开', async () => {
        const wrapper = mountTree();
        await nextTick();
        await wait(100);
        await expand(wrapper, 'n1');
        await expand(wrapper, 'n2');
        expect(node(wrapper, 'n1-1').exists()).toBe(true);
        expect(node(wrapper, 'n2-1').exists()).toBe(true);
        wrapper.unmount();
    });

    test('multiple=true 支持多选 selectedKeys 数组', async () => {
        const wrapper = mountTree({ multiple: true, selectable: true });
        await nextTick();
        await wait(100);
        await node(wrapper, 'n2')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        expect(wrapper.emitted('select')).toBeTruthy();
        const payload = wrapper.emitted('select')![0][0] as any;
        expect(Array.isArray(payload.selectedKeys)).toBe(true);
        wrapper.unmount();
    });

    test('cancelable=false 选中后不可取消', async () => {
        const wrapper = mountTree({
            selectable: true,
            cancelable: false,
            selectedKeys: ['n2'],
        });
        await nextTick();
        await wait(100);
        expect(node(wrapper, 'n2').classes()).toContain('is-selected');
        await node(wrapper, 'n2')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        const payload = wrapper.emitted('select')![0][0] as any;
        expect(payload.selectedKeys).toContain('n2');
        wrapper.unmount();
    });

    test('selectedKeys 初始选中回显', async () => {
        const wrapper = mountTree({ selectable: true, selectedKeys: ['n2'] });
        await nextTick();
        await wait(100);
        expect(node(wrapper, 'n2').classes()).toContain('is-selected');
        wrapper.unmount();
    });

    test('childrenField/labelField/valueField 自定义字段', async () => {
        const wrapper = mountTree({
            data: FIELD_DATA,
            childrenField: 'subs',
            labelField: 'title',
            valueField: 'key',
        });
        await nextTick();
        await wait(100);
        expect(node(wrapper, 'r1').exists()).toBe(true);
        expect(wrapper.text()).toContain('自定义根');
        await expand(wrapper, 'r1');
        expect(node(wrapper, 'r1-1').exists()).toBe(true);
        wrapper.unmount();
    });

    test('defaultExpandedKeys 初始展开指定节点', async () => {
        const wrapper = mountTree({ expandedKeys: ['n1'] });
        await nextTick();
        await wait(100);
        expect(node(wrapper, 'n1-1').exists()).toBe(true);
        wrapper.unmount();
    });

    test('isLeaf 指定叶子节点无展开按钮', async () => {
        const wrapper = mountTree({
            data: [{ label: '配置叶子', value: 'lf', isLeaf: true }],
        });
        await nextTick();
        await wait(100);
        const n = node(wrapper, 'lf');
        expect(n.exists()).toBe(true);
        // 叶子节点 switcher 不可见或无箭头
        const switcherIcon = n.find(`.${prefixCls}-node-switcher-icon`);
        expect(
            !switcherIcon.exists() || switcherIcon.classes().some((c) => c.includes('hidden')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('expand 展开事件携带 expandedKeys', async () => {
        const wrapper = mountTree();
        await nextTick();
        await wait(100);
        await expand(wrapper, 'n1');
        const events = wrapper.emitted('expand');
        expect(events).toBeTruthy();
        const payload = events![events!.length - 1][0] as any;
        expect(payload.expandedKeys).toContain('n1');
        expect(payload.expanded).toBe(true);
        wrapper.unmount();
    });
});
