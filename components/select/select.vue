<template>
    <div :class="prefixCls">
        <Popper
            v-model="isOpenedRef"
            trigger="click"
            placement="bottom-start"
            :popperClass="[`${prefixCls}-popper`, popperClass]"
            :appendToContainer="appendToContainer"
            :getContainer="getContainer"
            :offset="4"
            :hideAfter="0"
            :disabled="disabled"
        >
            <template #trigger>
                <SelectTrigger
                    ref="triggerRef"
                    :selectedOptions="selectedOptionsRef"
                    :disabled="disabled"
                    :clearable="clearable"
                    :isOpened="isOpenedRef"
                    :multiple="multiple"
                    :placeholder="inputPlaceholder"
                    :filterable="filterable || remote"
                    :collapseTags="collapseTags"
                    :collapseTagsLimit="collapseTagsLimit"
                    :tagBordered="tagBordered"
                    :class="[{ 'is-error': isError }, attrs.class]"
                    :style="attrs.style"
                    :renderTag="$slots.tag"
                    @remove="onSelect"
                    @clear="handleClear"
                    @focus="focus"
                    @blur="blur"
                    @input="handleFilterTextChange"
                />
            </template>
            <template #default>
                <OptionList
                    :options="filteredOptions"
                    :prefixCls="prefixCls"
                    :containerStyle="dropdownStyle"
                    :isSelect="isSelect"
                    :onSelect="onSelect"
                    :isLimit="isLimitRef"
                    :emptyText="listEmptyText"
                    :renderOption="$slots.option"
                    @scroll="onScroll"
                    @mousedown.prevent
                />
                <div
                    v-if="$slots.addon"
                    :class="`${prefixCls}-addon`"
                    @mousedown.prevent
                >
                    <slot name="addon" />
                </div>
            </template>
        </Popper>
        <div ref="hiddenOptions" :class="`${prefixCls}-hidden-options`">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import {
    ref,
    provide,
    unref,
    reactive,
    watch,
    computed,
    onMounted,
    CSSProperties,
    defineComponent,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel, useArrayModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import { useLocale } from '../config-provider/useLocale';
import { key } from './const';
import OptionList from './optionList';
import { selectProps } from './props';

import type { SelectValue, OptionChildren } from './interface';

const prefixCls = getPrefixCls('select');

export default defineComponent({
    name: 'FSelect',
    components: {
        Popper,
        SelectTrigger,
        OptionList,
    },
    props: selectProps,
    emits: [
        UPDATE_MODEL_EVENT,
        CHANGE_EVENT,
        'removeTag',
        'visibleChange',
        'focus',
        'blur',
        'clear',
        'scroll',
        'search',
    ],
    setup(props, { emit, attrs }) {
        useTheme();
        const { validate, isError } = useFormAdaptor(
            computed(() => (props.multiple ? 'array' : 'string')),
        );
        const isOpenedRef = ref(false);
        const [currentValue, updateCurrentValue] = props.multiple
            ? useArrayModel(props, emit)
            : useNormalModel(props, emit);

        const triggerRef = ref();
        const triggerWidth = ref(0);

        watch(isOpenedRef, () => {
            emit('visibleChange', unref(isOpenedRef));
            if (isOpenedRef.value && triggerRef.value) {
                triggerWidth.value = triggerRef.value.$el.offsetWidth;
            }
        });

        const handleChange = () => {
            emit(CHANGE_EVENT, unref(currentValue));
            validate(CHANGE_EVENT);
        };

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

        const { t } = useLocale();
        const inputPlaceholder = computed(
            () => props.placeholder || t('select.placeholder'),
        );
        const listEmptyText = computed(
            () => props.emptyText || t('select.emptyText'),
        );

        const childOptions = reactive([]);

        const addOption = (option: OptionChildren) => {
            if (!childOptions.includes(option)) {
                childOptions.push(option);
            }
        };

        const removeOption = (id: number | string) => {
            const colIndex = childOptions.findIndex((item) => item.id === id);
            if (colIndex !== -1) {
                childOptions.splice(colIndex, 1);
            }
        };

        const optionsRef = computed(() =>
            [...childOptions, ...props.options].map((option) => {
                return {
                    ...option,
                    value: option[props.valueField],
                    label: option[props.labelField],
                };
            }),
        );

        const filterText = ref('');
        const filteredOptions = computed(() => {
            if (!props.remote && props.filterable && filterText.value) {
                return optionsRef.value.filter((option) => {
                    if (props.filter) {
                        return props.filter(filterText.value, option);
                    }
                    return String(option.label).includes(filterText.value);
                });
            }
            return optionsRef.value;
        });

        const isSelect = (value: SelectValue) => {
            const selectVal = unref(currentValue);
            const optVal = unref(value);
            if (selectVal === null) {
                return false;
            }
            if (props.multiple) {
                return selectVal.includes(optVal);
            }
            return selectVal === optVal;
        };

        const isLimitRef = computed(() => {
            const selectVal = unref(currentValue);
            return (
                props.multipleLimit > 0 &&
                props.multipleLimit === selectVal.length
            );
        });

        const onSelect = (value: SelectValue) => {
            if (props.disabled) return;
            if (props.multiple) {
                filterText.value = '';
                if (isSelect(value)) {
                    emit('removeTag', value);
                } else {
                    if (isLimitRef.value) return;
                }
            } else {
                // 体验更好
                setTimeout(() => {
                    filterText.value = '';
                }, 400);
                isOpenedRef.value = false;
            }
            updateCurrentValue(unref(value));
            handleChange();
        };

        // select-trigger 选择项展示，只在 currentValue 改变时才改变
        const selectedOptionsRef = ref([]);
        watch(
            [currentValue, optionsRef],
            ([newValue, newOptions]) => {
                const getOption = (val: SelectValue) => {
                    let cacheOption;
                    if (newOptions && newOptions.length) {
                        cacheOption = newOptions.find(
                            (option) => option.value === val,
                        );
                        if (cacheOption) {
                            return cacheOption;
                        }
                    }
                    cacheOption = selectedOptionsRef.value.find(
                        (option) => option.value === val,
                    );
                    if (cacheOption) {
                        return cacheOption;
                    }
                    return val ? { value: val, label: null } : null;
                };

                if (!props.multiple) {
                    const option = getOption(newValue);
                    selectedOptionsRef.value = option ? [option] : [];
                } else {
                    selectedOptionsRef.value = newValue
                        .map((value: SelectValue) => {
                            return getOption(value);
                        })
                        .filter(Boolean);
                }
            },
            {
                immediate: true,
                deep: true,
            },
        );

        provide(key, {
            addOption,
            removeOption,
        });

        const focus = (e: Event) => {
            emit('focus', e);
            validate('focus');
        };

        const blur = (e: Event) => {
            if (isOpenedRef.value) {
                isOpenedRef.value = false;
            }
            emit('blur', e);
            validate('blur');
        };

        const handleFilterTextChange = (
            val: string,
            extraInfo?: {
                isClear: boolean;
            },
        ) => {
            filterText.value = val;
            // blur 自动清的 inputText 不触发 search
            if (props.remote && !extraInfo?.isClear) {
                emit('search', val);
            }
        };

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

        const onScroll = (e: Event) => {
            emit('scroll', e);
        };

        return {
            prefixCls,
            isOpenedRef,
            currentValue,
            handleRemove: onSelect,
            handleClear,
            selectedOptionsRef,
            focus,
            blur,
            handleFilterTextChange,
            triggerRef,
            dropdownStyle,
            isSelect,
            onSelect,
            filteredOptions,
            listEmptyText,
            inputPlaceholder,
            isError,
            onScroll,
            isLimitRef,
            attrs,
        };
    },
});
</script>
