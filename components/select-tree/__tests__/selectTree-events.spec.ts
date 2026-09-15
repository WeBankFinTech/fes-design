import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SelectTree from '../selectTree.vue';

const data = [
    {
        label: '广东',
        value: 'gd',
        children: [
            { label: '深圳', value: 'sz' },
            { label: '广州', value: 'gz' },
        ],
    },
    { label: '湖南', value: 'hn' },
];

const PopperStub = {
    template: '<div class="popper-stub"><slot name="trigger" /><slot /></div>',
};

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));

const mountSt = (props: Record<string, unknown> = {}) =>
    mount(SelectTree, {
        props: { data, ...props },
        global: { stubs: { Popper: PopperStub } },
        attachTo: document.body,
    });

describe('FSelectTree 选择交互', () => {
    test('单选：点击节点触发 update:modelValue', async () => {
        const wrapper = mountSt();
        await nextTick();
        await wait();
        // sz 未展开不在 DOM，先展开 gd
        const gd = wrapper.find(
            `.fes-tree-node[data-value='gd'] .fes-tree-node-switcher`,
        );
        await gd.trigger('click');
        await wait();
        const node = wrapper.find(`.fes-tree-node[data-value='sz']`);
        expect(node.exists()).toBe(true);
        await node.find('.fes-tree-node-content').trigger('click');
        await nextTick();
        await wait();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted![emitted!.length - 1][0]).toBe('sz');
        wrapper.unmount();
    });

    test('multiple：勾选节点 checkbox', async () => {
        const wrapper = mountSt({ multiple: true });
        await nextTick();
        await wait();
        const boxes = wrapper.findAll('.fes-tree-node .fes-checkbox');
        expect(boxes.length).toBeGreaterThan(0);
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        wrapper.unmount();
    });

    test('multiple cascade：勾父含子', async () => {
        const wrapper = mountSt({ multiple: true, cascade: true });
        await nextTick();
        await wait();
        const boxes = wrapper.findAll('.fes-tree-node .fes-checkbox');
        // 勾第一个（gd 父节点）
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        const last = emitted![emitted!.length - 1][0];
        expect(JSON.stringify(last)).toContain('sz');
        wrapper.unmount();
    });

    test('回显 modelValue 节点高亮', async () => {
        const wrapper = mountSt({ modelValue: 'hn' });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('湖南');
        wrapper.unmount();
    });

    test('多选回显渲染 tag', async () => {
        const wrapper = mountSt({ modelValue: ['sz'], multiple: true });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('深圳');
        wrapper.unmount();
    });

    test('disabled 树不可选', async () => {
        const wrapper = mountSt({
            disabled: true,
            data: [
                {
                    label: '广东',
                    value: 'gd',
                    disabled: true,
                    children: [{ label: '深圳', value: 'sz' }],
                },
            ],
        });
        await nextTick();
        await wait();
        const disabledNode = wrapper.findAll('.fes-tree-node')
            .find((n) => n.classes().some((c) => c.includes('disabled')));
        expect(disabledNode).toBeTruthy();
        wrapper.unmount();
    });
});
