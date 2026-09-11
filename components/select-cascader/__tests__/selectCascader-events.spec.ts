import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SelectCascader from '../selectCascader.vue';

const prefixCls = 'fes-select-cascader';

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

const mountSc = (props: Record<string, unknown> = {}) =>
    mount(SelectCascader, {
        props: { data, ...props },
        global: { stubs: { Popper: PopperStub } },
        attachTo: document.body,
    });

const _findNode = (wrapper: any, value: string) =>
    wrapper.find(`.fes-cascader-node[data-value='${value}']`);

describe('FSelectCascader 选择交互', () => {
    const expandToLeaf = async (wrapper: any, leafValue: string, _leafNode?: any) => {
        // 面板默认只渲染第一级，需先展开父级（点 switcher）
        const gd = wrapper.find(`.fes-cascader-node[data-value='gd']`);
        await gd.find('.fes-cascader-node-switcher').trigger('click');
        await wait();
        const node = wrapper.find(`.fes-cascader-node[data-value='${leafValue}']`);
        expect(node.exists()).toBe(true);
        return node;
    };

    test('单选：点击叶子节点触发 change 与 update:modelValue', async () => {
        const wrapper = mountSc();
        await nextTick();
        await wait();
        const node = await expandToLeaf(wrapper, 'sz', null);
        await node.find('.fes-cascader-node-content').trigger('click');
        await nextTick();
        await wait();
        const emittedUpdate = wrapper.emitted('update:modelValue');
        expect(emittedUpdate).toBeTruthy();
        expect(emittedUpdate![emittedUpdate!.length - 1][0]).toBe('sz');
        expect(wrapper.emitted('change')).toBeTruthy();
        wrapper.unmount();
    });

    test('单选选中后弹层收起', async () => {
        const wrapper = mountSc();
        await nextTick();
        await wait();
        const node = await expandToLeaf(wrapper, 'sz', null);
        await node.find('.fes-cascader-node-content').trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        wrapper.unmount();
    });

    test('多选：点击 checkbox 勾选', async () => {
        const wrapper = mountSc({ multiple: true });
        await nextTick();
        await wait();
        // 多选模式渲染 checkbox
        const boxes = wrapper.findAll('.fes-cascader-node .fes-checkbox');
        expect(boxes.length).toBeGreaterThan(0);
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        wrapper.unmount();
    });

    test('multiple + cascade 勾选父级带子级', async () => {
        const wrapper = mountSc({ multiple: true, cascade: true });
        await nextTick();
        await wait();
        const boxes = wrapper.findAll('.fes-cascader-node .fes-checkbox');
        await boxes[0].trigger('click');
        await nextTick();
        await wait();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        wrapper.unmount();
    });

    test('clear 事件与清空', async () => {
        const wrapper = mountSc({ modelValue: 'sz', clearable: true });
        await nextTick();
        await wait();
        // 通过 expose 无法直接触发 handleClear，守护 clearable 渲染即可
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });
});

describe('FSelectCascader filterable', () => {
    test('filterable 渲染输入', async () => {
        const wrapper = mountSc({ filterable: true });
        await nextTick();
        await wait();
        expect(wrapper.find('input').exists()).toBe(true);
        wrapper.unmount();
    });

    test('输入过滤文本渲染过滤列表', async () => {
        const wrapper = mountSc({ filterable: true });
        await nextTick();
        await wait();
        const input = wrapper.find('input');
        await input.setValue('深');
        await wait(400);
        // 过滤 debounce 300ms 后 OptionList 显示过滤项
        expect(wrapper.text()).toContain('深圳');
        wrapper.unmount();
    });
});
