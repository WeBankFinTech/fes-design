import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Menu from '../menu';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('menu');

const options = [
    { value: '1', label: '菜单项一' },
    { value: '2', label: '菜单项二', disabled: true },
    { value: '3', label: '菜单项三' },
];

describe('Menu 基础渲染', () => {
    test('垂直模式渲染菜单项', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'vertical', options },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.text()).toContain('菜单项一');
        expect(wrapper.findAll(`.${prefixCls}-item`).length).toBe(3);
    });

    test('水平模式渲染', async () => {
        const wrapper = mount(Menu, {
            props: { mode: 'horizontal', options },
        });
        await nextTick();
        expect(
            wrapper
                .find(`.${prefixCls}`)
                .classes()
                .some((c) => c.includes('horizontal')),
        ).toBe(true);
    });

    test('group 分组渲染', async () => {
        const wrapper = mount(Menu, {
            props: {
                options: [
                    {
                        value: 'g1',
                        label: '分组一',
                        isGroup: true,
                        children: [{ value: 'a', label: '项A' }],
                    },
                    { value: 'b', label: '项B' },
                ] as any,
            },
        });
        await nextTick();
        expect(wrapper.text()).toContain('分组一');
        expect(wrapper.text()).toContain('项A');
        expect(wrapper.text()).toContain('项B');
    });
});

describe('Menu 交互', () => {
    test('点击菜单项更新 modelValue 并触发 select', async () => {
        const wrapper = mount(Menu, {
            props: {
                options,
                'modelValue': '1',
                'onUpdate:modelValue': (v: string) =>
                    wrapper.setProps({ modelValue: v }),
            },
        });
        await nextTick();
        const items = wrapper.findAll(`.${prefixCls}-item`);
        await items[2].find(`.${prefixCls}-item, div`).trigger('click');
        await nextTick();
        expect(wrapper.emitted('select')).toBeTruthy();
        expect((wrapper.emitted('select')![0][0] as any).value).toBe('3');
    });

    test('disabled 菜单项点击无效', async () => {
        const wrapper = mount(Menu, {
            props: { options, modelValue: '1' },
        });
        await nextTick();
        const items = wrapper.findAll(`.${prefixCls}-item`);
        expect(
            items[1]
                .classes()
                .some((c) => c.includes('is-disabled')),
        ).toBe(true);
        await items[1].trigger('click');
        expect(wrapper.emitted('select')).toBeFalsy();
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    test('选中项高亮类名', async () => {
        const wrapper = mount(Menu, {
            props: { options, modelValue: '1' },
        });
        await nextTick();
        const items = wrapper.findAll(`.${prefixCls}-item`);
        expect(items[0].classes().some((c) => c.includes('is-active'))).toBe(
            true,
        );
        expect(items[2].classes().some((c) => c.includes('is-active'))).toBe(
            false,
        );
    });

    test('subMenu 垂直模式展开收起', async () => {
        const wrapper = mount(Menu, {
            props: {
                mode: 'vertical',
                options: [
                    {
                        value: 's1',
                        label: '子菜单',
                        children: [{ value: 's1-1', label: '子项1' }],
                    },
                    { value: 'x', label: '普通项' },
                ] as any,
            },
        });
        await nextTick();
        await nextTick();
        expect(wrapper.text()).toContain('子菜单');
        // 点击 sub-menu 标题展开子菜单；收起时子项容器 v-show 隐藏
        const subTitle = wrapper.find('.fes-sub-menu-wrapper');
        expect(subTitle.exists()).toBe(true);
        const childrenEl = wrapper.find('.fes-sub-menu-children');
        expect(childrenEl.exists()).toBe(true);
        // 初始收起
        expect(childrenEl.attributes('style')).toContain('display: none');
        await subTitle.trigger('click');
        await nextTick();
        // 展开后重新查询：v-show 移除，style 属性消失
        const expandedEl = wrapper.find('.fes-sub-menu-children');
        expect(expandedEl.attributes('style')).toBeUndefined();
        expect(wrapper.text()).toContain('子项1');
        // 再次点击收起（收起走 FadeInExpandTransition，v-show 在离开动画后恢复；
        // 断言根菜单的 expanded 状态回退即可）
        await subTitle.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:expandedKeys')).toBeTruthy();
        const lastEmit = wrapper.emitted('update:expandedKeys')!.pop() as any[];
        expect(lastEmit[0]).toEqual([]);
    });
});
