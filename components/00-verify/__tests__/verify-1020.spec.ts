/**
 * #1020 验证：tree useTreeNode 的 isInline 计算存在不可达分支
 *
 * useTreeNode.ts isInline 遍历 parentNode.children 时带有 4 个分支：
 *   if (!isNil(item.isLeaf)) / else if (hasChildren) / else if (remote) / else
 * 而 useData.ts transformNode 归一化时已用相同逻辑算出布尔 isLeaf，
 * 并写入 nodeList 与 children 数组（flatNodes: nodeList.set / copy.children = children）。
 * 预期：公开数据流（data prop）下 nodeList 每个节点、每个 children 项的
 * isLeaf 恒为 boolean → isInline 内后 3 个 else 分支不可达（死代码）。
 */
import { mount } from '@vue/test-utils';
import { ResizeObserver } from '@juggle/resize-observer';
import { nextTick } from 'vue';
import Tree from '../../tree/tree';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

// tree 内部渲染 VirtualList → 依赖 ResizeObserver
if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = ResizeObserver;
}

const nodeCls = getPrefixCls('tree-node');

// 覆盖 useData.transformNode 归一化的各输入：
// - 显式 isLeaf:true（标记叶）
// - 无 isLeaf 无 children（普通子：remote 决定归一化结果）
// - 有 children（分支：无论 remote 均归一化为非叶）
const DATA = [
    {
        value: 'p',
        label: '父',
        children: [
            { value: 'marked', label: '标记叶', isLeaf: true },
            { value: 'plain', label: '普通子' },
        ],
    },
    {
        value: 'q',
        label: '分支父',
        children: [
            {
                value: 'q-b',
                label: '分支',
                children: [{ value: 'q-b-l', label: '分支叶' }],
            },
        ],
    },
];

const mountTree = (extra: Record<string, unknown> = {}) =>
    mount(Tree, {
        props: {
            data: DATA,
            inline: true,
            defaultExpandAll: true,
            ...extra,
        } as any,
        attachTo: document.body,
    });

const getNode = (wrapper: any, text: string) =>
    wrapper.findAll(`.${nodeCls}`).find((n: any) => n.text() === text);

describe('#1020 FTree useTreeNode isInline 死分支验证', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('nodeList 归一化：节点与 children 项的 isLeaf 恒为 boolean（else 分支不可达）', async () => {
        let nodeList: any = null;
        const wrapper = mountTree({
            remote: true,
            'onUpdate:nodeList': (m: any) => {
                nodeList = m;
            },
        });
        await nextTick();
        await wait(50);
        expect(nodeList).toBeTruthy();
        let checked = 0;
        nodeList.forEach((node: any) => {
            // 每个 nodeList 条目都带布尔 isLeaf → isInline 的 !isNil 分支恒命中
            expect(typeof node.isLeaf).toBe('boolean');
            checked += 1;
            if (Array.isArray(node.children)) {
                node.children.forEach((child: any) => {
                    // children 数组项同样是归一化副本，也带布尔 isLeaf
                    expect(typeof child.isLeaf).toBe('boolean');
                    checked += 1;
                });
            }
        });
        // 确认遍历覆盖了全部 6 个节点（p/marked/plain/q/q-b/q-b-l）
        expect(checked).toBeGreaterThanOrEqual(6);
        // 归一化结果与 transformNode 各分支一致
        expect(nodeList.get('marked').isLeaf).toBe(true); // 显式 isLeaf 保留
        expect(nodeList.get('plain').isLeaf).toBe(false); // 无 children + remote → false
        expect(nodeList.get('q-b').isLeaf).toBe(false); // 有 children → false
        expect(nodeList.get('q-b-l').isLeaf).toBe(false); // 无 children + remote → false
        wrapper.unmount();
    });

    test('remote:false：普通子归一化为叶 → 同级叶子均内联（行为一致）', async () => {
        const wrapper = mountTree({ remote: false });
        await nextTick();
        await wait(50);
        expect(getNode(wrapper, '标记叶')!.classes()).toContain('is-inline');
        expect(getNode(wrapper, '普通子')!.classes()).toContain('is-inline');
        expect(getNode(wrapper, '分支叶')!.classes()).toContain('is-inline');
        wrapper.unmount();
    });

    test('remote:true：普通子归一化为非叶 → 同级叶子不内联（isLeaf 已是 boolean，无需 fallback 分支）', async () => {
        const wrapper = mountTree({ remote: true });
        await nextTick();
        await wait(50);
        // '普通子' 无 children 且 remote → 归一化 isLeaf=false
        // → 'p' 的 children 不全为叶 → '标记叶' 不内联
        expect(getNode(wrapper, '标记叶')!.classes()).not.toContain('is-inline');
        expect(getNode(wrapper, '普通子')!.classes()).not.toContain('is-inline');
        wrapper.unmount();
    });
});
