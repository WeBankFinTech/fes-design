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
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import { useTheme } from '../_theme/useTheme';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import CascaderPanel from '../cascader-panel';
import { SelectProps, selectProps } from '../select/props';
import type { CascaderPanelProps } from '../cascader-panel/props';
import { cascaderPanelProps } from '../cascader-panel/props';

import type { CascaderNode, OptionValue } from '../cascader-panel/interface';
import { useLocale } from '../config-provider/useLocale';
import { useNoMatchedNodes } from './useNoMatchedNodes';
import { useMultiRemove } from './useMultiRemove';

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
        const { noMatchedNodes } = useNoMatchedNodes(
            props as SelectProps & CascaderPanelProps,
            currentValue,
            selectedNodes,
        );

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

        // 多选才会有删除事件，所有仅考虑数组情况即可
        const { handleRemove } = useMultiRemove(
            props as SelectProps & CascaderPanelProps,
            currentValue,
            selectedNodes,
            noMatchedNodes,
            updateCurrentValue,
            emit,
            handleChange,
        );

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
