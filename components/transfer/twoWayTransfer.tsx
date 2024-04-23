import { type VNode, defineComponent, inject, ref, watch } from 'vue';
import { isNil } from 'lodash-es';
import Button from '../button';
import { LeftOutlined, RightOutlined, SearchOutlined } from '../icon';
import Empty from '../empty';
import Checkbox from '../checkbox';
import Input from '../input';
import VirtualList from '../virtual-list';
import {
    COMPONENT_CLASS,
    COMPONENT_NAME,
    COMPONENT_TWO_WAY_CLASS,
    TRANSFER_INJECT_KEY,
} from './const';
import { cls } from './utils';
import { TransferCheckbox, calcCheckStatus } from './checkbox';
import {
    type TransferFilter,
    type TransferInjection,
    type TransferOption,
    type TransferOptionValue,
} from './interface';
import { useCheckValueWithCheckbox } from './useCheckValueWithCheckbox';
import { useOptionsFilter } from './useOptionsFilter';

const usePanelData = ({
    rootProps,
    type,
    filter,
    handleChange,
}: Pick<TransferInjection, 'rootProps' | 'handleChange'> & {
    type: 'source' | 'target';
    filter: TransferFilter;
}) => {
    const checkValue = ref<TransferOptionValue[]>([]);
    const options = ref<TransferOption[]>([]);

    const { checkboxStatus, handleCheckboxChange, handleCheck } =
        useCheckValueWithCheckbox({
            checkValue,
            options,
            onCheckboxChange: () => {
                if (type === 'source') return;
                handleChange({ nextValue: checkValue.value });
            },
        });

    const handleListOptionChange = (
        optionValue: TransferOption['value'],
        nextValue: boolean,
    ): void => {
        const nextCheckValue = [...checkValue.value];

        if (nextValue) {
            // add
            nextCheckValue.push(optionValue);
        } else {
            // remove
            const index = nextCheckValue.findIndex((v) => v === optionValue);
            if (index === -1) return;
            nextCheckValue.splice(index, 1);
        }

        checkValue.value = nextCheckValue;
        handleCheck({ checkedKeys: nextCheckValue });
    };

    const updateCheckboxStatus = (): void => {
        checkboxStatus.value = calcCheckStatus(
            checkValue.value.length,
            options.value.length,
        );
    };

    const { filterText, displayOptions } = useOptionsFilter({
        options,
        filter,
        rootProps,
    });

    return {
        type,
        checkValue,
        options,
        checkboxStatus,
        handleCheckboxChange,
        handleListOptionChange,
        filterText,
        displayOptions,
        updateCheckboxStatus,
    };
};

type PanelData = ReturnType<typeof usePanelData>;

const TwoWayTransfer = defineComponent({
    name: COMPONENT_NAME,
    setup: () => {
        const {
            modelValue,
            rootProps,
            rootStyle,
            filter,
            renderLabel,
            handleChange,
            scrollContentHeight,
        } = inject(TRANSFER_INJECT_KEY);

        const sourcePanel = usePanelData({
            rootProps,
            handleChange,
            type: 'source',
            filter: filter.value,
        });

        const targetPanel = usePanelData({
            rootProps,
            handleChange,
            type: 'target',
            filter: filter.value,
        });

        // options 变化时，重置所有数据
        watch(
            () => rootProps.options,
            (nextOptions) => {
                sourcePanel.checkValue.value = [];
                targetPanel.checkValue.value = [];

                sourcePanel.options.value = nextOptions;
                targetPanel.options.value = [];
            },
        );

        const renderOption = (
            option: TransferOption,
            panelData: PanelData,
        ): VNode => (
            <div class={cls('option')}>
                <Checkbox
                    // 不能用 v-model
                    modelValue={panelData.checkValue.value.includes(
                        option.value,
                    )}
                    onChange={(nextValue) =>
                        panelData.handleListOptionChange(
                            option.value,
                            nextValue,
                    )
                    }
                />
                <span class={cls('option-label')}>{renderLabel(option)}</span>
            </div>
        );

        const renderPanel = (
            panelData: PanelData,
            appendClass: string[] = [],
        ): VNode => {
            const isEmpty = panelData.options.value.length === 0;

            let content: VNode;
            if (isEmpty) {
                content = <Empty class={cls('empty')} />;
            } else if (!isNil(scrollContentHeight.value)) {
                content = (
                    <VirtualList
                        class={cls('panel-list')}
                        style={{ height: `${scrollContentHeight.value}px` }}
                        dataSources={panelData.displayOptions.value}
                        dataKey={(option: TransferOption) => option.value}
                        v-slots={{
                            default: ({
                                source: option,
                            }: {
                                index: number;
                                source: TransferOption;
                            }) => {
                                return renderOption(option, panelData);
                            },
                        }}
                    />
                );
            } else {
                content = (
                    <div class={cls('panel-list')}>
                        {panelData.displayOptions.value.map((option) =>
                            renderOption(option, panelData),
                        )}
                    </div>
                );
            }

            return (
                <div
                    class={[
                        cls('panel'),
                        isEmpty && cls('empty-panel'),
                        ...appendClass,
                    ]}
                >
                    <div class={[cls('panel-header')]}>
                        <TransferCheckbox
                            v-model={panelData.checkboxStatus.value}
                            label={'全选'}
                            disabled={panelData.options.value.length === 0}
                            onChange={panelData.handleCheckboxChange}
                        />
                        <span class={cls('panel-count')}>
                            {panelData.checkValue.value.length}
                            &nbsp;/&nbsp;{panelData.options.value.length}
                            &nbsp;项
                        </span>
                    </div>
                    {rootProps.filterable && (
                        <Input
                            v-model={panelData.filterText.value}
                            class={cls('panel-filter')}
                            placeholder={'请输入'}
                            v-slots={{ suffix: () => <SearchOutlined /> }}
                        />
                    )}
                    {content}
                </div>
            );
        };

        // 仅更新 modelValue，panel 的数据更新由 watch 完成
        const handleTransfer = (from: PanelData['type']): void => {
            let nextValue: TransferOptionValue[];
            if (from === 'source') {
                nextValue = [
                    ...targetPanel.options.value.map(({ value }) => value),
                    ...sourcePanel.checkValue.value,
                ];
            } else {
                nextValue = targetPanel.options.value
                    .map(({ value }) => value)
                    .filter(
                        (value) =>
                            !targetPanel.checkValue.value.includes(value),
                    );
            }

            modelValue.value = nextValue;
            handleChange({ nextValue });
        };

        // modelValue 变化时，更新 panel 的 options 和 checkValue
        watch(
            modelValue,
            (nextValue) => {
                sourcePanel.options.value = rootProps.options.filter(
                    ({ value }) => !nextValue.includes(value),
                );
                targetPanel.options.value = rootProps.options.filter(
                    ({ value }) => nextValue.includes(value),
                );

                sourcePanel.checkValue.value =
                    sourcePanel.checkValue.value.filter(
                        (value) => !nextValue.includes(value),
                    );
                targetPanel.checkValue.value =
                    targetPanel.checkValue.value.filter((value) =>
                        nextValue.includes(value),
                    );

                sourcePanel.updateCheckboxStatus();
                targetPanel.updateCheckboxStatus();
            },
            {
                immediate: true,
                deep: true,
            },
        );

        const renderActions = (): VNode => {
            return (
                <div class={cls('actions')}>
                    <Button
                        class={cls('action-button')}
                        type="primary"
                        disabled={sourcePanel.checkValue.value.length === 0}
                        onClick={() => handleTransfer('source')}
                        v-slots={{
                            icon: () => (
                                <RightOutlined
                                    class={cls('action-button-icon')}
                                />
                            ),
                        }}
                    />
                    <Button
                        class={cls('action-button')}
                        type="primary"
                        disabled={targetPanel.checkValue.value.length === 0}
                        onClick={() => handleTransfer('target')}
                        v-slots={{
                            icon: () => (
                                <LeftOutlined
                                    class={cls('action-button-icon')}
                                />
                            ),
                        }}
                    />
                </div>
            );
        };

        return () => (
            <div
                class={[COMPONENT_CLASS, COMPONENT_TWO_WAY_CLASS]}
                style={rootStyle.value}
            >
                {/* 左边 */}
                {renderPanel(sourcePanel, [cls('source-panel')])}
                {/* 中间 */}
                {renderActions()}
                {/* 右边 */}
                {renderPanel(targetPanel, [cls('target-panel')])}
            </div>
        );
    },
});

export default TwoWayTransfer;
