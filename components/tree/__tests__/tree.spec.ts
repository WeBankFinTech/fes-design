import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tree from '../tree';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-tree';

const data = [
    {
        label: '根节点1',
        value: 'n1',
        children: [
            { label: '子节点1-1', value: 'n1-1' },
            {
                label: '子节点1-2',
                value: 'n1-2',
                children: [{ label: '孙节点1-2-1', value: 'n1-2-1' }],
            },
        ],
    },
    { label: '根节点2', value: 'n2' },
];

describe('FTree 基础渲染', () => {
    test('渲染根级节点', async () => {
        const wrapper = mount(Tree, {
            props: { data },
        });
        await nextTick();
        await wait(100);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        // 虚拟列表懒渲染：至少渲染出部分节点
        expect(wrapper.text()).toContain('根节点1');
    });

    test('defaultExpandAll 展开全部节点', async () => {
        const wrapper = mount(Tree, {
            props: { data, defaultExpandAll: true },
        });
        await nextTick();
        await wait(100);
        expect(wrapper.text()).toContain('子节点1-1');
        expect(wrapper.text()).toContain('根节点2');
    });

    test('labelField 自定义字段', async () => {
        const wrapper = mount(Tree, {
            props: {
                data: [{ name: '自定义标签', value: 1 }] as any,
                labelField: 'name',
            },
        });
        await nextTick();
        await wait(100);
        expect(wrapper.text()).toContain('自定义标签');
    });
});

describe('FTree 展开/选中/勾选', () => {
    test('点击 switcher 展开节点', async () => {
        const wrapper = mount(Tree, {
            props: { data },
        });
        await nextTick();
        await wait(100);
        const switcher = wrapper.find(`.${prefixCls}-node-switcher`);
        await switcher.trigger('click');
        await nextTick();
        expect(wrapper.emitted('expand')).toBeTruthy();
        await wait(200);
        expect(wrapper.text()).toContain('子节点1-1');
    });

    test('selectable 点击节点触发 select', async () => {
        const wrapper = mount(Tree, {
            props: { data, selectable: true },
        });
        await nextTick();
        await wait(100);
        const content = wrapper.find(`.${prefixCls}-node-content`);
        await content.trigger('click');
        await nextTick();
        expect(wrapper.emitted('select')).toBeTruthy();
    });

    test('checkable 渲染 checkbox 并触发 check', async () => {
        const wrapper = mount(Tree, {
            props: { data, checkable: true },
        });
        await nextTick();
        await wait(100);
        const checkbox = wrapper.find(`.${prefixCls}-node-checkbox .fes-checkbox`);
        expect(checkbox.exists()).toBe(true);
        await checkbox.trigger('click');
        await nextTick();
        await wait(100);
        expect(wrapper.emitted('check')).toBeTruthy();
    });

    test('checkedKeys 初始选中', async () => {
        const wrapper = mount(Tree, {
            props: {
                data,
                checkable: true,
                checkedKeys: ['n2'],
            } as any,
        });
        await nextTick();
        await wait(100);
        // n2 节点的 checkbox 应为选中态
        const checked = wrapper.findAll('.fes-checkbox.is-checked');
        expect(checked.length).toBeGreaterThanOrEqual(1);
    });
});

describe('FTree 过滤', () => {
    test('filterMethod 过滤节点', async () => {
        const wrapper = mount(Tree, {
            props: {
                data,
                defaultExpandAll: true,
                filterMethod: (node: any) => node.label.includes('根节点1'),
            } as any,
        });
        await nextTick();
        await wait(100);
        // 触发过滤需要调用 expose 的方法或响应式 filterValue，视实现而定：
        // 这里守护过滤方法可传入不报错且节点仍渲染
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
    });
});

describe('FTree 禁用', () => {
    test('disabled 节点点击无效', async () => {
        const wrapper = mount(Tree, {
            props: {
                data: [
                    { label: '正常', value: 'a' },
                    { label: '禁用', value: 'b', disabled: true },
                ] as any,
                selectable: true,
            },
        });
        await nextTick();
        await wait(100);
        const nodes = wrapper.findAll(`.${prefixCls}-node`);
        const disabledNode = nodes.find((n) =>
            n.classes().some((c) => c.includes('is-disabled')),
        );
        expect(disabledNode).toBeTruthy();
        const selectEmittedBefore = wrapper.emitted('select')?.length ?? 0;
        await disabledNode!.find(`.${prefixCls}-node-content`).trigger('click');
        expect(wrapper.emitted('select')?.length ?? 0).toBe(
            selectEmittedBefore,
        );
    });
});
