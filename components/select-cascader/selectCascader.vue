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
                <Scrollbar
                    :containerStyle="dropdownStyle"
                    :containerClass="`${prefixCls}-dropdown`"
                    @mousedown.prevent
                >
                    <Cascader
                        v-show="data.length"
                        ref="refCascader"
                        :selectedKeys="selectedKeys"
                        :checkedKeys="checkedKeys"
                        :data="data"
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
                        @update:nodeList="onChangeNodeList"
                        @select="handleSelect"
                        @check="handleCheck"
                    ></Cascader>
                    <div
                        v-show="!data.length"
                        :class="`${prefixCls}-null`"
                        @mousedown.prevent
                    >
                        {{ listEmptyText }}
                    </div>
                </Scrollbar>
            </template>
        </Popper>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    unref,
    watch,
    computed,
    onMounted,
    CSSProperties,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel, useArrayModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import Cascader from '../cascader/cascader';
import Scrollbar from '../scrollbar';
import { selectProps } from '../select/props';
import { cascaderProps } from '../cascader/props';
import { getChildrenByValues, getParentByValues } from './helper';

import type { SelectValue } from '../select/interface';
import type {
    CascaderNodeList,
    SelectParams,
    CheckParams,
} from '../cascader/interface';
import { useLocale } from '../config-provider/useLocale';

const prefixCls = getPrefixCls('select-cascader');

export default defineComponent({
    name: 'FSelectCascader',
    components: {
        Popper,
        SelectTrigger,
        Cascader,
        Scrollbar,
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
        const listEmptyText = computed(
            () => props.emptyText || t('select.emptyText'),
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
                return currentValue.value ? [currentValue.value] : [];
            return [];
        });
        const checkedKeys = computed(() => {
            if (props.multiple) {
                if (!props.cascade) {
                    return currentValue.value;
                }
                if (props.checkStrictly === 'all') {
                    return currentValue.value;
                }
                if (props.checkStrictly === 'parent') {
                    return getChildrenByValues(
                        nodeList.value,
                        currentValue.value,
                    );
                }
                if (props.checkStrictly === 'child') {
                    return getParentByValues(
                        nodeList.value,
                        currentValue.value,
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
                }
            },
        );

        const handleClear = () => {
            const value: null | [] = props.multiple ? [] : null;
            if (
                props.multiple
                    ? currentValue.value.length
                    : currentValue.value !== null
            ) {
                updateCurrentValue(value);
                handleChange();
            }
            emit('clear');
        };

        const handleSelect = (data: SelectParams) => {
            if (props.disabled) return;
            if (!props.multiple) {
                updateCurrentValue(data.selectedKeys[0]);
                isOpened.value = false;
            } else {
                updateCurrentValue(data.selectedKeys);
            }
            handleChange();
        };

        const handleCheck = (data: CheckParams) => {
            if (props.disabled) return;
            if (!props.multiple) {
                updateCurrentValue(data.checkedKeys[0]);
                isOpened.value = false;
            } else {
                updateCurrentValue(data.checkedKeys);
            }
            handleChange();
        };

        const handleRemove = (value: SelectValue) => {
            if (!props.multiple) {
                return;
            }
            const findIndex = currentValue.value.indexOf(value);
            if (findIndex !== -1) {
                emit('removeTag', value);
                // arrayModel会自动添加或者删除
                updateCurrentValue(value);
                handleChange();
            }
        };

        const selectedOptions = computed(() =>
            Object.values(nodeList.value).filter((option) => {
                if (props.multiple) {
                    return currentValue.value.includes(option.value);
                }
                return [currentValue.value].includes(option.value);
            }),
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

        const refCascader = ref(null);

        const triggerRef = ref();
        const triggerWidth = ref(0);

        onMounted(() => {
            if (triggerRef.value) {
                triggerWidth.value = triggerRef.value.$el.offsetWidth;
            }
        });

        const dropdownStyle = computed(() => {
            const style: CSSProperties = {};
            if (triggerWidth.value) {
                style['min-width'] = `${triggerWidth.value}px`;
            }
            return style;
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
            dropdownStyle,
            onChangeNodeList,
            inputPlaceholder,
            listEmptyText,
            isError,
        };
    },
});
</script>
