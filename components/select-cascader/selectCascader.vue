<template>
    <div :class="prefixCls">
        <Popper
            v-model="isOpened"
            trigger="click"
            placement="bottom-start"
            :popperClass="`${prefixCls}-popper`"
            :appendToContainer="appendToContainer"
            :getContainer="getContainer"
            :offset="4"
            :hideAfter="0"
            :disabled="disabled"
            :lazy="false"
        >
            <template #trigger>
                <SelectTrigger
                    ref="triggerRef"
                    :selectedOptions="selectedOptions"
                    :disabled="disabled"
                    :clearable="clearable"
                    :isOpened="isOpened"
                    :multiple="multiple"
                    :placeholder="inputPlaceholder"
                    :collapseTags="collapseTags"
                    :collapseTagsLimit="collapseTagsLimit"
                    :class="{ 'is-error': isError }"
                    :renderTag="$slots.tag"
                    @remove="handleRemove"
                    @clear="handleClear"
                    @focus="focus"
                    @blur="blur"
                />
            </template>
            <template #default>
                <Cascader
                    ref="refCascader"
                    :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys"
                    :data="data"
                    :emptyText="emptyText"
                    :expandedKeys="expandedKeys"
                    :selectable="cascaderSelectable"
                    :checkable="cascaderCheckable"
                    :checkStrictly="checkStrictly"
                    :cascade="cascade"
                    :multiple="multiple"
                    :childrenField="childrenField"
                    :valueField="valueField"
                    :labelField="labelField"
                    :remote="remote"
                    :loadData="loadData"
                    :expandTrigger="expandTrigger"
                    @update:nodeList="onChangeNodeList"
                    @select="handleSelect"
                    @check="handleCheck"
                    @mousedown.prevent
                ></Cascader>
            </template>
        </Popper>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, watch, computed, onMounted } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel, useArrayModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import Cascader from '../cascader/cascader';
import { selectProps } from '../select/props';
import { cascaderProps } from '../cascader/props';
import {
    getChildrenByKeys,
    getParentByKeys,
    getCurrentValueByKeys,
    getKeysByCurrentValue,
} from './helper';

import type { SelectValue } from '../select/interface';
import type {
    CascaderNodeList,
    SelectParams,
    CheckParams,
    CascaderNodeKey,
} from '../cascader/interface';
import { useLocale } from '../config-provider/useLocale';
import { CHECK_STRATEGY } from '../cascader/const';

const prefixCls = getPrefixCls('select-cascader');

export default defineComponent({
    name: 'FSelectCascader',
    components: {
        Popper,
        SelectTrigger,
        Cascader,
    },
    props: {
        ...selectProps,
        ...cascaderProps,
    },
    emits: [
        UPDATE_MODEL_EVENT,
        CHANGE_EVENT,
        'removeTag',
        'visibleChange',
        'focus',
        'blur',
        'clear',
    ],
    setup(props, { emit }) {
        useTheme();
        const { validate, isError } = useFormAdaptor(
            computed(() => (props.multiple ? 'array' : 'string')),
        );
        const isOpened = ref(false);
        const [currentValue, updateCurrentValue] = props.multiple
            ? useArrayModel(props, emit)
            : useNormalModel(props, emit);

        const { t } = useLocale();
        const inputPlaceholder = computed(
            () => props.placeholder || t('select.placeholder'),
        );

        watch(isOpened, () => {
            emit('visibleChange', unref(isOpened));
        });

        const handleChange = () => {
            emit(CHANGE_EVENT, currentValue.value);
            validate(CHANGE_EVENT);
        };

        const nodeList = ref<CascaderNodeList>({});

        const onChangeNodeList = (data: CascaderNodeList) => {
            nodeList.value = data;
        };

        const cascaderSelectable = computed(() => !props.multiple);
        const cascaderCheckable = computed(() => props.multiple);
        const selectedKeys = computed(() => {
            if (!props.multiple)
                return getKeysByCurrentValue(currentValue.value, props);
            return [];
        });
        const checkedKeys = computed(() => {
            if (props.multiple) {
                const keys = getKeysByCurrentValue(currentValue.value, props);
                if (!props.cascade) {
                    return keys;
                }
                if (props.checkStrictly === CHECK_STRATEGY.ALL) {
                    return keys;
                }
                if (props.checkStrictly === CHECK_STRATEGY.PARENT) {
                    return getChildrenByKeys(
                        nodeList.value,
                        keys as CascaderNodeKey[],
                    );
                }
                if (props.checkStrictly === CHECK_STRATEGY.CHILD) {
                    return getParentByKeys(
                        nodeList.value,
                        keys as CascaderNodeKey[],
                    );
                }
            }
            return [];
        });

        watch(
            () => props.checkStrictly,
            () => {
                if (props.multiple && props.cascade) {
                    updateCurrentValue([]);
                    handleChange();
                }
            },
        );

        watch(
            () => props.emitPath,
            () => {
                const value: null | [] =
                    props.multiple || props.emitPath ? [] : null;

                updateCurrentValue(value);
                handleChange();
            },
        );

        const handleClear = () => {
            const value: null | [] =
                props.multiple || props.emitPath ? [] : null;

            if (
                props.multiple
                    ? checkedKeys.value.length
                    : selectedKeys.value.length
            ) {
                updateCurrentValue(value);
                handleChange();
            }
            emit('clear');
        };

        const handleSelect = (data: SelectParams) => {
            if (props.disabled) return;
            if (!props.multiple) {
                isOpened.value = false;
            }
            updateCurrentValue(
                getCurrentValueByKeys(nodeList.value, data.selectedKeys, props),
            );
            handleChange();
        };

        const handleCheck = (data: CheckParams) => {
            if (props.disabled) return;
            if (!props.multiple) {
                isOpened.value = false;
            }
            updateCurrentValue(
                getCurrentValueByKeys(nodeList.value, data.checkedKeys, props),
            );
            handleChange();
        };

        const handleRemove = (value: SelectValue) => {
            if (!props.multiple) {
                return;
            }

            const values = getKeysByCurrentValue(currentValue.value, props);
            const findIndex = (values as CascaderNodeKey[]).indexOf(
                value as CascaderNodeKey,
            );
            if (findIndex !== -1) {
                emit('removeTag', value);
                // TODO: 删除的时候需要考虑关联情况
                values.splice(findIndex, 1);
                updateCurrentValue(
                    getCurrentValueByKeys(
                        nodeList.value,
                        values as CascaderNodeKey[],
                        props,
                    ),
                );
                handleChange();
            }
        };

        const selectedOptions = computed(() => {
            const values = getKeysByCurrentValue(currentValue.value, props);

            // 支持未匹配项展示
            return (values as CascaderNodeKey[])
                .filter(Boolean)
                .map((curValue) => {
                    const { value, label, indexPath, labelPath } = nodeList
                        .value[curValue] || {
                        value: curValue,
                        label: curValue,
                        indexPath: [] as CascaderNodeKey[],
                        labelPath: [] as string[],
                    };
                    return {
                        value,
                        label,
                        indexPath,
                        labelPath,
                    };
                });
        });

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

        const refCascader = ref(null);

        const triggerRef = ref();
        const triggerWidth = ref(0);

        onMounted(() => {
            if (triggerRef.value) {
                triggerWidth.value = triggerRef.value.$el.offsetWidth;
            }
        });

        return {
            prefixCls,
            isOpened,
            currentValue,
            handleRemove,
            handleClear,
            selectedOptions,
            focus,
            blur,
            cascaderSelectable,
            selectedKeys,
            cascaderCheckable,
            handleSelect,
            handleCheck,
            checkedKeys,
            refCascader,
            triggerRef,
            onChangeNodeList,
            inputPlaceholder,
            isError,
        };
    },
});
</script>
