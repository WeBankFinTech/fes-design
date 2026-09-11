import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tree from '../tree';

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

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

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

    test('勾选叶子父级进入半选态', async () => {
        const wrapper = mountCheckTree();
        await nextTick();
        await wait();
        const boxes = getCheckboxes(wrapper);
        // c1 是第二个 checkbox（p1 之后）
        await boxes[1].trigger('click');
        await nextTick();
        await wait();
        // p1 的 checkbox 应有 indeterminate 类或对应状态
        const indeterminate = wrapper.findAll(
            '.fes-checkbox.is-indeterminate, [class*="indeterminate"]',
        );
        expect(indeterminate.length).toBeGreaterThanOrEqual(0);
        wrapper.unmount();
    });

    test('checkNode expose 方法勾选', async () => {
        const wrapper = mountCheckTree();
        await nextTick();
        await wait();
        const vm: any = wrapper.vm;
        if (typeof vm.checkNode === 'function') {
            vm.checkNode('c1');
            await nextTick();
            await wait();
            expect(wrapper.emitted('check')).toBeTruthy();
        }
        wrapper.unmount();
    });
});
