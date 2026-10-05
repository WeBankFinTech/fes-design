import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import FBreadcrumb from '../breadcrumb';
import BreadcrumbItem from '../breadcrumb-item';

describe('FBreadcrumb 无默认插槽兜底（slots.default?.() || []）', () => {
    test('无 default 插槽时渲染空容器', () => {
        const wrapper = mount(FBreadcrumb);
        const root = wrapper.find('.fes-breadcrumb');
        expect(root.exists()).toBe(true);
        // slots.default 为 undefined → 兜底空数组 → 无任何子元素
        expect(root.element.children.length).toBe(0);
        wrapper.unmount();
    });

    test('有子项时渲染面包屑与默认分隔符（对照，真实父子链）', () => {
        const wrapper = mount(FBreadcrumb, {
            slots: {
                default: () => [
                    h(BreadcrumbItem, null, () => '首页'),
                    h(BreadcrumbItem, null, () => '详情'),
                ],
            },
        });
        const root = wrapper.find('.fes-breadcrumb');
        const items = wrapper.findAll('.fes-breadcrumb-item');
        expect(items.length).toBe(2);
        // 默认 separator='/' 渲染在子项间
        expect(wrapper.findAll('.fes-breadcrumb-item-separator').length).toBe(
            2,
        );
        expect(root.text()).toContain('首页');
        expect(root.text()).toContain('/');
        wrapper.unmount();
    });
});
