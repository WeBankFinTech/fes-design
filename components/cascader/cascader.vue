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
<script>
import { defineComponent, ref, unref, watch, computed } from 'vue';
import { cloneDeep } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import { useTheme } from '../_theme/useTheme';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import CascaderPanel from '../cascader-panel';
import SELECT_PROPS from '../select/props';
import CASCADER_PANEL_PROPS from '../cascader-panel/props';

const prefixCls = getPrefixCls('cascader');

export default defineComponent({
    name: 'FCascader',
    components: {
        Popper,
        SelectTrigger,
        CascaderPanel,
    },
    props: {
        ...SELECT_PROPS,
        ...CASCADER_PANEL_PROPS,
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
            const value =
                props.multiple || props?.nodeConfig?.emitPath ? [] : null;
            updateCurrentValue(value);
            emit('clear');
        };
        // 多选才会有删除事件，所有仅考虑数组情况即可
        const handleRemove = (value) => {
            if (props.disabled) return;

            const { emitPath } = props.nodeConfig || {};
            const copyValue = cloneDeep(currentValue.value);
            if (emitPath) {
                copyValue.splice(
                    copyValue.findIndex((item) => item.includes(value)),
                    1,
                );
            } else {
                copyValue.splice(
                    copyValue.findIndex((item) => item === value),
                    1,
                );
            }
            updateCurrentValue(copyValue);
            emit('removeTag', value);
        };
        const handleExpandChange = (value) => {
            emit('expandChange', value);
        };
        const handleCheckChange = (value) => {
            updateCurrentValue(value);
        };
        const handlePanelClose = () => {
            isOpened.value = false;
        };
        const handleUpdateSelectedNodes = (value) => {
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
