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
        >
            <template #trigger>
                <SelectTrigger
                    :selectedOptions="selectedOptions"
                    :disabled="disabled"
                    :clearable="clearable"
                    :isOpened="isOpened"
                    :multiple="multiple"
                    :placeholder="placeholder"
                    :collapseTags="collapseTags"
                    :collapseTagsLimit="collapseTagsLimit"
                    @remove="handleRemove"
                    @clear="handleClear"
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
                    :handleUpdateSelectedNodes="handleUpdateSelectedNodes"
                    @expandChange="handleExpandChange"
                    @checkChange="handleCheckChange"
                    @close="handlePanelClose"
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
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import CascaderPanel from '../cascader-panel';
import { selectProps } from '../select/props';
import { cascaderPanelProps } from '../cascader-panel/props';
import { flatNodes } from '../_util/utils';

import type { CascaderNode, OptionValue } from '../cascader-panel/interface';
import { SelectOptionValue } from '../select-trigger/interface';

const prefixCls = getPrefixCls('cascader');

// type CascaderberEmits = {
//     (e: VModelEvent, value: SelectValue): void;
//     (e: ChangeEvent, value: SelectValue): void;
//     (e: 'removeTag', value: OptionValue): void;
//     (e: 'visibleChange', isOpen: boolean): void;
//     (e: 'clear'): void;
//     (e: 'expandChange', value: OptionValue[]): void;
// };

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
    ],
    setup(props, { emit }) {
        useTheme();
        const isOpened = ref(false);
        const selectedNodes = ref([]);

        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        watch(isOpened, () => {
            emit('visibleChange', unref(isOpened));
        });
        watch(currentValue, () => {
            emit(CHANGE_EVENT, unref(currentValue));
        });
        const handleClear = () => {
            const value: [] | null =
                props.multiple || props?.nodeConfig?.emitPath ? [] : null;
            updateCurrentValue(value);
            emit('clear');
        };
        /**
         * 多选才会有删除事件，所有仅考虑数组情况即可
         *
         * 若为 checkStrictly = all 情况，则：
         * 1. 若删除的为父节点，需要把子节点的值一起删除
         * 2. 若删除的为子节点，需要把父节点的值一起删除
         */
        const handleRemove = (value: SelectOptionValue) => {
            if (props.disabled) return;

            const { emitPath } = props.nodeConfig || {};
            let copyValue = cloneDeep(currentValue.value);
            const updateValues: OptionValue[] = [];

            if (emitPath) {
                copyValue = copyValue.map(
                    (item: OptionValue[]) => item[item.length - 1],
                );
            }

            const currentNode = selectedNodes.value.find(
                (node) => node.value === value,
            );
            const removeValues = []
                .concat(currentNode.pathNodes, flatNodes(currentNode.children))
                .map((node) => node.value);

            copyValue.forEach((item: OptionValue) => {
                let itemValue = item;
                if (!removeValues.includes(itemValue)) {
                    updateValues.push(itemValue);
                }
            });

            updateCurrentValue(updateValues);
            emit('removeTag', value as OptionValue);
        };
        const handleExpandChange = (value: OptionValue[]) => {
            emit('expandChange', value);
        };
        const handleCheckChange = (value: OptionValue | OptionValue[]) => {
            updateCurrentValue(value);
        };
        const handlePanelClose = () => {
            isOpened.value = false;
        };
        const handleUpdateSelectedNodes = (value: CascaderNode[]) => {
            selectedNodes.value = value;
        };
        const selectedOptions = computed(() =>
            selectedNodes.value.map((selectedNode) => ({
                value: selectedNode.value,
                label: props.showAllLevels
                    ? selectedNode.pathLabels.join(props.separator)
                    : selectedNode.label,
            })),
        );
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
        };
    },
});
</script>
