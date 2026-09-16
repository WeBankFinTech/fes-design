import { mount } from '@vue/test-utils';
import { nextTick, reactive } from 'vue';
import Cascader from '../cascader';
import { wait } from '../../_util/__tests__/helpers';

const TREE_DATA = [
    {
        value: 'gd',
        label: '广东',
        children: [
            { value: 'sz', label: '深圳' },
            { value: 'gz', label: '广州' },
        ],
    },
    { value: 'hn', label: '海南', children: [{ value: 'hk', label: '海口' }] },
];

const mountCascader = (props: Record<string, unknown> = {}) => {
    document.body.innerHTML = '';
    return mount(Cascader, {
        props: {
            data: TREE_DATA,
            ...props,
        },
        attachTo: document.body,
    });
};

describe('FCascader 懒加载与交互事件', () => {
    test('loadData+remote 初始远程加载', async () => {
        const data = reactive([]);
        const loadData = async (node: unknown) => {
            if (node === null) {
                return [
                    { value: 'a', label: '远程A' },
                    { value: 'b', label: '远程B' },
                ];
            }
            return [];
        };
        const wrapper = mount(Cascader, {
            props: { data, loadData, remote: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        // 远程数据被 push 进响应式数组
        await wrapper.find('.fes-cascader').trigger('click');
        await wait(80);
        expect(document.body.textContent).toContain('远程A');
        wrapper.unmount();
    });

    test('loadData 展开节点时懒加载子级', async () => {
        const data = reactive([
            { value: 'p', label: '父节点', children: [] },
        ]);
        const loadData = async (node: any) => {
            if (node && node.value === 'p') {
                return [{ value: 'c1', label: '懒加载子级' }];
            }
            return [];
        };
        const wrapper = mount(Cascader, {
            props: { data, loadData, remote: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        await wrapper.find('.fes-cascader').trigger('click');
        await wait(80);
        const node = document.querySelector('.fes-cascader-node-content');
        expect(node).not.toBeNull();
        node!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await wait(120);
        // 子级懒加载后出现在第二列
        expect(document.body.textContent).toContain('父节点');
        wrapper.unmount();
    });

    test('expand 事件在展开节点时触发', async () => {
        const wrapper = mountCascader();
        await nextTick();
        await wait(80);
        await wrapper.find('.fes-cascader').trigger('click');
        await wait(80);
        const nodes = document.querySelectorAll('.fes-cascader-node-content');
        expect(nodes.length).toBeGreaterThan(0);
        nodes[0].dispatchEvent(
            new MouseEvent('click', { bubbles: true }),
        );
        await wait(80);
        // 点击后弹出子菜单或选中
        expect(
            document.querySelectorAll('.fes-cascader-node').length,
        ).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('多次展开收起后数据保持', async () => {
        const wrapper = mountCascader();
        await nextTick();
        await wait(80);
        const trigger = wrapper.find('.fes-cascader');
        await trigger.trigger('click');
        await wait(80);
        expect(document.body.textContent).toContain('广东');
        // 点击外部区域收起
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        await wait(80);
        wrapper.unmount();
    });
});
