import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Tree from '../tree';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

// treeNode.tsx 不可达分支说明（不改源码前提下，保留未覆盖）：
// - treeNode.tsx:150 `if (disabled.value) return`（handleClickCheckbox）：
//   FCheckbox 内部 useSelect.handleClick 对 innerDisabled 直接 return，
//   disabled 节点不会派发 change 事件 → treeNode 的处理器收不到 disabled 节点点击。
// - treeNode.tsx:153 `if (checkable.value)`（handleClickCheckbox 第二层）：
//   checkbox 仅在 checkable 时渲染（renderCheckbox），props 变化都会触发重渲染
//   移除复选框 → 处理器被触发时 checkable 恒为 true，else 路径无入口。

const nodeCls = getPrefixCls('tree-node');

const afterTick = async () => {
    await nextTick();
    await wait(60);
};

const getNode = (wrapper: ReturnType<typeof mount>, value: string) =>
    wrapper.find(`.${nodeCls}[data-value='${value}']`);

afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('FTree TreeNode 分支补全（真实交互链）', () => {
    test('节点级 selectable=false + tree checkable：内容点击走勾选分支', async () => {
        const wrapper = mount(Tree, {
            props: {
                data: [
                    {
                        value: 'p1',
                        label: '父1',
                        selectable: false,
                        children: [{ value: 'c1', label: '子1' }],
                    },
                    { value: 'p2', label: '父2' },
                ],
                checkable: true,
                defaultExpandAll: true,
            },
            attachTo: document.body,
        });
        await afterTick();
        const p1 = getNode(wrapper, 'p1');
        expect(p1.exists()).toBe(true);
        await p1.find(`.${nodeCls}-content`).trigger('click');
        await afterTick();
        // selectable=false：跳过 select，进入 check 分支
        expect(wrapper.emitted('select')).toBeUndefined();
        const check = wrapper.emitted('check');
        expect(check).toBeTruthy();
        expect(check![0][0].checkedKeys).toEqual(['p1']);
        expect(p1.find('.fes-checkbox').classes()).toContain('is-checked');
        expect(p1.classes()).not.toContain('is-selected');
        wrapper.unmount();
    });

    test('节点级 checkable=true：根 checkable=false 仍渲染并勾选该节点', async () => {
        const wrapper = mount(Tree, {
            props: {
                data: [
                    { value: 'a1', label: '甲', checkable: true },
                    { value: 'a2', label: '乙' },
                ],
            },
            attachTo: document.body,
        });
        await afterTick();
        const a1 = getNode(wrapper, 'a1');
        const box = a1.find(`.${nodeCls}-checkbox .fes-checkbox`);
        expect(box.exists()).toBe(true);
        // 未显式 checkable 的节点不渲染复选框
        expect(
            getNode(wrapper, 'a2').find(`.${nodeCls}-checkbox`).exists(),
        ).toBe(false);
        await box.trigger('click');
        await afterTick();
        const check = wrapper.emitted('check');
        expect(check).toBeTruthy();
        expect(check![0][0].checkedKeys).toEqual(['a1']);
        expect(box.classes()).toContain('is-checked');
        wrapper.unmount();
    });

    test('selectable=false 且非 checkable：内容点击展开非叶子节点', async () => {
        const wrapper = mount(Tree, {
            props: {
                data: [
                    {
                        value: 'r1',
                        label: '根1',
                        children: [{ value: 'c1', label: '子1' }],
                    },
                ],
                selectable: false,
            },
            attachTo: document.body,
        });
        await afterTick();
        const r1 = getNode(wrapper, 'r1');
        await r1.find(`.${nodeCls}-content`).trigger('click');
        await afterTick();
        expect(wrapper.emitted('select')).toBeUndefined();
        const expand = wrapper.emitted('expand');
        expect(expand).toBeTruthy();
        expect(expand![0][0]).toMatchObject({ expanded: true });
        expect(expand![0][0].expandedKeys).toEqual(['r1']);
        expect(wrapper.text()).toContain('子1');
        expect(
            getNode(wrapper, 'r1')
                .find(`.${nodeCls}-switcher-icon`)
                .classes(),
        ).toContain('is-expanded');
        wrapper.unmount();
    });

    test('懒加载 loadData：点击展开器加载子节点并展开', async () => {
        let resolveLoad: () => void = () => {};
        const loadData = vi.fn((node: { children?: unknown[] }) =>
            new Promise<void>((res) => {
                resolveLoad = () => {
                    node.children = [{ value: 'c1', label: '子1' }];
                    res();
                };
            }),
        );
        const wrapper = mount(Tree, {
            props: {
                data: [
                    { value: 'r1', label: '远程根', isLeaf: false, children: [] },
                ],
                loadData,
                remote: true,
            },
            attachTo: document.body,
        });
        await afterTick();
        const switcher = wrapper.find(`.${nodeCls}-switcher`);
        expect(switcher.exists()).toBe(true);
        await switcher.trigger('click');
        await nextTick();
        // 加载中：switcher 渲染 LoadingOutlined（loading 图标 d 值特征）
        const loadingPath = wrapper.find(`.${nodeCls}-switcher path`);
        expect(loadingPath.exists()).toBe(true);
        expect(loadingPath.attributes('d')).toContain('M512 42.453');
        expect(loadData).toHaveBeenCalledTimes(1);
        // 完成加载：isLoaded=true → expandNode 展开，子节点渲染
        resolveLoad();
        await nextTick();
        await afterTick();
        const expand = wrapper.emitted('expand');
        expect(expand).toBeTruthy();
        expect(expand![0][0].expanded).toBe(true);
        expect(wrapper.text()).toContain('子1');
        wrapper.unmount();
    });

    test('label 为函数：按函数渲染节点标签', async () => {
        const wrapper = mount(Tree, {
            props: {
                data: [
                    {
                        value: 'fn1',
                        label: () =>
                            h('em', { class: 'fn-label' }, '函数标签'),
                    },
                    { value: 'pl', label: '普通标签' },
                ] as any,
            },
            attachTo: document.body,
        });
        await afterTick();
        const fnLabel = wrapper.find('.fn-label');
        expect(fnLabel.exists()).toBe(true);
        expect(fnLabel.text()).toBe('函数标签');
        expect(wrapper.text()).toContain('普通标签');
        wrapper.unmount();
    });

    test('Tree label 插槽：非函数 label 走根插槽渲染', async () => {
        const wrapper = mount(Tree, {
            props: { data: [{ value: 'k1', label: '插槽目标' }] },
            slots: {
                label: (node: any) =>
                    h('span', { class: 'slot-label' }, `定制:${node.value}`),
            },
            attachTo: document.body,
        });
        await afterTick();
        const slotLabel = wrapper.find('.slot-label');
        expect(slotLabel.exists()).toBe(true);
        expect(slotLabel.text()).toBe('定制:k1');
        wrapper.unmount();
    });

    test('filterText + filterTextHighlight：命中标签渲染高亮片段', async () => {
        const wrapper = mount(Tree, {
            props: {
                data: [
                    { value: 'f1', label: '过滤命中一' },
                    { value: 'o1', label: '普通节点' },
                ],
                filterText: '过滤',
                filterTextHighlight: true,
            },
            attachTo: document.body,
        });
        await afterTick();
        const mark = getNode(wrapper, 'f1').find(
            `.${nodeCls}-content-label mark.highlight`,
        );
        expect(mark.exists()).toBe(true);
        expect(mark.text()).toBe('过滤');
        // 未命中节点不高亮
        expect(getNode(wrapper, 'o1').find('mark').exists()).toBe(false);
        wrapper.unmount();
    });

    test('disabled 节点点击内容：不产生选中与展开', async () => {
        const wrapper = mount(Tree, {
            props: {
                data: [
                    {
                        value: 'd1',
                        label: '禁用父',
                        disabled: true,
                        children: [{ value: 'd1-1', label: '禁用子' }],
                    },
                ],
            },
            attachTo: document.body,
        });
        await afterTick();
        const d1 = getNode(wrapper, 'd1');
        expect(d1.classes()).toContain('is-disabled');
        await d1.find(`.${nodeCls}-content`).trigger('click');
        await afterTick();
        expect(wrapper.emitted('select')).toBeUndefined();
        expect(wrapper.emitted('expand')).toBeUndefined();
        wrapper.unmount();
    });
});
