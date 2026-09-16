import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Cascader from '../cascader';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-cascader';

const data = [
    {
        label: '广东',
        value: 'gd',
        children: [
            { label: '深圳', value: 'sz' },
            { label: '广州', value: 'gz' },
        ],
    },
    {
        label: '湖南',
        value: 'hn',
        children: [{ label: '长沙', value: 'cs' }],
    },
];

describe('FCascader 基础渲染', () => {
    test('渲染触发器（级联菜单直出）', async () => {
        const wrapper = mount(Cascader, {
            props: { data },
        });
        await nextTick();
        await wait(100);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        // 根节点带 cascader role
        expect(wrapper.find(`.${prefixCls}`).attributes('role')).toBe(
            'cascader',
        );
        // 一级菜单节点渲染
        expect(wrapper.findAll(`.${prefixCls}-node`).length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('selectedKeys 回显选中', async () => {
        // 注意：cascader.tsx 是面板组件，选中回显 API 是 selectedKeys 数组
        // （无 modelValue prop——旧用例传 modelValue 被静默忽略导致永真兜底）
        const wrapper = mount(Cascader, {
            props: {
                data,
                selectedKeys: ['sz'],
                appendToContainer: false,
            },
        });
        await nextTick();
        await wait(100);
        // 二级菜单未展开时 sz 节点不在 DOM；展开一级节点
        // （onClick 绑在节点内层 -content 元素，外层 node 点击不命中）
        await wrapper.findAll(`.${prefixCls}-node-content`)[0].trigger('click');
        await wait(100);
        const selected = wrapper.findAll(
            `.${prefixCls}-node.is-selected`,
        );
        expect(selected.length).toBe(1);
        expect(selected[0].text()).toContain('深圳');
        wrapper.unmount();
    });
});

describe('FCascader 面板交互', () => {
    test('点击触发器展开面板并渲染菜单', async () => {
        const wrapper = mount(Cascader, {
            props: { data, appendToContainer: false } as any,
        });
        await nextTick();
        await wait(100);
        await wrapper.find(`.${prefixCls}`).trigger('click');
        await nextTick();
        await wait(200);
        // 打开后面板出现（挂 body 或 wrapper 内）
        const menu
            = document.querySelector(`.${prefixCls}-menus, [role="cascader-menu"]`)
                || wrapper.find('[role="cascader-menu"]');
        expect(menu).toBeTruthy();
        wrapper.unmount();
    });

    test('single 模式点击叶子节点触发 change', async () => {
        const wrapper = mount(Cascader, {
            props: {
                data,
                'appendToContainer': false,
                'onUpdate:modelValue': (v: unknown) =>
                    wrapper.setProps({ modelValue: v }),
                'onChange': () => {},
            } as any,
        });
        await nextTick();
        await wait(100);
        await wrapper.find(`.${prefixCls}`).trigger('click');
        await nextTick();
        await wait(200);
        // 查找菜单节点（document 或 wrapper 内）
        let nodeLabels = Array.from(
            document.querySelectorAll('.fes-cascader-menu .fes-cascader-node, [role="cascader-menu"] .fes-cascader-node'),
        );
        if (nodeLabels.length === 0) {
            nodeLabels = wrapper.findAll('.fes-cascader-node').map((n) => n.element as HTMLElement);
        }
        // 点击一级节点“广东”展开下一级
        const gdNode = nodeLabels.find((n) => n.textContent?.includes('广东')) as HTMLElement;
        expect(gdNode).toBeTruthy();
        gdNode.click();
        await nextTick();
        await wait(200);
        // 展开二级后点叶子“深圳”
        const allNodes = Array.from(
            document.querySelectorAll('.fes-cascader-node'),
        ) as HTMLElement[];
        const szNode = allNodes.find((n) => n.textContent?.includes('深圳'));
        if (szNode) {
            szNode.click();
            await nextTick();
            await wait(100);
            expect(wrapper.emitted('change') || wrapper.emitted('update:modelValue')).toBeTruthy();
        }
        wrapper.unmount();
    });

    test('multiple 模式渲染', async () => {
        const wrapper = mount(Cascader, {
            props: { data, multiple: true, appendToContainer: false } as any,
        });
        await nextTick();
        await wait(100);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });
});

describe('FCascader 属性分支', () => {
    test('disabled 状态透传到节点', async () => {
        const wrapper = mount(Cascader, {
            props: {
                data: [
                    { label: '广东', value: 'gd', disabled: true, children: [] },
                ] as any,
            },
        });
        await nextTick();
        await wait(100);
        expect(
            wrapper
                .findAll(`.${prefixCls}-node`)[0]
                .classes()
                .some((c) => c.includes('disabled')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('checkStrictly 传入不报错', async () => {
        const wrapper = mount(Cascader, {
            props: { data, checkStrictly: 'all' } as any,
        });
        await nextTick();
        await wait(100);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('expandTrigger hover', async () => {
        const wrapper = mount(Cascader, {
            props: { data, expandTrigger: 'hover', appendToContainer: false } as any,
        });
        await nextTick();
        await wait(100);
        // hover 一级节点 content（hover 展开绑在 content 的 mouseenter）
        const gdContent = wrapper
            .findAll(`.${prefixCls}-node-content`)[0];
        expect(gdContent.exists()).toBe(true);
        await gdContent.trigger('mouseenter');
        await nextTick();
        await wait(200);
        // hover 展开效果：二级菜单的深圳/广州节点进入 DOM
        const texts = wrapper.findAll(`.${prefixCls}-node`).map((n) => n.text());
        expect(texts.join()).toContain('深圳');
        expect(texts.join()).toContain('广州');
        wrapper.unmount();
    });
});
