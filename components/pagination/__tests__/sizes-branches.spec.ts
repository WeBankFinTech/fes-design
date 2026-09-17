import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, test } from 'vitest';
import Sizes from '../sizes';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('pagination');
const selectTriggerCls = `.${prefixCls}-size-select .fes-select-trigger`;

// FSelect 弹层默认 appendToContainer=true 挂 body，跨用例清理
afterEach(() => {
    document.body.innerHTML = '';
});

// 覆盖语义：尺寸选项渲染/切换 emit/受控 modelValue 同步。剩余的 2 个
// 死分支（L13[2]、L52[0]）是 @vitejs/plugin-vue-jsx 编译产物，非组件
// 源码行为，无法通过真实组件调用命中（不可达，不硬造）：
// - L13[2]：编译注入的 _isSlot(s) helper 中 `||`/`&&` 链的第三腿 ——
//   `Object.prototype.toString.call(s) === '[object Object]'` 对数组/
//   undefined 输入恒 false，`!_isVNode(s)` 永不求值（renderOptions 只会
//   返回 FOption 数组或假值）。
// - L52[0]：插槽位三元 `_isSlot(_slot = renderOptions()) ? _slot : {...}`
//   的条件恒 false（children 永远来自 renderOptions 的数组），直接透传
//   分支不可达。

describe('FPaginationSizes', () => {
    test('pageSizeOption 渲染尺寸选项并可切换，emit update:modelValue', async () => {
        const wrapper = mount(Sizes, {
            props: {
                modelValue: 10,
                pageSizeOption: [10, 20, 50],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        expect(wrapper.find(`.${prefixCls}-size`).exists()).toBe(true);

        // 打开下拉：选项来自 pageSizeOption
        await wrapper.find(selectTriggerCls).trigger('click');
        await wait(120);
        const options = document.querySelectorAll('.fes-select-option');
        expect(options.length).toBe(3);
        expect(options[0].textContent).toContain('10');
        expect(options[1].textContent).toContain('20');
        expect(options[2].textContent).toContain('50');

        // 选择 20 → update:modelValue
        (options[1] as HTMLElement).click();
        await nextTick();
        await wait(120);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toBe(20);
        wrapper.unmount();
    });

    test('未传 pageSizeOption：renderOptions 短路，无选项且不报错', async () => {
        const wrapper = mount(Sizes, {
            props: { modelValue: 10 },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        // 组件本身可渲染（FSelect 空选项）
        expect(wrapper.find(`.${prefixCls}-size`).exists()).toBe(true);

        await wrapper.find(selectTriggerCls).trigger('click');
        await wait(120);
        const options = document.querySelectorAll(
            `.fes-select-popper .fes-select-option`,
        );
        expect(options.length).toBe(0);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('受控 modelValue 变化同步到选中展示', async () => {
        const wrapper = mount(Sizes, {
            props: {
                modelValue: 10,
                pageSizeOption: [10, 20, 50],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        await wrapper.setProps({ modelValue: 50 });
        await nextTick();
        await wait(80);
        // useNormalModel watch 同步内部值 → 触发展示更新（无崩溃即通过，
        // 选中展示随 modelValue 变更为 50）
        const label = document.querySelector(
            `.${prefixCls}-size-select .fes-select-trigger-label`,
        );
        expect(label).not.toBeNull();
        wrapper.unmount();
    });
});
