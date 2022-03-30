<template>
    <div :class="prefixCls">
        <Popper
            v-model="isOpened"
            :disabled="disabled"
            trigger="click"
            placement="bottom-start"
            :popperClass="`${prefixCls}-popper`"
            :appendToContainer="appendToContainer"
            :getContainer="getContainer"
            :offset="4"
            :hideAfter="0"
            :lazy="false"
        >
            <template #trigger>
                <SelectTrigger
                    :selectedOptions="selectedOptions"
                    :disabled="disabled"
                    :clearable="clearable"
                    :isOpened="isOpened"
                    :multiple="multiple"
                    :placeholder="inputPlaceholder"
                    :collapseTags="collapseTags"
                    :collapseTagsLimit="collapseTagsLimit"
                    :class="{ 'is-error': isError }"
                    @remove="handleRemove"
                    @clear="handleClear"
                    @focus="focus"
                    @blur="blur"
                />
            </template>
            <template #default>
                <CascaderPanel
                    :currentValue="currentValue"
                    :checkStrictly="checkStrictly"
                    :options="options"
                    :multiple="multiple"
                    :nodeConfig="nodeConfig"
                    :render-label="$slots.default"
                    :remote="remote"
                    :loadData="loadData"
                    :handleUpdateSelectedNodes="handleUpdateSelectedNodes"
                    @expandChange="handleExpandChange"
                    @checkChange="handleCheckChange"
                    @close="handlePanelClose"
                    @mousedown.prevent
                ></CascaderPanel>
            </template>
        </Popper>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, watch, computed } from 'vue';
import { cloneDeep } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import { useTheme } from '../_theme/useTheme';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import CascaderPanel from '../cascader-panel';
import { selectProps } from '../select/props';
import { cascaderPanelProps } from '../cascader-panel/props';
import { flatNodes } from '../_util/utils';

import type { CascaderNode, OptionValue } from '../cascader-panel/interface';
import type { SelectValue } from './interface';
import type { SelectOptionValue } from '../select-trigger/interface';
import { useLocale } from '../config-provider/useLocale';
import { getNodeValueByCurrentValue } from '../cascader-panel/utils';

const prefixCls = getPrefixCls('cascader');

export default defineComponent({
    name: 'FCascader',
    components: {
        Popper,
        SelectTrigger,
        CascaderPanel,
    },
    props: {
        ...selectProps,
        ...cascaderPanelProps,
    },
    emits: [
        UPDATE_MODEL_EVENT,
        CHANGE_EVENT,
        'removeTag',
        'visibleChange',
        'clear',
        'expandChange',
        'focus',
        'blur',
    ],
    setup(props, { emit }) {
        useTheme();
        const { validate, isError } = useFormAdaptor(
            computed(() => (props.multiple ? 'array' : 'string')),
        );
        const isOpened = ref(false);
        const selectedNodes = ref<CascaderNode[]>([]);

        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        const { t } = useLocale();
        const inputPlaceholder = computed(
            () => props.placeholder || t('cascader.placeholder'),
        );

        // 兼容没有匹配到节点情况
        const noMatchedNodes = computed(() => {
            const nodes: any[] = [];
            const { nodeConfig, multiple } = props;

            const nodeValue = getNodeValueByCurrentValue(
                multiple,
                nodeConfig.emitPath,
                currentValue.value,
            );

            const pushNodesByValue = (value: OptionValue) => {
                if (!selectedNodes.value.find((node) => node.value === value)) {
                    const label = `${value}`;
                    nodes.push({
                        value,
                        label,
                        pathLabels: [label],
                        pathNodes: [],
                    });
                }
            };

            if (multiple) {
                (nodeValue as OptionValue[]).forEach((value) => {
                    pushNodesByValue(value);
                });
            } else {
                pushNodesByValue(nodeValue as OptionValue);
            }

            return nodes;
        });

        // 初始化选中节点
        // function initSelectedNodes() {
        //     const { options, nodeConfig, multiple } = props;
        //     const mergeNodeConfig = {
        //         ...DEFAULT_CONFIG,
        //         ...nodeConfig,
        //     };
        //     const nodes = options.map((nodeData) =>
        //         getNode(nodeData, mergeNodeConfig, props),
        //     );
        //     const allNodes = flatNodes(nodes);

        //     const nodeValue = getNodeValueByCurrentValue(
        //         multiple,
        //         nodeConfig.emitPath,
        //         currentValue.value,
        //     );

        //     selectedNodes.value = allNodes.filter((node) => {
        //         if (multiple) {
        //             return (nodeValue as OptionValue[]).includes(node.value);
        //         } else {
        //             return node.value === nodeValue;
        //         }
        //     });
        // }

        // 1. 由于 删除操作 的时候也要考虑 关联选中 情况，若 异步加载panel 的话，会有重复处理的情况，所以这里去掉 异步加载 的逻辑
        // 2. 若数据量较大的情况，建议异步加载节点的方式处理
        //
        // 由于 Panel 组件不会初始化渲染，所以这里需要做下初始化选中处理
        // 兼容 options 异步的情况
        // watch(
        //     () => props.options,
        //     () => {
        //         initSelectedNodes();
        //     },
        //     {
        //         deep: true,
        //         immediate: true,
        //     },
        // );

        watch(isOpened, () => {
            emit('visibleChange', unref(isOpened));
        });
        const handleChange = () => {
            emit(CHANGE_EVENT, currentValue.value);
            validate(CHANGE_EVENT);
        };
        const handleClear = () => {
            const value: [] | null =
                props.multiple || props?.nodeConfig?.emitPath ? [] : null;
            if (
                props.multiple || props?.nodeConfig?.emitPath
                    ? currentValue.value.length
                    : currentValue.value !== null
            ) {
                updateCurrentValue(value);
                handleChange();
            }
            emit('clear');
        };
        /**
         * 多选才会有删除事件，所有仅考虑数组情况即可
         *
         * 若为 checkStrictly = all 情况，则：
         * 1. 若删除的为父节点，需要把子节点的值一起删除
         * 2. 若删除的为子节点，需要把父节点的值一起删除
         */
        const handleRemove = (value: SelectValue) => {
            if (props.disabled) return;

            const { emitPath } = props.nodeConfig;
            let copyValue = cloneDeep(currentValue.value);
            const updateValues: SelectOptionValue[] = [];
            let removeValues: SelectOptionValue[] = [];

            const currentNode = selectedNodes.value.find(
                (node) => node.value === value,
            );
            // 兼容没有匹配到节点情况的处理
            if (currentNode) {
                removeValues = []
                    .concat(
                        currentNode.pathNodes,
                        flatNodes(currentNode.children),
                    )
                    .map((node) => node.value);
            } else {
                const currentNoMatchedNode = noMatchedNodes.value.find(
                    (node) => node.value === value,
                );
                if (currentNoMatchedNode) {
                    removeValues = [currentNoMatchedNode.value];
                }
            }

            copyValue.forEach((item: OptionValue | OptionValue[]) => {
                let itemValue: OptionValue = item as OptionValue;
                if (emitPath) {
                    itemValue = (item as OptionValue[])[
                        (item as OptionValue[]).length - 1
                    ];
                }
                if (!removeValues.includes(itemValue)) {
                    updateValues.push(item);
                }
            });

            updateCurrentValue(updateValues);
            emit('removeTag', value as OptionValue);
            handleChange();
        };
        const handleExpandChange = (value: OptionValue[]) => {
            emit('expandChange', value);
        };
        const handleCheckChange = (value: OptionValue | OptionValue[]) => {
            updateCurrentValue(value);
            handleChange();
        };
        const handlePanelClose = () => {
            isOpened.value = false;
        };
        const handleUpdateSelectedNodes = (value: CascaderNode[]) => {
            selectedNodes.value = value;
        };
        const selectedOptions = computed(() =>
            []
                .concat(noMatchedNodes.value, selectedNodes.value)
                .map((node) => ({
                    value: node.value,
                    label: props.showAllLevels
                        ? node.pathLabels.join(props.separator)
                        : node.label,
                })),
        );
        const focus = (e: Event) => {
            emit('focus', e);
            validate('focus');
        };

        const blur = (e: Event) => {
            if (isOpened.value) {
                isOpened.value = false;
            }
            emit('blur', e);
            validate('blur');
        };
        return {
            prefixCls,
            isOpened,
            currentValue,
            selectedOptions,
            handleRemove,
            handleClear,
            handleExpandChange,
            handleCheckChange,
            handleUpdateSelectedNodes,
            handlePanelClose,
            inputPlaceholder,
            focus,
            blur,
            isError,
        };
    },
});
</script>
