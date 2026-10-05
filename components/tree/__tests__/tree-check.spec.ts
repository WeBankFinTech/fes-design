import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tree from '../tree';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-tree';

const makeData = () => [
    {
        label: '父1',
        value: 'p1',
        children: [
            { label: '子1', value: 'c1' },
            { label: '子2', value: 'c2' },
        ],
    },
    { label: '父2', value: 'p2' },
];

const mountCheckTree = (extra: Record<string, unknown> = {}) =>
    mount(Tree, {
        props: {
            data: makeData(),
            defaultExpandAll: true,
            checkable: true,
            ...extra,
        },
        attachTo: document.body,
    });

const getCheckboxes = (wrapper: any) =>
    wrapper.findAll(`.${prefixCls}-node .fes-checkbox`);

// 状态断言辅助（技能 4A-1 模式）：节点勾选/半选状态一眼可读
const isChecked = (box: any) =>
    box.classes().includes('is-checked')
    || box.classes().includes('fes-checkbox-is-checked');
const isIndeterminate = (box: any) =>
    box.classes().includes('is-indeterminate')
    || box.classes().includes('fes-checkbox-is-indeterminate');

describe('FTree checkStrictly 级联策略', () => {
    test('cascade=true：勾父全选子', async () => {
        const wrapper = mountCheckTree({ cascade: true });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        // p1 是第一个 checkbox
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        const events = wrapper.emitted('check');
        expect(events).toBeTruthy();
        // 勾选 p1 后 keys 应包含 p1、c1、c2
        const payload = events![0][0] as any;
        const keys = payload.checkedKeys ?? payload;
        const keyList = Array.isArray(keys) ? keys : keys.checkedKeys;
        expect(JSON.stringify(keyList)).toContain('c1');
        // 状态机断言（技能 4A-9）：父勾选 → 子全勾；再取消子 → 父转半选
        const freshBoxes = getCheckboxes(wrapper);
        expect(isChecked(freshBoxes[0])).toBe(true);
        expect(isChecked(freshBoxes[1])).toBe(true);
        expect(isChecked(freshBoxes[2])).toBe(true);
        await freshBoxes[1].trigger('click');
        await nextTick();
        await wait();
        const afterBoxes = getCheckboxes(wrapper);
        // cascade 模式：父级半选时仅 is-indeterminate（不带 is-checked）
        expect(isIndeterminate(afterBoxes[0])).toBe(true);
        expect(isChecked(afterBoxes[0])).toBe(false);
        expect(isChecked(afterBoxes[1])).toBe(false);
        wrapper.unmount();
    });

    test('checkStrictly all：父子不关联', async () => {
        const wrapper = mountCheckTree({ checkStrictly: 'all' });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        await boxes[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('check')).toBeTruthy();
        wrapper.unmount();
    });

    test('checkStrictly child：仅叶子入 keys', async () => {
        const wrapper = mountCheckTree({ checkStrictly: 'child' });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('check')).toBeTruthy();
        wrapper.unmount();
    });

    test('cascade 下勾选叶子父级进入半选态', async () => {
        // 默认 checkStrictly=ALL 不级联：叶子勾选不产生父级半选，
        // 标题语义（叶子→父半选）须 cascade=true 才成立
        const wrapper = mountCheckTree({ cascade: true });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        // c1 是第二个 checkbox（p1 之后）
        await boxes[1].trigger('click');
        await nextTick();
        await wait();
        const indeterminate = wrapper.findAll(
            `.${prefixCls}-node .fes-checkbox.is-indeterminate`,
        );
        // 勾选叶子 c1 → 父 p1 转半选（仅 1 个半选框）
        expect(indeterminate.length).toBe(1);
        expect(isIndeterminate(indeterminate[0])).toBe(true);
        // 子只勾了 c1：p1 不应同时带 is-checked
        expect(isChecked(indeterminate[0])).toBe(false);
        wrapper.unmount();
    });

    test('checkNode expose 方法勾选', async () => {
        const wrapper = mountCheckTree();
        await nextTick();
        await wait();
        const vm: any = wrapper.vm;
        expect(typeof vm.checkNode).toBe('function');
        vm.checkNode('c1');
        await nextTick();
        await wait();
        expect(wrapper.emitted('check')).toBeTruthy();
        wrapper.unmount();
    });
});

describe('FTree checkStrictly 分支补充', () => {
    test('checkStrictly parent：勾叶子后父级收敛', async () => {
        const wrapper = mountCheckTree({ checkStrictly: 'parent' });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        await boxes[1].trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('check')).toBeTruthy();
        // 再勾父级节点
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        wrapper.unmount();
    });

    test('checkStrictly all：勾父级后取消勾选', async () => {
        const wrapper = mountCheckTree({ checkStrictly: 'all' });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        // 取消勾选 → toggleChecked 取消分支
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('check')!.length).toBe(2);
        wrapper.unmount();
    });

    test('勾选后取消：父级/子级反向清理', async () => {
        const wrapper = mountCheckTree();
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        // 勾父级（联动子级）
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        // 取消子级 → 父级半选/取消
        await boxes[1].trigger('click');
        await nextTick();
        await wait();
        // 取消父级
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        // 三轮勾选/取消均触发 check 事件
        expect(wrapper.emitted('check')!.length).toBe(3);
        wrapper.unmount();
    });

    test('cascade=true + checkStrictly parent：勾选与取消', async () => {
        const wrapper = mountCheckTree({ cascade: true, checkStrictly: 'parent' });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        // 勾叶子
        await boxes[1].trigger('click');
        await nextTick();
        await wait();
        // 勾满父级（全部子级选中 → 父级收敛）
        await boxes[2].trigger('click');
        await nextTick();
        await wait();
        // 取消叶子 → PARENT 收敛过滤分支
        await boxes[2].trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('check')!.length).toBe(3);
        wrapper.unmount();
    });

    test('cascade=true + checkStrictly child：勾选与取消', async () => {
        const wrapper = mountCheckTree({ cascade: true, checkStrictly: 'child' });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        await boxes[1].trigger('click');
        await nextTick();
        await wait();
        // 取消
        await boxes[1].trigger('click');
        await nextTick();
        await wait();
        // 勾父级 → CHILD 策略
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('check')!.length).toBe(4);
        wrapper.unmount();
    });

    test('cascade=true + checkStrictly all：勾选后取消（computeCheckedKeys 反向）', async () => {
        const wrapper = mountCheckTree({ cascade: true, checkStrictly: 'all' });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        // 已勾选状态下再次触发 → isChecked=true 分支（清理子级/父级）
        await boxes[2].trigger('click');
        await nextTick();
        await wait();
        await boxes[1].trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('check')!.length).toBe(3);
        wrapper.unmount();
    });

    test('checkNode expose 带 event 参数勾选/取消', async () => {
        const wrapper = mountCheckTree({ cascade: true, checkStrictly: 'child' });
        await nextTick();
        await wait();
        const vm: any = wrapper.vm;
        expect(typeof vm.checkNode).toBe('function');
        vm.checkNode('c1', new Event('click'));
        await nextTick();
        await wait();
        vm.checkNode('c2', new Event('click'));
        await nextTick();
        await wait();
        vm.checkNode('c2', new Event('click'));
        await nextTick();
        await wait();
        expect(wrapper.emitted('check')!.length).toBe(3);
        wrapper.unmount();
    });

    test('isLeaf 显式指定与 remote 模式推断', async () => {
        const data = [
            { label: '叶子', value: 'leaf', isLeaf: true },
            {
                label: '父',
                value: 'f',
                children: [{ label: '子', value: 's' }],
            },
        ];
        const wrapper = mount(Tree, {
            props: { data, checkable: true, defaultExpandAll: true } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        // isLeaf 效果 1：叶子 switcher 仅占位（无展开图标）
        const leafNode = wrapper.find(`.${prefixCls}-node[data-value='leaf']`);
        expect(leafNode.exists()).toBe(true);
        expect(
            leafNode.find(`.${prefixCls}-node-switcher-icon`).exists(),
        ).toBe(false);
        // isLeaf 效果 2：勾选叶子产生 check 事件
        expect(wrapper.emitted('check')).toBeTruthy();
        wrapper.unmount();

        const remote = mount(Tree, {
            props: {
                data: [{ label: '远', value: 'r' }],
                checkable: true,
                remote: true,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        remote.unmount();
    });
});
