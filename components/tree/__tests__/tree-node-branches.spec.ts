import { mount } from '@vue/test-utils';
import { ResizeObserver } from '@juggle/resize-observer';
import { h, nextTick } from 'vue';
import Tree from '../tree';
import getPrefixCls from '../../_util/getPrefixCls';
import { isChecked, isIndeterminate, wait } from '../../_util/__tests__/helpers';

// tree 的 virtualList 分支内部渲染 VirtualList → 依赖 ResizeObserver
if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = ResizeObserver;
}

const treeCls = getPrefixCls('tree');
const nodeCls = getPrefixCls('tree-node');

const afterTick = async () => {
    await nextTick();
    await wait(50);
};

describe('FTree 勾选父子联动与半选态（useCheck/useTreeNode 状态机）', () => {
    const makeCheckData = () => [
        {
            value: 'p1',
            label: '父1',
            children: [
                { value: 'c1', label: '子1' },
                { value: 'c2', label: '子2' },
            ],
        },
        { value: 'p2', label: '父2' },
    ];

    const mountCheckTree = (extra: Record<string, unknown> = {}) =>
        mount(Tree, {
            props: {
                data: makeCheckData(),
                checkable: true,
                cascade: true,
                defaultExpandAll: true,
                ...extra,
            },
            attachTo: document.body,
        });

    const getBoxes = (wrapper: any) =>
        wrapper.findAll(`.${nodeCls} .fes-checkbox`);

    test('勾选父 → 子全勾 → 取消一子 → 父转半选（isChecked/isIndeterminate）', async () => {
        const wrapper = mountCheckTree();
        await afterTick();

        let boxes = getBoxes(wrapper);
        expect(boxes.length).toBe(4); // p1, c1, c2, p2
        // 初始全部未勾选
        boxes.forEach((box: any) => expect(isChecked(box)).toBe(false));

        // 勾选父节点 p1
        await boxes[0].trigger('click');
        await afterTick();
        boxes = getBoxes(wrapper);
        expect(isChecked(boxes[0])).toBe(true); // p1
        expect(isChecked(boxes[1])).toBe(true); // c1
        expect(isChecked(boxes[2])).toBe(true); // c2
        // 级联后 check 事件携带全部 keys（childrenPath 展开顺序：子先父后）
        const events = wrapper.emitted('check');
        expect(events).toBeTruthy();
        expect(events![0][0].checkedKeys).toEqual(['c1', 'c2', 'p1']);

        // 取消子节点 c1 → 父节点转半选，c2 仍勾选
        await boxes[1].trigger('click');
        await afterTick();
        boxes = getBoxes(wrapper);
        expect(isIndeterminate(boxes[0])).toBe(true); // p1 半选
        expect(isChecked(boxes[0])).toBe(false);
        expect(isChecked(boxes[1])).toBe(false); // c1 已取消
        expect(isChecked(boxes[2])).toBe(true); // c2 保持
        // 半选父再次点击 → 全选恢复（反向级联）
        await boxes[0].trigger('click');
        await afterTick();
        boxes = getBoxes(wrapper);
        expect(isChecked(boxes[0])).toBe(true);
        expect(isChecked(boxes[1])).toBe(true);
        expect(isChecked(boxes[2])).toBe(true);
        // p2（无子节点）始终未受影响
        expect(isChecked(boxes[3])).toBe(false);
        wrapper.unmount();
    });

    test('受控 checkedKeys 反向驱动节点勾选态', async () => {
        // checkStrictly='parent'：父 key 初始化时级联补齐全部子 key
        const wrapper = mountCheckTree({ checkStrictly: 'parent' });
        await afterTick();
        let boxes = getBoxes(wrapper);
        boxes.forEach((box: any) => expect(isChecked(box)).toBe(false));

        // 受控传入叶子 key：父级由子级推导出半选态
        await wrapper.setProps({ checkedKeys: ['c1'] });
        await afterTick();
        boxes = getBoxes(wrapper);
        expect(isChecked(boxes[1])).toBe(true); // c1
        expect(isIndeterminate(boxes[0])).toBe(true); // p1 半选

        // 受控传入父 key：级联全勾
        await wrapper.setProps({ checkedKeys: ['p1'] });
        await afterTick();
        boxes = getBoxes(wrapper);
        expect(isChecked(boxes[0])).toBe(true);
        expect(isChecked(boxes[1])).toBe(true);
        expect(isChecked(boxes[2])).toBe(true);
        wrapper.unmount();
    });

    test('checkStrictly=all 父子互不影响，勾选态仅自身', async () => {
        const wrapper = mountCheckTree({ cascade: false, checkStrictly: 'all' });
        await afterTick();

        const boxes = getBoxes(wrapper);
        await boxes[1].trigger('click'); // 只勾 c1
        await afterTick();
        const after = getBoxes(wrapper);
        expect(isChecked(after[1])).toBe(true); // c1 自身勾选
        expect(isChecked(after[0])).toBe(false); // p1 不联动
        expect(isIndeterminate(after[0])).toBe(false); // 也无半选
        const events = wrapper.emitted('check');
        expect(events).toBeTruthy();
        expect(events![0][0].checkedKeys).toEqual(['c1']);
        wrapper.unmount();
    });
});

describe('FTree prefix/suffix 数据插槽（tree.tsx renderNode 分支）', () => {
    test('函数与字符串形式的 prefix/suffix 均渲染，无插槽节点不渲染', async () => {
        const data = [
            {
                value: 'fn',
                label: '函数插槽',
                prefix: () => h('i', { class: 'prefix-fn' }, 'P'),
                suffix: () => h('b', { class: 'suffix-fn' }, 'S'),
            },
            {
                value: 'str',
                label: '字符串插槽',
                prefix: 'P-str',
                suffix: 'S-str',
            },
            { value: 'none', label: '无插槽' },
        ];
        const wrapper = mount(Tree, {
            props: { data },
            attachTo: document.body,
        });
        await afterTick();

        // 函数 prefix/suffix：作为插槽函数调用，渲染其返回 VNode
        const fnNode = wrapper.find(`.${nodeCls}[data-value='fn']`);
        expect(fnNode.exists()).toBe(true);
        expect(fnNode.find('.prefix-fn').exists()).toBe(true);
        expect(fnNode.find('.prefix-fn').text()).toBe('P');
        expect(fnNode.find('.suffix-fn').exists()).toBe(true);
        expect(fnNode.find('.suffix-fn').text()).toBe('S');

        // 字符串 prefix/suffix：包装为 () => string 插槽渲染文本
        const strNode = wrapper.find(`.${nodeCls}[data-value='str']`);
        expect(strNode.exists()).toBe(true);
        expect(strNode.find(`.${nodeCls}-content-prefix`).text()).toBe(
            'P-str',
        );
        expect(strNode.find(`.${nodeCls}-content-suffix`).text()).toBe(
            'S-str',
        );

        // 未提供插槽的节点不渲染 prefix/suffix 容器
        const noneNode = wrapper.find(`.${nodeCls}[data-value='none']`);
        expect(noneNode.exists()).toBe(true);
        expect(noneNode.find(`.${nodeCls}-content-prefix`).exists()).toBe(
            false,
        );
        expect(noneNode.find(`.${nodeCls}-content-suffix`).exists()).toBe(
            false,
        );
        wrapper.unmount();
    });
});

describe('FTree virtualList 渲染分支（tree.tsx L190）', () => {
    const bigData = Array.from({ length: 120 }, (_, i) => ({
        value: i,
        label: `节点${i}`,
    }));

    test('virtualList=true 走虚拟列表，仅渲染可视窗口节点', async () => {
        const wrapper = mount(Tree, {
            props: { data: bigData, virtualList: true },
            attachTo: document.body,
        });
        await afterTick();

        // VirtualList 根节点仍携带 tree 类名
        expect(wrapper.find(`.${treeCls}`).exists()).toBe(true);
        const nodes = wrapper.findAll(`.${nodeCls}`);
        expect(nodes.length).toBeGreaterThan(0);
        // 虚拟化生效：120 条数据只渲染窗口内节点
        expect(nodes.length).toBeLessThan(120);
        expect(nodes[0].text()).toContain('节点0');
        wrapper.unmount();
    });

    test('virtualList=true 且 inline=true 时回退普通容器渲染全部节点', async () => {
        // inline 要求节点有父级（isFirst 计算 indexPath[length-2]），
        // 用带 children 的数据 + defaultExpandAll 展开两层
        const treeData = [
            {
                value: 'p1',
                label: '父1',
                children: Array.from({ length: 60 }, (_, i) => ({
                    value: `c${i}`,
                    label: `子${i}`,
                })),
            },
        ];
        const wrapper = mount(Tree, {
            props: {
                data: treeData,
                virtualList: true,
                inline: true,
                defaultExpandAll: true,
            },
            attachTo: document.body,
        });
        await afterTick();

        // 虚拟列表与 inline 互斥：走 role="tree" 普通容器分支
        expect(wrapper.find('[role=\'tree\']').exists()).toBe(true);
        expect(wrapper.findAll(`.${nodeCls}`).length).toBe(61);
        wrapper.unmount();
    });

    test('virtualList=false 默认以普通容器渲染全部节点', async () => {
        const wrapper = mount(Tree, {
            props: { data: bigData },
            attachTo: document.body,
        });
        await afterTick();

        expect(wrapper.find(`.${treeCls}`).exists()).toBe(true);
        expect(wrapper.find('[role=\'tree\']').exists()).toBe(true);
        expect(wrapper.findAll(`.${nodeCls}`).length).toBe(120);
        wrapper.unmount();
    });
});

describe('useTreeNode isInline 兄弟叶子判定（原始 isLeaf 数据）', () => {
    const makeData = () => [
        {
            value: 'p',
            label: '父',
            children: [{ value: 'a', label: 'A', isLeaf: true }],
        },
    ];

    // 通过公共 update:nodeList 事件拿到内部 nodeList 引用
    // 需 defaultExpandAll：节点 A 必须已渲染，isInline 才会被计算
    const mountWithNodeList = (props: Record<string, unknown>) => {
        let captured: Map<string, any>;
        const wrapper = mount(Tree, {
            props: {
                'data': makeData(),
                'defaultExpandAll': true,
                'onUpdate:nodeList': (m: Map<string, any>) => {
                    captured = m;
                },
                ...props,
            },
            attachTo: document.body,
        });
        return { wrapper, getNodeList: () => captured };
    };

    test('兄弟含 isLeaf 缺省且带 children 的原始节点 → 整组不内联', async () => {
        // remote=false：注入的 X1 走「无 children 且非 remote → 叶子」默认判定
        const { wrapper, getNodeList } = mountWithNodeList({});
        await afterTick();

        // 模拟运行时向父节点注入未归一化的原始子节点（remote 懒加载中间态）
        getNodeList().get('p').children = [
            { value: 'x1', label: 'X1' },
            {
                value: 'x2',
                label: 'X2',
                isLeaf: undefined,
                children: [{ value: 'x2-1', label: 'X2-1' }],
            },
        ];
        // inline 变化触发 isInline 重算，遍历注入的原始 children
        await wrapper.setProps({ inline: true });
        await afterTick();

        // A 的兄弟组存在带 children 的 X2（hasChildren → 非叶子）→ A 不内联
        const aNode = wrapper
            .findAll(`.${nodeCls}`)
            .find((n) => n.text() === 'A');
        expect(aNode).not.toBeUndefined();
        expect(aNode.classes()).not.toContain('is-inline');
        wrapper.unmount();
    });

    test('remote=true 时 isLeaf 缺省兄弟按可加载节点判定 → 不内联', async () => {
        const { wrapper, getNodeList } = mountWithNodeList({});
        await afterTick();

        getNodeList().get('p').children = [{ value: 'x1', label: 'X1' }];
        // remote=true：X1 无 isLeaf 无 children → remote 视为可加载（非叶子）
        await wrapper.setProps({ inline: true, remote: true });
        await afterTick();

        const aNode = wrapper
            .findAll(`.${nodeCls}`)
            .find((n) => n.text() === 'A');
        expect(aNode).not.toBeUndefined();
        expect(aNode.classes()).not.toContain('is-inline');
        wrapper.unmount();
    });
});
