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
            :disabled="innerDisabled"
            :lazy="false"
        >
            <template #trigger>
                <SelectTrigger
                    :selectedOptions="selectedOptions"
                    :disabled="innerDisabled"
                    :clearable="clearable"
                    :isOpened="isOpened"
                    :multiple="multiple"
                    :placeholder="inputPlaceholder"
                    :collapseTags="collapseTags"
                    :collapseTagsLimit="collapseTagsLimit"
                    :tagBordered="tagBordered"
                    :class="[{ 'is-error': isError }, attrs.class]"
                    :style="attrs.style"
                    :renderTag="$slots.tag"
                    @remove="handleRemove"
                    @clear="handleClear"
                    @focus="focus"
                    @blur="blur"
                />
            </template>
            <template #default>
                <Cascader
                    :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys"
                    :initLoadKeys="initLoadKeys"
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
                    :isOpened="isOpened"
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
import { defineComponent, ref, unref, watch, computed } from 'vue';
import { isArray } from 'lodash-es';
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
    getCascadeChildrenByKeys,
    getCascadeParentByKeys,
    handleParent,
    handleChildren,
} from '../cascader/helper';
import { useLocale } from '../config-provider/useLocale';
import { CHECK_STRATEGY } from '../cascader/const';
import {
    getCurrentValueByKeys,
    getKeysByCurrentValue,
    getNotMatchedPathByKey,
    getExpandedKeysBySelectedKeys,
} from './helper';

import type { SelectValue } from '../select/interface';
import type {
    CascaderNodeList,
    SelectParams,
    CheckParams,
    CascaderNodeKey,
    CascaderOption,
} from '../cascader/interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('select-cascader');

export const selectCascaderProps = {
    ...selectProps,
    ...cascaderProps,
} as const;

export type SelectCascaderProps = ExtractPublicPropTypes<
    typeof selectCascaderProps
>;

export default defineComponent({
    name: 'FSelectCascader',
    components: {
        Popper,
        SelectTrigger,
        Cascader,
    },
    props: selectCascaderProps,
    emits: [
        UPDATE_MODEL_EVENT,
        CHANGE_EVENT,
        'removeTag',
        'visibleChange',
        'focus',
        'blur',
        'clear',
    ],
    setup(props, { emit, attrs }) {
        useTheme();
        const { validate, isError, isFormDisabled } = useFormAdaptor({
            valueType: computed(() => (props.multiple ? 'array' : 'string')),
        });
        const isOpened = ref(false);
        const [currentValue, updateCurrentValue] = props.multiple
            ? useArrayModel(props, emit)
            : useNormalModel(props, emit);

        const { t } = useLocale();
        const inputPlaceholder = computed(
            () => props.placeholder || t('select.placeholder'),
        );

        const innerDisabled = computed(
            () => props.disabled || isFormDisabled.value,
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
            if (!props.multiple) {
                return getKeysByCurrentValue(currentValue.value, props);
            }
            return [];
        });
        const expandedKeys = computed(() => {
            if (!props.multiple) {
                return getExpandedKeysBySelectedKeys(
                    nodeList.value,
                    selectedKeys.value as CascaderNodeKey[],
                );
            }
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
                    return getCascadeChildrenByKeys(
                        nodeList.value,
                        keys as CascaderNodeKey[],
                    );
                }
                if (props.checkStrictly === CHECK_STRATEGY.CHILD) {
                    return getCascadeParentByKeys(
                        nodeList.value,
                        keys as CascaderNodeKey[],
                    );
                }
            }
            return [];
        });
        const initLoadKeys = computed(() => {
            let keys: CascaderNodeKey[] = [];
            if (!(props.remote && props.loadData)) {
                return keys;
            }
            if (!props.emitPath) {
                return keys;
            }
            if (!isArray(currentValue.value)) {
                return keys;
            }
            currentValue.value.forEach((value) => (keys = keys.concat(value)));
            keys = Array.from(new Set(keys)); // 去重处理
            return keys;
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

        watch([() => props.emitPath, () => props.cascade], () => {
            const value: null | [] =
                props.multiple || props.emitPath ? [] : null;

            updateCurrentValue(value);
            handleChange();
        });

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
            if (innerDisabled.value) return;
            if (!props.multiple) {
                isOpened.value = false;
            }
            updateCurrentValue(
                getCurrentValueByKeys(nodeList.value, data.selectedKeys, props),
            );
            handleChange();
        };

        const handleCheck = (data: CheckParams) => {
            if (innerDisabled.value) return;
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

                // 兼容关联场景
                if (!props.cascade) {
                    values.splice(findIndex, 1);
                } else {
                    const { isLeaf, children, indexPath } =
                        nodeList.value[value as CascaderNodeKey];

                    values.splice(findIndex, 1);

                    handleParent(
                        values as CascaderNodeKey[],
                        indexPath,
                        false,
                        nodeList.value,
                    );
                    if (!isLeaf) {
                        handleChildren(
                            values as CascaderNodeKey[],
                            children,
                            false,
                        );
                    }
                }

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

            // 兼容异步加载，未匹配到节点的情况
            return (values as CascaderNodeKey[])
                .filter(Boolean)
                .map((curValue) => {
                    const { value, label, path } = nodeList.value[curValue] || {
                        value: curValue,
                        label: curValue,
                        path: getNotMatchedPathByKey(
                            currentValue.value,
                            props,
                            curValue,
                        ),
                    };
                    const formatLabel = props.showPath
                        ? (path as CascaderOption[])
                              .map((item) => `${item.label}`)
                              .join(' / ')
                        : label;
                    return {
                        value,
                        label: formatLabel,
                        path,
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
            expandedKeys,
            cascaderCheckable,
            handleSelect,
            handleCheck,
            checkedKeys,
            onChangeNodeList,
            inputPlaceholder,
            isError,
            initLoadKeys,
            attrs,
            innerDisabled,
        };
    },
});
</script>
