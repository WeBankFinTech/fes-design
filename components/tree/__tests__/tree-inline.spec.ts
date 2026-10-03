import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tree from '../tree';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('tree-node');

// isInline 语义：父节点的所有 children 均为叶子时，叶子才内联
const DATA = [
    {
        value: '1',
        label: '节点1',
        children: [
            { value: '1-1', label: '子1' },
            { value: '1-2', label: '子2' },
        ],
    },
    {
        value: '2',
        label: '节点2',
        children: [
            {
                value: '2-1',
                label: '分支',
                children: [{ value: '2-1-1', label: '孙1' }],
            },
        ],
    },
];

describe('FTree inline 内联模式（useTreeNode isInline/isFirst）', () => {
    test('inline 模式叶子节点带 is-inline 类', async () => {
        const wrapper = mount(Tree, {
            props: { data: DATA, inline: true, defaultExpandAll: true },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        const leafNode = nodes.find((n) => n.text() === '子1');
        expect(leafNode).toBeTruthy();
        expect(leafNode!.classes()).toContain('is-inline');
        wrapper.unmount();
    });

    test('inline 模式同级第一个叶子带 is-first 类', async () => {
        const wrapper = mount(Tree, {
            props: { data: DATA, inline: true, defaultExpandAll: true },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        const firstLeaf = nodes.find((n) => n.text() === '子1');
        const secondLeaf = nodes.find((n) => n.text() === '子2');
        expect(firstLeaf!.classes()).toContain('is-inline-first');
        expect(secondLeaf!.classes()).not.toContain('is-inline-first');
        wrapper.unmount();
    });

    test('remote 模式下无 children 节点视为非叶子不内联', async () => {
        const data = [
            {
                value: 'r',
                label: '远程父',
                children: [
                    { value: 'r-1', label: '远程叶1' },
                    { value: 'r-2', label: '远程叶2' },
                ],
            },
        ];
        const wrapper = mount(Tree, {
            props: {
                data,
                inline: true,
                defaultExpandAll: true,
                remote: true,
            },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        const leaf = nodes.find((n) => n.text() === '远程叶1');
        // remote 下叶子仍被当作非叶子 → 不内联
        expect(leaf!.classes()).not.toContain('is-inline');
        wrapper.unmount();
    });

    test('isLeaf 为 undefined/null 时按 hasChildren 判定', async () => {
        const data = [
            {
                value: 'p',
                label: '父',
                children: [
                    { value: 'x1', label: '叶1', isLeaf: undefined },
                    { value: 'x2', label: '叶2', isLeaf: null },
                ],
            },
        ];
        const wrapper = mount(Tree, {
            props: { data, inline: true, defaultExpandAll: true },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        const leaf1 = nodes.find((n) => n.text() === '叶1');
        const leaf2 = nodes.find((n) => n.text() === '叶2');
        // 无 children 无 remote → 叶子 → 内联
        expect(leaf1!.classes()).toContain('is-inline');
        expect(leaf2!.classes()).toContain('is-inline');
        wrapper.unmount();
    });

    test('兄弟节点有 children 时整组不内联', async () => {
        const data = [
            {
                value: 'P',
                label: 'P',
                children: [
                    {
                        value: 'C1',
                        label: 'C1',
                        children: [{ value: 'G1', label: 'G1' }],
                    },
                    { value: 'C2', label: 'C2' },
                ],
            },
        ];
        const wrapper = mount(Tree, {
            props: { data, inline: true, defaultExpandAll: true },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        // C2 是叶子但兄弟 C1 有 children → 不内联
        const c2 = nodes.find((n) => n.text() === 'C2');
        expect(c2!.classes()).not.toContain('is-inline');
        // G1 是最深层叶子，兄弟组只有自己 → 内联
        const g1 = nodes.find((n) => n.text() === 'G1');
        expect(g1!.classes()).toContain('is-inline');
        wrapper.unmount();
    });

    test('非 inline 模式无 is-inline 类', async () => {
        const wrapper = mount(Tree, {
            props: { data: DATA, defaultExpandAll: true },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        const leafNode = nodes.find((n) => n.text() === '子1');
        expect(leafNode!.classes()).not.toContain('is-inline');
        expect(leafNode!.classes()).not.toContain('is-first');
        wrapper.unmount();
    });

    test('inline 模式 isLeaf 标记影响内联判定', async () => {
        const data = [
            {
                value: 'p',
                label: '父',
                children: [
                    { value: 'l1', label: '标叶1', isLeaf: true },
                    { value: 'l2', label: '标叶2', isLeaf: true },
                ],
            },
            {
                value: 'q',
                label: '父2',
                children: [
                    { value: 'm1', label: '混叶1', isLeaf: true },
                    { value: 'm2', label: '混叶2', isLeaf: false },
                ],
            },
        ];
        const wrapper = mount(Tree, {
            props: { data, inline: true, defaultExpandAll: true },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        // 全叶子兄弟组 → 内联
        const marked = nodes.find((n) => n.text() === '标叶1');
        expect(marked!.classes()).toContain('is-inline');
        // 含非叶子兄弟的组 → 不内联（isLeaf 显式声明也参与判定）
        const mixedLeaf = nodes.find((n) => n.text() === '混叶1');
        expect(mixedLeaf!.classes()).not.toContain('is-inline');
        wrapper.unmount();
    });
});

describe('FTree inline isParentAllLeaf 分支补充', () => {
    test('兄弟混合：显式 isLeaf 触发父级遍历的 remote/普通分支', async () => {
        // 节点自身标记 isLeaf=true 才会进入 isInline 的父级遍历
        const wrapper = mount(Tree, {
            props: {
                data: [
                    {
                        value: 'm1',
                        label: '混合父',
                        children: [
                            { value: 'm1-1', label: '标叶子', isLeaf: true },
                            { value: 'm1-2', label: '未标子' },
                        ],
                    },
                ],
                inline: true,
                defaultExpandAll: true,
            } as any,
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        expect(nodes.find((n) => n.text() === '标叶子')).toBeTruthy();
        wrapper.unmount();

        // remote=true → 兄弟 '未标子' 视为可加载（isLeaf=false 分支）
        const remote = mount(Tree, {
            props: {
                data: [
                    {
                        value: 'm2',
                        label: '远程混合父',
                        children: [
                            { value: 'm2-1', label: '远标叶子', isLeaf: true },
                            { value: 'm2-2', label: '远未标子' },
                        ],
                    },
                ],
                inline: true,
                remote: true,
                defaultExpandAll: true,
            } as any,
        });
        await nextTick();
        await wait(50);
        remote.unmount();
    });
});

describe('FTree inline 显式 isLeaf 组合（#1020 简化回归）', () => {
    // useData.transformNode 归一化后 isLeaf 恒为布尔值，
    // isInline 直接读取 item.isLeaf，与原三分支推断结果一致
    test('显式 isLeaf=false 兄弟（无 children）阻断整组内联', async () => {
        const data = [
            {
                value: 'p',
                label: '父',
                children: [
                    { value: 'l1', label: '真叶', isLeaf: true },
                    { value: 'n1', label: '假叶', isLeaf: false },
                ],
            },
        ];
        const wrapper = mount(Tree, {
            props: { data, inline: true, defaultExpandAll: true },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        expect(nodes.find((n) => n.text() === '真叶')!.classes()).not.toContain('is-inline');
        wrapper.unmount();
    });

    test('remote 下显式 isLeaf=true 的全叶组内联', async () => {
        const data = [
            {
                value: 'rp',
                label: '远程父',
                children: [
                    { value: 'rl1', label: '远叶1', isLeaf: true },
                    { value: 'rl2', label: '远叶2', isLeaf: true },
                ],
            },
        ];
        const wrapper = mount(Tree, {
            props: { data, inline: true, remote: true, defaultExpandAll: true },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        expect(nodes.find((n) => n.text() === '远叶1')!.classes()).toContain('is-inline');
        expect(nodes.find((n) => n.text() === '远叶2')!.classes()).toContain('is-inline');
        wrapper.unmount();
    });

    test('remote 下未标 isLeaf 的兄弟（归一化为 false）阻断内联', async () => {
        const data = [
            {
                value: 'mp',
                label: '混合父',
                children: [
                    { value: 'ml1', label: '标叶', isLeaf: true },
                    { value: 'ml2', label: '未标' },
                ],
            },
        ];
        const wrapper = mount(Tree, {
            props: { data, inline: true, remote: true, defaultExpandAll: true },
        });
        await nextTick();
        await wait(50);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        // 归一化后未标节点 isLeaf=false（remote），原推断走 remote 分支 → 不内联
        expect(nodes.find((n) => n.text() === '标叶')!.classes()).not.toContain('is-inline');
        wrapper.unmount();
    });

    test('懒加载后新子节点归一化参与内联判定', async () => {
        // loadData 追加 children → deep watch 触发 re-flatten → 归一化 isLeaf
        const data = [
            { value: 'lazy', label: '懒父', isLeaf: false, children: [] },
        ];
        let resolveLoad: () => void = () => {};
        const loadData = (node: any) =>
            new Promise<void>((res) => {
                resolveLoad = () => {
                    node.children = [
                        { value: 'lz1', label: '懒叶1', isLeaf: true },
                        { value: 'lz2', label: '懒叶2', isLeaf: true },
                    ];
                    res();
                };
            });
        const wrapper = mount(Tree, {
            props: { data, inline: true, remote: true, loadData },
        });
        await nextTick();
        await wait(50);
        const switcher = wrapper.find(`.${prefixCls}-switcher`);
        expect(switcher.exists()).toBe(true);
        await switcher.trigger('click');
        await nextTick();
        // 等 deep watch 捕获变更后再 resolve，模拟真实异步加载节奏
        resolveLoad();
        await nextTick();
        await wait(80);
        const nodes = wrapper.findAll(`.${prefixCls}`);
        const leaf1 = nodes.find((n) => n.text() === '懒叶1');
        expect(leaf1).toBeTruthy();
        // 全叶组 → 内联
        expect(leaf1!.classes()).toContain('is-inline');
        wrapper.unmount();
    });
});
