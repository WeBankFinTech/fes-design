import {
    type VNode,
    defineComponent,
    inject,
    ref,
    computed,
    type Ref,
} from 'vue';
import { isNil } from 'lodash-es';
import Tree from '../tree';
import Empty from '../empty';
import { CloseCircleOutlined, SearchOutlined } from '../icon';
import Input from '../input';
import { type TreeOption } from '../tree/interface';
import VirtualList from '../virtual-list';
import {
    COMPONENT_CLASS,
    COMPONENT_NAME,
    COMPONENT_ONE_WAY_CLASS,
    TRANSFER_INJECT_KEY,
} from './const';
import { TransferCheckbox, calcCheckStatus } from './checkbox';
import {
    type TreeFilter,
    type TransferFilter,
    type TransferInjection,
    type TransferOption,
} from './interface';
import { cls, flattenTree, isTree } from './utils';
import { useTreeFilter } from './useTreeFilter';
import { useCheckValueWithCheckbox } from './useCheckValueWithCheckbox';

const useData = ({
    modelValue,
    rootProps,
    handleChange,
}: Pick<TransferInjection, 'modelValue' | 'rootProps' | 'handleChange'>) => {
    const options = computed<TransferOption[]>(() => rootProps.options);

    const { checkboxStatus, handleCheckboxChange, handleCheck } =
        useCheckValueWithCheckbox({
            checkValue: modelValue,
            options,
            onCheckboxChange: () => {
                handleChange({ nextValue: modelValue.value });
            },
        });

    return {
        treeCheckStatus: checkboxStatus,
        handleCheckStatusChange: handleCheckboxChange,
        handleTreeCheck: handleCheck,
    };
};

// 右边 TargetList 需要的 filter
const useCheckedOptionsFilter = ({
    checkedOptions,
    filter,
    rootProps,
}: Pick<TransferInjection, 'rootProps'> & {
    checkedOptions: Ref<TransferOption[]>;
    filter: TransferFilter;
}) => {
    const filterText = ref<string>('');

    const displayCheckedOptions = computed<TransferOption[]>(() => {
        if (!rootProps.filterable) {
            return checkedOptions.value;
        }
        return checkedOptions.value.filter((option) =>
            filter(filterText.value, option),
        );
    });

    return { filter, filterText, displayCheckedOptions };
};

const OneWayTransfer = defineComponent({
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

        const { handleTreeCheck, treeCheckStatus, handleCheckStatusChange } =
            useData({ modelValue, rootProps, handleChange });

        const checkedOptions = computed<TransferOption[]>(() => {
            const options = isTree(rootProps.options)
                ? flattenTree(rootProps.options)
                : rootProps.options;
            return options.filter((o) => modelValue.value.includes(o.value));
        });

        const {
            treeRef,
            defaultFilterForTree,
            filterText: treeFilterText,
        } = useTreeFilter({
            rootProps,
        });

        const { displayCheckedOptions, filterText: checkedOptionsFilterText } =
            useCheckedOptionsFilter({
                checkedOptions,
                rootProps,
                filter: filter.value,
            });

        const handleClear = (): void => {
            modelValue.value = [];
            treeCheckStatus.value = 'none';

            handleChange({ nextValue: [] });
        };

        const removeCheckedOption = (
            optionValue: TransferOption['value'],
        ): void => {
            const nextModelValue = [...modelValue.value];
            const index = nextModelValue.findIndex((v) => v === optionValue);
            if (index === -1) return;
            nextModelValue.splice(index, 1);

            // 更新值
            modelValue.value = nextModelValue;
            treeCheckStatus.value = calcCheckStatus(
                nextModelValue.length,
                rootProps.options.length,
            );

            handleChange({ nextValue: nextModelValue });
        };

        const renderFilterInput = (filterText: Ref<string>): VNode => {
            if (!rootProps.filterable) return undefined;
            return (
                <Input
                    v-model={filterText.value}
                    class={cls('panel-filter')}
                    placeholder={'请输入'}
                    v-slots={{ suffix: () => <SearchOutlined /> }}
                />
            );
        };

        const renderSourcePanel = (): VNode => {
            // TODO: 在 options 为空的时候，应该也展示 Empty 组件。但是 Tree 组件需要绑定 ref，但是在 if-else 的 JSX 中绑定的 ref 会错乱

            const treeOptions: TreeOption[] = rootProps.options.map(
                (option) => ({
                    ...option,
                    label: () => renderLabel(option),
                }),
            );

            const virtualScrollConfig = !isNil(scrollContentHeight.value)
                ? {
                      virtualList: true,
                      style: { height: `${scrollContentHeight.value}px` },
                  }
                : {};

            const filterForTree = rootProps.filterable
                ? (rootProps.filter as TreeFilter | undefined) ?? // TODO: is not assignable
                  defaultFilterForTree()
                : undefined;

            return (
                <div class={[cls('panel'), cls('source-panel')]}>
                    <div class={[cls('panel-header')]}>
                        <TransferCheckbox
                            v-model={treeCheckStatus.value}
                            label={'全选'}
                            disabled={rootProps.options.length === 0}
                            onChange={handleCheckStatusChange}
                        />
                        <span class={cls('panel-count')}>
                            共 {rootProps.options.length} 项
                        </span>
                    </div>
                    {renderFilterInput(treeFilterText)}
                    <Tree
                        v-model={[modelValue.value, 'checkedKeys']}
                        ref={treeRef}
                        data={treeOptions}
                        class={cls('panel-list')}
                        checkable={true}
                        selectable={false}
                        filterMethod={filterForTree}
                        onCheck={handleTreeCheck}
                        {...virtualScrollConfig}
                    />
                </div>
            );
        };

        const renderCheckedOption = (option: TransferOption): VNode => {
            const labelContent = renderLabel(option);
            return (
                <div class={[cls('option'), cls('checked-option')]}>
                    <span class={cls('checked-option-text')}>
                        {labelContent}
                    </span>
                    <CloseCircleOutlined
                        class={cls('checked-option-remove-button')}
                        onClick={() => removeCheckedOption(option.value)}
                    />
                </div>
            );
        };

        const renderTargetPanel = (): VNode => {
            const isEmpty = modelValue.value.length === 0;

            let content: VNode;
            if (isEmpty) {
                content = <Empty class={cls('empty')} />;
            } else if (!isNil(scrollContentHeight.value)) {
                content = (
                    <VirtualList
                        class={cls('panel-list')}
                        style={{ height: `${scrollContentHeight.value}px` }}
                        dataSources={displayCheckedOptions.value}
                        dataKey={(option: TransferOption) => option.value}
                        v-slots={{
                            default: ({
                                source: option,
                            }: {
                                index: number;
                                source: TransferOption;
                            }) => {
                                return renderCheckedOption(option);
                            },
                        }}
                    />
                );
            } else {
                content = (
                    <div class={cls('panel-list')}>
                        {displayCheckedOptions.value.map(renderCheckedOption)}
                    </div>
                );
            }

            return (
                <div
                    class={[
                        cls('panel'),
                        cls('target-panel'),
                        isEmpty && cls('empty-panel'),
                    ]}
                >
                    <div class={[cls('panel-header')]}>
                        <span class={cls('panel-checked-count')}>
                            已选 {modelValue.value.length} 项
                        </span>
                        <span
                            class={cls('panel-clear-button')}
                            onClick={handleClear}
                        >
                            清除
                        </span>
                    </div>
                    {renderFilterInput(checkedOptionsFilterText)}
                    {content}
                </div>
            );
        };

        return () => (
            <div
                class={[COMPONENT_CLASS, COMPONENT_ONE_WAY_CLASS]}
                style={rootStyle.value}
            >
                {/* 左边 */}
                {renderSourcePanel()}
                {/* 右边 */}
                {renderTargetPanel()}
            </div>
        );
    },
});

export default OneWayTransfer;
