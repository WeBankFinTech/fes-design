import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FTransfer from '../transfer';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('transfer');
const cls = (s: string) => `${prefixCls}-${s}`;

const options = [
    { value: 'a', label: '选项A' },
    { value: 'b', label: '选项B' },
    { value: 'c', label: '选项C' },
];

// 不可达分支说明（twoWayTransfer.tsx）：
// L62 `if (index === -1) return`（移除时选项不在 checkValue 中的守卫）：面板 checkValue
// 与选项 checkbox 的勾选 prop 始终由响应式链路保持同步（勾选 ⟺ checkValue 包含该值），
// 正常交互下移除调用一定能命中 index；仅当出现竞态/失同步（如外部直接篡改内部状态）才
// 可能触发，jsdom 内无法通过真实交互构造，故不硬造用例。移除主路径由下方用例覆盖。
describe('FTransfer 双向模式分支补全', () => {
    test('目标面板勾选/取消勾选（移除分支）与反向穿梭', async () => {
        const wrapper = mount(FTransfer, { props: { options, twoWay: true } });
        await nextTick();
        // 勾选源面板第一项并移入目标面板
        const optionCbs = wrapper.findAll(`.${cls('option')} .fes-checkbox`);
        await optionCbs[0].trigger('click');
        await nextTick();
        await wrapper.findAll(`.${cls('action-button')}`)[0].trigger('click');
        await nextTick();

        // 目标面板含 a，但初始未勾选（checkValue 与 modelValue 解耦，穿梭后勾选态重置）
        const targetCb = wrapper.find(
            `.${cls('target-panel')} .${cls('option')} .fes-checkbox`,
        );
        expect(targetCb.exists()).toBe(true);
        expect(targetCb.classes('is-checked')).toBe(false);

        // 点击勾选 → 加入 checkValue（add 分支）
        await targetCb.trigger('click');
        await nextTick();
        expect(targetCb.classes('is-checked')).toBe(true);

        // 点击已勾选项 → onChange(false) 走移除分支，计数归零
        await targetCb.trigger('click');
        await nextTick();
        expect(targetCb.classes('is-checked')).toBe(false);
        expect(
            wrapper.find(`.${cls('target-panel')} .${cls('panel-count')}`).text(),
        ).toContain('0');
        // 未勾选 → 反向穿梭按钮禁用
        expect(
            wrapper.findAll(`.${cls('action-button')}`)[1].attributes('disabled'),
        ).toBeDefined();

        // 重新勾选后反向穿梭：目标面板选项全部移回源面板
        await targetCb.trigger('click');
        await nextTick();
        await wrapper.findAll(`.${cls('action-button')}`)[1].trigger('click');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toEqual([]);
        wrapper.unmount();
    });

    test('目标面板全选框触发 change（type=target 分支）', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, twoWay: true, modelValue: ['a', 'b'] },
        });
        await nextTick();
        const targetHeaderCb = wrapper.find(
            `.${cls('target-panel')} .${cls('panel-header')} .fes-checkbox`,
        );
        expect(targetHeaderCb.exists()).toBe(true);
        expect(targetHeaderCb.classes('is-checked')).toBe(false);
        // 未勾选 → 点击后全选：checkValue = 目标面板全部选项，并触发 change
        await targetHeaderCb.trigger('click');
        await nextTick();
        const change = wrapper.emitted('change');
        expect(change).toBeTruthy();
        expect(change![change!.length - 1][0]).toEqual({
            nextValue: ['a', 'b'],
        });
        // 全选后目标面板计数同步
        expect(
            wrapper.find(`.${cls('target-panel')} .${cls('panel-count')}`).text(),
        ).toContain('2');
        wrapper.unmount();
    });

    test('options 变化时重置面板勾选与数据', async () => {
        const wrapper = mount(FTransfer, { props: { options, twoWay: true } });
        await nextTick();
        const optionCbs = wrapper.findAll(`.${cls('option')} .fes-checkbox`);
        await optionCbs[0].trigger('click');
        await nextTick();
        let actionButtons = wrapper.findAll(`.${cls('action-button')}`);
        expect(actionButtons[0].attributes('disabled')).toBeUndefined();

        await wrapper.setProps({ options: [{ value: 'x', label: '选项X' }] });
        await nextTick();
        // watch(rootProps.options) 重置 checkValue 与面板数据
        actionButtons = wrapper.findAll(`.${cls('action-button')}`);
        expect(actionButtons[0].attributes('disabled')).toBeDefined();
        expect(wrapper.text()).toContain('选项X');
        expect(wrapper.text()).not.toContain('选项A');
        wrapper.unmount();
    });

    test('同步快速双击勾选项：翻转后再勾回，状态与计数稳定', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, twoWay: true, modelValue: ['a'] },
        });
        await nextTick();
        const targetCb = wrapper.find(
            `.${cls('target-panel')} .${cls('option')} .fes-checkbox`,
        );
        // 初始未勾选（checkValue 与 modelValue 解耦）→ 第一次点击加入
        expect(targetCb.classes('is-checked')).toBe(false);
        await targetCb.trigger('click');
        await nextTick();
        expect(targetCb.classes('is-checked')).toBe(true);
        // 同步双击（模拟快速连点）：内部 currentValue 同步翻转 → 移除一次后立即再加回，
        // 最终保持勾选（勾选状态机稳定，不产生脏状态）
        await targetCb.trigger('click');
        await targetCb.trigger('click');
        await nextTick();
        expect(targetCb.classes('is-checked')).toBe(true);
        expect(
            wrapper.find(`.${cls('target-panel')} .${cls('panel-count')}`).text(),
        ).toContain('1');
        wrapper.unmount();
    });
});
