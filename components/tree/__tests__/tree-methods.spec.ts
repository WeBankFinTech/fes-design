import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tree from '../tree';

const TREE_DATA = [
    {
        title: '节点1',
        value: 'n1',
        children: [
            { title: '节点1-1', value: 'n1-1' },
            { title: '节点1-2', value: 'n1-2' },
        ],
    },
    { title: '节点2', value: 'n2' },
];

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const mountTree = (props: Record<string, unknown> = {}) =>
    mount(Tree, {
        props: {
            data: TREE_DATA,
            ...props,
        },
        attachTo: document.body,
    });

describe('FTree exposed 方法', () => {
    test('selectNode 编程选中节点', async () => {
        const wrapper = mountTree();
        await nextTick();
        await wait();
        const tree: any = wrapper;
        tree.vm.selectNode('n2', new MouseEvent('click'));
        await wait();
        const emitted = wrapper.emitted('update:selectedKeys');
        expect(emitted![emitted!.length - 1][0]).toContain('n2');
        wrapper.unmount();
    });

    test('expandNode 编程展开节点', async () => {
        const wrapper = mountTree();
        await nextTick();
        await wait();
        const tree: any = wrapper;
        tree.vm.expandNode('n1', new MouseEvent('click'));
        await wait();
        const emitted = wrapper.emitted('update:expandedKeys');
        expect(emitted![emitted!.length - 1][0]).toContain('n1');
        wrapper.unmount();
    });

    test('checkNode 编程勾选节点', async () => {
        const wrapper = mountTree({ checkable: true });
        await nextTick();
        await wait();
        const tree: any = wrapper;
        tree.vm.checkNode('n1-1', new MouseEvent('click'));
        await wait();
        const emitted = wrapper.emitted('update:checkedKeys');
        expect(emitted).toBeTruthy();
        wrapper.unmount();
    });

    test('filter 方法过滤节点', async () => {
        const wrapper = mountTree();
        await nextTick();
        await wait();
        const tree: any = wrapper;
        tree.vm.filter('节点2');
        await wait();
        // 过滤后仅显示匹配节点
        const nodes = wrapper.findAll('[class*="tree-node"]');
        const text = nodes.map((n) => n.text()).join('|');
        expect(text).not.toContain('节点1-1');
        wrapper.unmount();
    });
});
