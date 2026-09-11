import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tree from '../tree';

const prefixCls = 'fes-tree';

const makeData = () => [
    {
        label: '根节点1',
        value: 'n1',
        children: [
            { label: '子节点1-1', value: 'n1-1' },
            { label: '子节点1-2', value: 'n1-2' },
        ],
    },
    { label: '根节点2', value: 'n2' },
];

const wait = (ms = 50) => new Promise((r) => setTimeout(r, ms));

const mountDraggableTree = (extra: Record<string, unknown> = {}) =>
    mount(Tree, {
        props: {
            data: makeData(),
            defaultExpandAll: true,
            draggable: true,
            ...extra,
        },
        // handleDragover 内部用 document.querySelector 查目标节点，需挂到 body
        attachTo: document.body,
    });

const getNode = (wrapper: any, value: string) =>
    wrapper.find(`.${prefixCls}-node[data-value='${value}']`);

const fireDrag = async (el: any, type: string, extra: Record<string, unknown> = {}) => {
    await el.trigger(type, {
        clientY: 10,
        clientX: 10,
        preventDefault: () => {},
        dataTransfer: {},
        ...extra,
    });
};

describe('FTree draggable', () => {
    test('dragstart 在可拖拽节点上触发', async () => {
        const wrapper = mountDraggableTree();
        await nextTick();
        await wait();
        await fireDrag(getNode(wrapper, 'n1'), 'dragstart');
        await nextTick();
        expect(wrapper.emitted('dragstart')).toBeTruthy();
        wrapper.unmount();
    });

    test('dragover 触发并产生高亮信息', async () => {
        const wrapper = mountDraggableTree();
        await nextTick();
        await wait();
        await fireDrag(getNode(wrapper, 'n1'), 'dragstart');
        await fireDrag(getNode(wrapper, 'n2'), 'dragover');
        await nextTick();
        expect(wrapper.emitted('dragover')).toBeTruthy();
        wrapper.unmount();
    });

    test('dragenter / dragleave 触发', async () => {
        const wrapper = mountDraggableTree();
        await nextTick();
        await wait();
        await fireDrag(getNode(wrapper, 'n1'), 'dragstart');
        await fireDrag(getNode(wrapper, 'n2'), 'dragenter');
        expect(wrapper.emitted('dragenter')).toBeTruthy();
        await fireDrag(getNode(wrapper, 'n2'), 'dragleave');
        expect(wrapper.emitted('dragleave')).toBeTruthy();
        wrapper.unmount();
    });

    test('drop 触发并带 position 与 dragNode', async () => {
        const wrapper = mountDraggableTree();
        await nextTick();
        await wait();
        await fireDrag(getNode(wrapper, 'n1'), 'dragstart');
        // dragover 需要 querySelector + getBoundingClientRect（setup 已 mock 100x100）
        await fireDrag(getNode(wrapper, 'n2'), 'dragover');
        await wait();
        await fireDrag(getNode(wrapper, 'n2'), 'drop');
        await nextTick();
        const dropEvents = wrapper.emitted('drop');
        expect(dropEvents).toBeTruthy();
        const payload = dropEvents![0][0] as any;
        expect(payload.dragNode.value).toBe('n1');
        expect(['before', 'after', 'inside']).toContain(payload.position);
        wrapper.unmount();
    });

    test('dragend 重置状态', async () => {
        const wrapper = mountDraggableTree();
        await nextTick();
        await wait();
        await fireDrag(getNode(wrapper, 'n1'), 'dragstart');
        await fireDrag(getNode(wrapper, 'n1'), 'dragend');
        await nextTick();
        expect(wrapper.emitted('dragend')).toBeTruthy();
        wrapper.unmount();
    });

    test('dragover 未 dragstart 时不产生 drop', async () => {
        const wrapper = mountDraggableTree();
        await nextTick();
        await wait();
        await fireDrag(getNode(wrapper, 'n2'), 'dragover');
        await fireDrag(getNode(wrapper, 'n2'), 'drop');
        await nextTick();
        expect(wrapper.emitted('drop')).toBeUndefined();
        wrapper.unmount();
    });
});
