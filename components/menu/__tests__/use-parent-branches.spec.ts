import { defineComponent, h, inject, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import useParent from '../useParent';
import { CHILDREN_KEY } from '../const';
import FMenu from '../menu';

interface ChildApi {
    addChild: (c: { uid: number; type?: string }) => void;
    removeChild: (c: { uid: number; type?: string }) => void;
}

const mk = (uid: number) => ({ uid, type: 'menu', value: uid });

/**
 * 直接调用 useParent 的真实调用链：provide 由父组件发出，
 * 子组件 inject 拿到 addChild/removeChild 供防呆分支验证。
 */
const mountHarness = () => {
    const state: {
        api?: ChildApi;
        children?: { uid: number }[];
    } = {};
    const Child = defineComponent({
        setup() {
            state.api = inject(CHILDREN_KEY);
            return () => h('div');
        },
    });
    const wrapper = mount(
        defineComponent({
            setup() {
                const { children } = useParent();
                state.children = children as unknown as { uid: number }[];
                return () =>
                    h('div', { class: 'probe-count' }, [
                        String(children.length),
                        h(Child),
                    ]);
            },
        }),
    );
    return { wrapper, state };
};

describe('menu/useParent 子项注册', () => {
    test('addChild 按 uid 去重，removeChild 按 uid 精确查找（真实 hook 调用）', async () => {
        const { wrapper, state } = mountHarness();
        state.api!.addChild(mk(1));
        await nextTick();
        expect(wrapper.find('.probe-count').text()).toBe('1');
        // 重复 uid：children.every 返回 false → 不重复添加（防御分支）
        state.api!.addChild(mk(1));
        await nextTick();
        expect(state.children!.length).toBe(1);
        state.api!.addChild(mk(2));
        await nextTick();
        expect(state.children!.length).toBe(2);
        // 未注册 uid：index === -1 → 不 splice（防御分支）
        state.api!.removeChild(mk(99));
        await nextTick();
        expect(state.children!.length).toBe(2);
        // 命中：index 0 → splice
        state.api!.removeChild(mk(1));
        await nextTick();
        expect(state.children!.length).toBe(1);
        wrapper.unmount();
    });

    test('FMenu options 模式挂载走真实 addChild/removeChild 链路', async () => {
        const wrapper = mount(FMenu, {
            props: {
                options: [
                    { label: '菜单一', value: '1' },
                    {
                        label: '菜单二',
                        value: '2',
                        children: [{ label: '子项', value: '2-1' }],
                    },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        expect(wrapper.find('.fes-menu').exists()).toBe(true);
        expect(wrapper.findAll('.fes-menu-item').length).toBeGreaterThan(0);
        wrapper.unmount();
        await nextTick();
        // 卸载触发 removeChild（真实链路），组件正常销毁
        expect(document.querySelector('.fes-menu')).toBeNull();
    });
});
