import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import { nextTick } from 'vue';
import FTransfer from '../transfer';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('transfer');
const cls = (sub: string) => `${prefixCls}-${sub}`;

const TREE_DATA = [
    {
        value: 'p1',
        label: '节点一',
        children: [
            { value: 'c1', label: '子节点1' },
            { value: 'c2', label: '子节点2' },
        ],
    },
    { value: 'p2', label: '节点二' },
];

describe('FTransfer 树形模式过滤（useTreeFilter）', () => {
    test('树形数据渲染树面板与计数', async () => {
        const wrapper = mount(FTransfer, {
            props: { options: TREE_DATA },
        });
        await nextTick();
        await wait();
        expect(wrapper.find(`.${cls('panel-list')}.fes-tree`).exists()).toBe(
            true,
        );
        expect(wrapper.find(`.${cls('panel-count')}`).text()).toContain('2');
        wrapper.unmount();
    });

    test('输入过滤文案后调用 tree.filter（useTreeFilter watch）', async () => {
        const wrapper = mount(FTransfer, {
            props: { options: TREE_DATA, filterable: true },
        });
        await nextTick();
        await wait();
        // 第一个过滤输入框绑定 treeFilterText
        const input = wrapper.find(`.${cls('panel')} input`);
        expect(input.exists()).toBe(true);
        const nodesBefore = wrapper.findAll('.fes-tree-node').length;
        await input.setValue('子节点1');
        await wait(200);
        // filter 效果：树仍渲染且无匹配节点被过滤（可见节点数减少）
        expect(wrapper.find(`.${cls('panel-list')}`).exists()).toBe(true);
        const nodesAfter = wrapper.findAll('.fes-tree-node').length;
        expect(nodesAfter).toBeLessThan(nodesBefore);
        wrapper.unmount();
    });

    test('过滤无匹配文案时树面板保持', async () => {
        const spy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const wrapper = mount(FTransfer, {
            props: { options: TREE_DATA, filterable: true },
        });
        await nextTick();
        await wait();
        const input = wrapper.find(`.${cls('panel')} input`);
        expect(input.exists()).toBe(true);
        await input.setValue('完全不存在');
        await wait(200);
        // 无匹配：面板保持且不产生 warn（spy 已建立，断言其未被触发）
        expect(wrapper.find(`.${cls('panel-list')}`).exists()).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
        wrapper.unmount();
    });

    test('勾选树节点触发选中并更新计数', async () => {
        const wrapper = mount(FTransfer, {
            props: { options: TREE_DATA },
        });
        await nextTick();
        await wait();
        const checkbox = wrapper.find(
            `.${cls('panel-list')} .fes-checkbox`,
        );
        expect(checkbox.exists()).toBe(true);
        await checkbox.trigger('click');
        await wait(150);
        // 树面板（oneWay 渲染）勾选效果：modelValue 数组更新为包含被勾键
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        const payload = emitted![emitted!.length - 1][0] as string[];
        expect(payload.length).toBeGreaterThan(0);
        wrapper.unmount();
    });
});
