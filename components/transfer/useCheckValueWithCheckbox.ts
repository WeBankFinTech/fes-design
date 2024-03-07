import { ref, type Ref } from 'vue';
import { type TransferOption, type TransferOptionValue } from './interface';
import { calcCheckStatus, type CheckStatus } from './checkbox';

/** 数据是仅和其关联的 Checkbox 的值相关，与组件的 modelValue 无关 */
export const useCheckValueWithCheckbox = ({
    checkValue,
    options,
    onCheckboxChange,
}: {
    checkValue: Ref<TransferOptionValue[]>;
    options: Ref<TransferOption[]>;
    onCheckboxChange?: () => void;
}) => {
    const checkboxStatus = ref<CheckStatus>(
        calcCheckStatus(checkValue.value.length, options.value.length),
    );

    // 处理组件的事件，而不是 watch 组件的 modelValue。防止 watch 之间互相依赖，循环触发
    const handleCheckboxChange = (status: CheckStatus): void => {
        if (status === 'some') return;

        checkValue.value =
            status === 'all' ? options.value.map(({ value }) => value) : [];

        onCheckboxChange?.();
    };

    // 可能是 List 也可能是 Tree，取决于使用的组件
    const handleCheck = ({
        checkedKeys,
    }: {
        checkedKeys: TransferOptionValue[];
    }): void => {
        checkboxStatus.value = calcCheckStatus(
            checkedKeys.length,
            options.value.length,
        );
    };

    return {
        checkboxStatus,
        handleCheckboxChange,
        handleCheck,
    };
};
