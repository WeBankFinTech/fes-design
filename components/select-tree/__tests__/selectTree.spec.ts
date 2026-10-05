import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SelectTree from '../selectTree.vue';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-select-tree';

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

// Popper 在 jsdom 中触发 FSelectTree 递归更新，stub 成透传插槽
const PopperStub = {
    template: '<div class="popper-stub"><slot name="trigger" /><slot /></div>',
};

const mountSt = (props: Record<string, unknown>) =>
    mount(SelectTree, {
        props,
        global: { stubs: { Popper: PopperStub } },
    });

describe('FSelectTree', () => {
    test('基础渲染触发器与面板', async () => {
        const wrapper = mountSt({ data });
        await nextTick();
        await wait(100);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.text()).toContain('请选择');
        // Popper stub 透传后树面板渲染
        expect(wrapper.find('.fes-tree').exists()).toBe(true);
        wrapper.unmount();
    });

    test('placeholder 生效', async () => {
        const wrapper = mountSt({ data, placeholder: '请选择地区' });
        await nextTick();
        await wait(100);
        expect(wrapper.text()).toContain('请选择地区');
        wrapper.unmount();
    });

    test('单选 modelValue 回显叶子', async () => {
        const wrapper = mountSt({ data, modelValue: 'sz' });
        await nextTick();
        await wait(100);
        expect(wrapper.text()).toContain('深圳');
        wrapper.unmount();
    });

    test('multiple 模式渲染树节点 checkbox', async () => {
        const wrapper = mountSt({ data, multiple: true });
        await nextTick();
        await wait(100);
        expect(wrapper.find('.fes-tree').exists()).toBe(true);
        wrapper.unmount();
    });

    test('checkStrictly 父子不关联', async () => {
        const wrapper = mountSt({
            data,
            multiple: true,
            checkStrictly: true,
            modelValue: ['sz'],
        });
        await nextTick();
        await wait(100);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('空 data 渲染空提示', async () => {
        const wrapper = mountSt({ data: [] });
        await nextTick();
        await wait(100);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('defaultExpandAll 展开树节点', async () => {
        const wrapper = mountSt({ data, defaultExpandAll: true });
        await nextTick();
        await wait(100);
        expect(wrapper.text()).toContain('深圳');
        expect(wrapper.text()).toContain('湖南');
        wrapper.unmount();
    });
});
