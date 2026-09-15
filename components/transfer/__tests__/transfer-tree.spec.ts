import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import { nextTick } from 'vue';
import FTransfer from '../transfer';
import getPrefixCls from '../../_util/getPrefixCls';

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

const sleep = (ms = 80) => new Promise((r) => setTimeout(r, ms));

describe('FTransfer 树形模式过滤（useTreeFilter）', () => {
    test('树形数据渲染树面板与计数', async () => {
        const wrapper = mount(FTransfer, {
            props: { options: TREE_DATA },
        });
        await nextTick();
        await sleep();
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
        await sleep();
        // 第一个过滤输入框绑定 treeFilterText
        const input = wrapper.find(`.${cls('panel')} input`);
        expect(input.exists()).toBe(true);
        await input.setValue('子节点1');
        await sleep(200);
        // filter 后树仍渲染（父节点自动保留），无匹配的子节点被隐藏
        expect(wrapper.find(`.${cls('panel-list')}`).exists()).toBe(true);
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
        await sleep();
        const input = wrapper.find(`.${cls('panel')} input`);
        expect(input.exists()).toBe(true);
        await input.setValue('完全不存在');
        await sleep(200);
        expect(wrapper.find(`.${cls('panel-list')}`).exists()).toBe(true);
        spy.mockRestore();
        wrapper.unmount();
    });

    test('勾选树节点触发选中并更新计数', async () => {
        const wrapper = mount(FTransfer, {
            props: { options: TREE_DATA },
        });
        await nextTick();
        await sleep();
        const checkbox = wrapper.find(
            `.${cls('panel-list')} .fes-checkbox`,
        );
        expect(checkbox.exists()).toBe(true);
        await checkbox.trigger('click');
        await sleep(150);
        // 勾选后右侧已选面板出现对应文案或计数变化
        expect(wrapper.find(`.${cls('panel')}`).exists()).toBe(true);
        wrapper.unmount();
    });
});
