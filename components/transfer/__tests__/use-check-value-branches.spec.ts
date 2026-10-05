import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import FTransfer from '../transfer';
import { useCheckValueWithCheckbox } from '../useCheckValueWithCheckbox';
import type { TransferOption } from '../interface';

const OPTIONS: TransferOption[] = [
    { value: 'a', label: '选项A' },
    { value: 'b', label: '选项B' },
    { value: 'c', label: '选项C' },
];

const panelCls = 'fes-transfer-panel';

/** textContent 中的 &nbsp; 为 U+00A0，归一化为普通空格再断言 */
const countText = (wrapper: ReturnType<typeof mount>, panel: 'source' | 'target') =>
    wrapper
        .find(`.${panelCls}.fes-transfer-${panel}-panel .fes-transfer-panel-count`)
        .text()
        .replace(/\u00A0/g, ' ')
        .replace(/\s+/g, ' ');
const checkCls = 'fes-checkbox';

const findHeaderCheckbox = (wrapper: ReturnType<typeof mount>, panel: 'source' | 'target') =>
    wrapper.find(`.${panelCls}.fes-transfer-${panel}-panel .fes-transfer-panel-header .${checkCls}`);

describe('useCheckValueWithCheckbox 纯逻辑（status 分支）', () => {
    test('some 不修改值；all 收集全部 value；none 清空；均触发 onCheckboxChange', () => {
        const checkValue = ref(['a']);
        const options = ref<TransferOption[]>(OPTIONS);
        const onCheckboxChange = vi.fn();
        const { handleCheckboxChange } = useCheckValueWithCheckbox({
            checkValue,
            options,
            onCheckboxChange,
        });
        // 'some'（半选）是组件的中间态：直接 return，不修改值、不触发回调
        handleCheckboxChange('some');
        expect(checkValue.value).toEqual(['a']);
        expect(onCheckboxChange).not.toHaveBeenCalled();
        // 'all'：收集 options 全部 value
        handleCheckboxChange('all');
        expect(checkValue.value).toEqual(['a', 'b', 'c']);
        expect(onCheckboxChange).toHaveBeenCalledTimes(1);
        // 'none'：清空
        handleCheckboxChange('none');
        expect(checkValue.value).toEqual([]);
        expect(onCheckboxChange).toHaveBeenCalledTimes(2);
    });

    test('handleCheck 依据勾选数量重算 checkboxStatus（some/all/none 三态）', () => {
        const checkValue = ref([]);
        const options = ref<TransferOption[]>(OPTIONS);
        const { checkboxStatus, handleCheck } = useCheckValueWithCheckbox({
            checkValue,
            options,
        });
        handleCheck({ checkedKeys: ['a'] });
        expect(checkboxStatus.value).toBe('some');
        handleCheck({ checkedKeys: ['a', 'b', 'c'] });
        expect(checkboxStatus.value).toBe('all');
        handleCheck({ checkedKeys: [] });
        expect(checkboxStatus.value).toBe('none');
    });
});

describe('FTransfer 双向复选：全选/半选/未选（真实组件链路）', () => {
    test('头部全选 → 校验全部勾选，并可转移到右侧', async () => {
        const wrapper = mount(FTransfer, {
            props: { options: OPTIONS, twoWay: true },
        });
        await nextTick();
        const headerBox = findHeaderCheckbox(wrapper, 'source');
        expect(headerBox.exists()).toBe(true);
        // 初始未选
        expect(countText(wrapper, 'source')).toContain('0 / 3');
        await headerBox.trigger('click');
        await nextTick();
        // handleCheckboxChange('all') → checkValue 收集全部 → 头部全选
        expect(headerBox.classes()).toContain('is-checked');
        expect(countText(wrapper, 'source')).toContain('3 / 3');
        // 点击右移按钮 → modelValue 更新并触发 change 事件
        const rightBtn = wrapper
            .find('.fes-transfer-actions .fes-transfer-action-button');
        expect(rightBtn.exists()).toBe(true);
        await rightBtn.trigger('click');
        await nextTick();
        expect(wrapper.emitted('change')).toBeTruthy();
        // 数据移到右侧：目标面板渲染选项
        expect(wrapper.text()).toContain('选项A');
        wrapper.unmount();
    });

    test('部分勾选 → 头部半选；点头部成全选；再点成全不选', async () => {
        const wrapper = mount(FTransfer, {
            props: { options: OPTIONS, twoWay: true },
        });
        await nextTick();
        const optionBoxes = wrapper.findAll(
            `.${panelCls}.fes-transfer-source-panel .fes-transfer-option .${checkCls}`,
        );
        expect(optionBoxes.length).toBe(3);
        // 勾选前两项 → checkValue=[a,b] → 头部半选
        await optionBoxes[0].trigger('click');
        await nextTick();
        await optionBoxes[1].trigger('click');
        await nextTick();
        const headerBox = findHeaderCheckbox(wrapper, 'source');
        expect(headerBox.classes()).toContain('is-indeterminate');
        expect(headerBox.classes()).not.toContain('is-checked');
        expect(countText(wrapper, 'source')).toContain('2 / 3');
        // 半选态点击头部 → 全选（some 态点击变 all）
        await headerBox.trigger('click');
        await nextTick();
        expect(headerBox.classes()).toContain('is-checked');
        expect(countText(wrapper, 'source')).toContain('3 / 3');
        // 全选态再点头部 → 全不选（none）
        await headerBox.trigger('click');
        await nextTick();
        expect(headerBox.classes()).not.toContain('is-checked');
        expect(countText(wrapper, 'source')).toContain('0 / 3');
        wrapper.unmount();
    });
});
