import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tree from '../tree';
import { wait } from '../../_util/__tests__/helpers';

// useDrag 分支语义（先读源码确认，勿按直觉写）：
// - allowDrop(node, 'inside')：isLeaf===false 或有 children → 允许 inside（走 8px 边界三分支）；
//   叶子（无 children 且 isLeaf 非 false）→ 不允许 inside（走上/下半分流）
// - getTargetNode：目标在 dragNode 的 indexPath 上（自身或子孙）→ 丢弃
// - 悬浮同一目标超 1s 且 hasChildren 且未展开 → expandNode（map 按 target value 记时）
// - drop 依赖 dragOverInfo（只有 dragover 会设置）；dragstart/dragend 对不可拖节点 preventDefault
const prefixCls = 'fes-tree';

const makeBranchData = () => [
    {
        label: '父节点 p',
        value: 'p',
        draggable: true,
        children: [
            { label: '子一 c1', value: 'p-c1' },
            { label: '子孙 s', value: 'p-s' },
        ],
    },
    { label: '非叶子不可拖 pnd', value: 'pnd', isLeaf: false, draggable: false },
    { label: '叶子 lf', value: 'lf', draggable: true },
    // 伪叶子：isLeaf=true 但仍带 children（远程数据未加载完的中间态），
    // allowDrop 跳过 isLeaf===false 分支后靠 children 判定允许 inside
    {
        label: '伪叶子 wf',
        value: 'wf',
        isLeaf: true,
        draggable: true,
        children: [{ label: '隐藏子 wf-c', value: 'wf-c' }],
    },
];

const makeHoverData = () => [
    {
        label: '悬停展开目标 x1',
        value: 'x1',
        draggable: true,
        children: [{ label: '子 x1-c', value: 'x1-c' }],
    },
    { label: '拖动者 x2', value: 'x2', draggable: true },
];

const makeSelectData = () => [
    { label: '选中一 s1', value: 's1' },
    { label: '选中二 s2', value: 's2' },
];

const makeDataTransfer = () => ({
    getData: vi.fn(() => ''),
    setData: vi.fn(),
    dropEffect: 'move',
});

const mountTree = (data: unknown[], extra: Record<string, unknown> = {}) =>
    mount(Tree, {
        props: {
            data: data as any,
            defaultExpandAll: true,
            draggable: true,
            // 拖拽用例关闭 selectable，避免节点点击行为干扰
            selectable: false,
            ...extra,
        },
        // handleDragover 内部用 document.querySelector 查目标节点，需挂到 body
        attachTo: document.body,
    });

const getNode = (wrapper: any, value: string) =>
    wrapper.find(`.${prefixCls}-node[data-value='${value}']`);

const fireDrag = async (
    nodeEl: any,
    type: string,
    extra: Record<string, unknown> = {},
) => {
    await nodeEl.trigger(type, {
        clientY: 10,
        clientX: 10,
        dataTransfer: makeDataTransfer(),
        ...extra,
    });
};

describe('FTree 拖拽分支（useDrag）', () => {
    test('dragstart 在不可拖节点上被阻止', async () => {
        const wrapper = mountTree(makeBranchData());
        await nextTick();
        await wait(60);
        // DragEvent 构造器会丢弃非 init 字段，组件调用的是原生 preventDefault，
        // 用 spyOn 拦截原型方法验证「不可拖节点阻止默认拖拽行为」分支
        const preventDefault = vi
            .spyOn(Event.prototype, 'preventDefault')
            .mockImplementation(() => {});
        await fireDrag(getNode(wrapper, 'pnd'), 'dragstart');
        expect(wrapper.emitted('dragstart')).toBeUndefined();
        expect(preventDefault).toHaveBeenCalledTimes(1);
        preventDefault.mockRestore();
        wrapper.unmount();
    });

    test('dragend 在不可拖节点上被阻止', async () => {
        const wrapper = mountTree(makeBranchData());
        await nextTick();
        await wait(60);
        const preventDefault = vi
            .spyOn(Event.prototype, 'preventDefault')
            .mockImplementation(() => {});
        await fireDrag(getNode(wrapper, 'pnd'), 'dragend');
        expect(wrapper.emitted('dragend')).toBeUndefined();
        expect(preventDefault).toHaveBeenCalledTimes(1);
        preventDefault.mockRestore();
        wrapper.unmount();
    });

    test('目标为拖动者自身或子孙时 dragenter/over/leave/drop 全部丢弃', async () => {
        const wrapper = mountTree(makeBranchData());
        await nextTick();
        await wait(60);
        const pNode = getNode(wrapper, 'p');
        await fireDrag(pNode, 'dragstart');
        // 自身
        await fireDrag(pNode, 'dragenter');
        await fireDrag(pNode, 'dragover');
        await fireDrag(pNode, 'dragleave');
        await fireDrag(pNode, 'drop');
        // 子孙节点
        const childNode = getNode(wrapper, 'p-s');
        await fireDrag(childNode, 'dragenter');
        await fireDrag(childNode, 'dragover');
        await fireDrag(childNode, 'dragleave');
        await fireDrag(childNode, 'drop');
        await nextTick();
        expect(wrapper.emitted('dragstart')).toBeTruthy();
        expect(wrapper.emitted('dragenter')).toBeUndefined();
        expect(wrapper.emitted('dragover')).toBeUndefined();
        expect(wrapper.emitted('dragleave')).toBeUndefined();
        expect(wrapper.emitted('drop')).toBeUndefined();
        // dragOverInfo 未建立，无任何拖拽指示条
        expect(wrapper.findAll(`.${prefixCls}-node-drag-over`)).toHaveLength(0);
        wrapper.unmount();
    });

    test('拖动者悬停其它父节点超过 1s 自动展开', async () => {
        const wrapper = mountTree(makeHoverData(), { defaultExpandAll: false });
        await nextTick();
        await wait(60);
        // 从叶子 x2 发起拖拽（拖到 x1 自身/子孙会被祖先链守卫拦截，必须兄弟发起）
        await fireDrag(getNode(wrapper, 'x2'), 'dragstart');
        expect(wrapper.emitted('dragstart')).toBeTruthy();
        // 第一次 dragover：记录悬停起始时间
        await fireDrag(getNode(wrapper, 'x1'), 'dragover', { clientY: 50 });
        expect(wrapper.emitted('dragover')).toHaveLength(1);
        // 悬停超过 1s：vitest 4 的 fake timers 默认不 mock Date，
        // 需显式 toFake:['Date']；且第二次 dragover 必须在 fake Date
        // 仍生效时发起（useRealTimers 会还原真实时钟，时间差归零）
        vi.useFakeTimers({ toFake: ['Date'] });
        await vi.advanceTimersByTimeAsync(1100);
        await fireDrag(getNode(wrapper, 'x1'), 'dragover', { clientY: 50 });
        vi.useRealTimers();
        await nextTick();
        await wait(60);
        const expandEvents = wrapper.emitted('expand');
        expect(expandEvents).toBeTruthy();
        const payload = expandEvents![expandEvents!.length - 1][0] as any;
        expect(payload.node.value).toBe('x1');
        expect(payload.expanded).toBe(true);
        // 展开副作用：子节点渲染出来
        expect(getNode(wrapper, 'x1-c').exists()).toBe(true);
        wrapper.unmount();
    });

    test('dragover 父节点 inside 区域：8px 边界三分支 + drop 参数', async () => {
        const wrapper = mountTree(makeBranchData());
        await nextTick();
        await wait(60);
        await fireDrag(getNode(wrapper, 'lf'), 'dragstart');
        // 允许 inside 的节点走 8px 边界：上 8px 内 before
        await fireDrag(getNode(wrapper, 'p'), 'dragover', { clientY: 5 });
        expect(wrapper.emitted('dragover')).toHaveLength(1);
        await fireDrag(getNode(wrapper, 'p'), 'drop');
        expect((wrapper.emitted('drop')![0][0] as any).position).toBe('before');
        // 中部 inside，目标元素 rect 高度 100，95 >= 100-8 → after
        await fireDrag(getNode(wrapper, 'p'), 'dragover', { clientY: 95 });
        await fireDrag(getNode(wrapper, 'p'), 'drop');
        expect((wrapper.emitted('drop')![1][0] as any).position).toBe('after');
        // 中部 inside
        await fireDrag(getNode(wrapper, 'p'), 'dragover', { clientY: 50 });
        // is-highlight 落在 inside 的目标节点自身（dragHighlightNode position 非 before/after 时取 node）
        expect(getNode(wrapper, 'p').classes()).toContain('is-highlight');
        await fireDrag(getNode(wrapper, 'p'), 'drop');
        const dropPayload = wrapper.emitted('drop')![2][0] as any;
        expect(dropPayload.position).toBe('inside');
        expect(dropPayload.originNode.value).toBe('p');
        expect(dropPayload.originDragNode.value).toBe('lf');
        wrapper.unmount();
    });

    test('dragover 叶子节点：不允许 inside，按上/下半分流 before/after', async () => {
        const wrapper = mountTree(makeBranchData());
        await nextTick();
        await wait(60);
        await fireDrag(getNode(wrapper, 'p'), 'dragstart');
        // 上半 → before
        await fireDrag(getNode(wrapper, 'lf'), 'dragover', { clientY: 20 });
        await fireDrag(getNode(wrapper, 'lf'), 'drop');
        expect((wrapper.emitted('drop')![0][0] as any).position).toBe('before');
        // 下半 → after
        await fireDrag(getNode(wrapper, 'lf'), 'dragover', { clientY: 80 });
        await fireDrag(getNode(wrapper, 'lf'), 'drop');
        expect((wrapper.emitted('drop')![1][0] as any).position).toBe('after');
        expect(wrapper.emitted('dragover')).toHaveLength(2);
        wrapper.unmount();
    });

    test('仅有 dragenter 未 dragover 时 drop 被 dragOverInfo 守卫拦截', async () => {
        const wrapper = mountTree(makeBranchData());
        await nextTick();
        await wait(60);
        await fireDrag(getNode(wrapper, 'p'), 'dragstart');
        // dragenter 不设置 dragOverInfo，drop 走 !dragOverInfo 分支
        await fireDrag(getNode(wrapper, 'lf'), 'dragenter');
        expect(wrapper.emitted('dragenter')).toHaveLength(1);
        await fireDrag(getNode(wrapper, 'lf'), 'drop');
        expect(wrapper.emitted('drop')).toBeUndefined();
        wrapper.unmount();
    });

    test('伪叶子（isLeaf=true 但有 children）仍允许放入 inside', async () => {
        const wrapper = mountTree(makeBranchData());
        await nextTick();
        await wait(60);
        await fireDrag(getNode(wrapper, 'lf'), 'dragstart');
        // isLeaf===false 为 false → 走 children 判定分支：有 children 允许 inside
        await fireDrag(getNode(wrapper, 'wf'), 'dragover', { clientY: 50 });
        await fireDrag(getNode(wrapper, 'wf'), 'drop');
        const emitted = wrapper.emitted('drop');
        expect(emitted).toBeTruthy();
        expect((emitted![0][0] as any).position).toBe('inside');
        expect((emitted![0][0] as any).node.value).toBe('wf');
        wrapper.unmount();
    });

    test('before/after 位置时高亮提升到父节点并渲染拖拽指示条', async () => {
        const wrapper = mountTree(makeBranchData());
        await nextTick();
        await wait(60);
        await fireDrag(getNode(wrapper, 'lf'), 'dragstart');
        // inside：高亮目标自身
        await fireDrag(getNode(wrapper, 'p'), 'dragover', { clientY: 50 });
        expect(getNode(wrapper, 'p').classes()).toContain('is-highlight');
        // after：高亮取 node.parent（p-c1 的父是 p，高亮保持落在 p 上）
        await fireDrag(getNode(wrapper, 'p-c1'), 'dragover', { clientY: 80 });
        const dragTag = getNode(wrapper, 'p-c1').find(
            `.${prefixCls}-node-drag-over`,
        );
        expect(dragTag.exists()).toBe(true);
        expect(dragTag.classes()).toContain('is-after');
        expect(getNode(wrapper, 'p').classes()).toContain('is-highlight');
        wrapper.unmount();
    });

    test('expose selectNode 对 selectable=false 与幽灵 value 均静默返回', async () => {
        const wrapper = mountTree(makeBranchData());
        await nextTick();
        await wait(60);
        // 业务方编程选中的真实用法：expose 直调 selectNode。
        // selectable=false → useSelect 首行提前返回（DOM 点击路径进不去该分支）
        (wrapper.vm as any).selectNode('ghost-key', new MouseEvent('click'));
        // getTargetNode 的 !node 守卫（L87）经组件公开交互不可达：
        // drag 事件只绑定在渲染中的节点上，其 value 恒在 nodeList 内
        // （flatNodes 只增不减），此处触发 drag 事件验证零副作用收尾
        const treeEl = wrapper.find(`.${prefixCls}`);
        await fireDrag(treeEl, 'dragenter');
        await fireDrag(treeEl, 'dragover');
        await fireDrag(treeEl, 'dragleave');
        await fireDrag(treeEl, 'drop');
        expect(wrapper.emitted('dragenter')).toBeUndefined();
        expect(wrapper.emitted('drop')).toBeUndefined();
        expect(wrapper.emitted('select')).toBeUndefined();
        wrapper.unmount();
    });
});

describe('FTree 选择分支（useSelect）', () => {
    test('multiple 模式：点选追加、cancelable 再点取消', async () => {
        const wrapper = mountTree(makeSelectData(), {
            selectable: true,
            multiple: true,
            cancelable: true,
            selectedKeys: ['s1'],
        });
        await nextTick();
        await wait(60);
        expect(getNode(wrapper, 's1').classes()).toContain('is-selected');
        // 未选中 → push
        await getNode(wrapper, 's2').find(`.${prefixCls}-node-content`).trigger('click');
        let emitted = wrapper.emitted('select')!;
        expect(emitted).toHaveLength(1);
        let payload = emitted[0][0] as any;
        expect(payload.selectedKeys).toEqual(['s1', 's2']);
        expect(payload.node.value).toBe('s2');
        expect(payload.selected).toBe(true);
        expect(getNode(wrapper, 's2').classes()).toContain('is-selected');
        // 已选中且 cancelable → splice 取消
        await getNode(wrapper, 's2').find(`.${prefixCls}-node-content`).trigger('click');
        emitted = wrapper.emitted('select')!;
        expect(emitted).toHaveLength(2);
        payload = emitted[1][0] as any;
        expect(payload.selectedKeys).toEqual(['s1']);
        expect(payload.selected).toBe(false);
        expect(getNode(wrapper, 's2').classes()).not.toContain('is-selected');
        wrapper.unmount();
    });

    test('multiple 模式 cancelable=false 时选中节点不可再点取消', async () => {
        const wrapper = mountTree(makeSelectData(), {
            selectable: true,
            multiple: true,
            cancelable: false,
            selectedKeys: ['s1'],
        });
        await nextTick();
        await wait(60);
        await getNode(wrapper, 's1').find(`.${prefixCls}-node-content`).trigger('click');
        const emitted = wrapper.emitted('select')!;
        expect(emitted).toHaveLength(1);
        const payload = emitted[0][0] as any;
        expect(payload.selectedKeys).toEqual(['s1']);
        expect(payload.selected).toBe(true);
        expect(getNode(wrapper, 's1').classes()).toContain('is-selected');
        wrapper.unmount();
    });

    test('单选模式 cancelable=false：点选替换、已选中再点不取消', async () => {
        const wrapper = mountTree(makeSelectData(), {
            selectable: true,
            multiple: false,
            cancelable: false,
            selectedKeys: ['s1'],
        });
        await nextTick();
        await wait(60);
        expect(getNode(wrapper, 's1').classes()).toContain('is-selected');
        // 已选中再点：不取消，selectedKeys 不变
        await getNode(wrapper, 's1').find(`.${prefixCls}-node-content`).trigger('click');
        let emitted = wrapper.emitted('select')!;
        expect(emitted).toHaveLength(1);
        expect((emitted[0][0] as any).selectedKeys).toEqual(['s1']);
        // 点另一个 → 替换 values[0]
        await getNode(wrapper, 's2').find(`.${prefixCls}-node-content`).trigger('click');
        emitted = wrapper.emitted('select')!;
        expect(emitted).toHaveLength(2);
        const payload = emitted[1][0] as any;
        expect(payload.selectedKeys).toEqual(['s2']);
        expect(payload.selected).toBe(true);
        expect(getNode(wrapper, 's1').classes()).not.toContain('is-selected');
        expect(getNode(wrapper, 's2').classes()).toContain('is-selected');
        wrapper.unmount();
    });

    test('单选模式 cancelable=true 时已选中节点可点击取消', async () => {
        const wrapper = mountTree(makeSelectData(), {
            selectable: true,
            multiple: false,
            cancelable: true,
            selectedKeys: ['s1'],
        });
        await nextTick();
        await wait(60);
        await getNode(wrapper, 's1').find(`.${prefixCls}-node-content`).trigger('click');
        const emitted = wrapper.emitted('select')!;
        expect(emitted).toHaveLength(1);
        const payload = emitted[0][0] as any;
        expect(payload.selectedKeys).toEqual([]);
        expect(payload.selected).toBe(false);
        expect(getNode(wrapper, 's1').classes()).not.toContain('is-selected');
        wrapper.unmount();
    });

    test('selectable=false 时点击节点不触发 select 也不产生选中态', async () => {
        const wrapper = mountTree(makeSelectData(), {
            selectable: false,
        });
        await nextTick();
        await wait(60);
        await getNode(wrapper, 's1').find(`.${prefixCls}-node-content`).trigger('click');
        expect(wrapper.emitted('select')).toBeUndefined();
        expect(getNode(wrapper, 's1').classes()).not.toContain('is-selected');
        wrapper.unmount();
    });
});
