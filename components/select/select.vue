<template>
    <div :class="prefixCls">
        <Popper
            v-model="isOpenedRef"
            trigger="click"
            placement="bottom-start"
            :onlyShowTrigger="filterable || remote"
            :popperClass="[`${prefixCls}-popper`, popperClass]"
            :appendToContainer="appendToContainer"
            :getContainer="getContainer"
            :offset="4"
            :hideAfter="0"
            :disabled="innerDisabled"
        >
            <template #trigger>
                <SelectTrigger
                    ref="triggerRef"
                    :selectedOptions="selectedOptionsRef"
                    :disabled="innerDisabled"
                    :clearable="clearable"
                    :isOpened="isOpenedRef"
                    :multiple="multiple"
                    :placeholder="inputPlaceholder"
                    :filterable="filterable || remote"
                    :collapseTags="collapseTags"
                    :collapseTagsLimit="collapseTagsLimit"
                    :tagBordered="tagBordered"
                    :class="[{ 'is-error': isError }, triggerClass]"
                    :style="triggerStyle"
                    :renderTag="$slots.tag"
                    @keydown.enter="onKeyDown"
                    @remove="onSelect"
                    @clear="handleClear"
                    @focus="focus"
                    @blur="blur"
                    @input="handleFilterTextChange"
                />
            </template>
            <template #default>
                <div v-if="$slots.header" :class="`${prefixCls}-addon ${prefixCls}-option-header`" @mousedown.prevent>
                    <slot name="header" />
                </div>
                <OptionList
                    :hoverOptionValue="hoverOptionValue"
                    :options="filteredOptions"
                    :prefixCls="prefixCls"
                    :containerStyle="dropdownStyle"
                    :isSelect="isSelect"
                    :onSelect="onSelect"
                    :onHover="onHover"
                    :isLimit="isLimitRef"
                    :emptyText="listEmptyText"
                    :renderOption="$slots.option"
                    :renderEmpty="$slots.empty"
                    :virtualScroll="virtualScroll"
                    :filterText="filterText"
                    :filterTextHighlight="filterTextHighlight"
                    @scroll="onScroll"
                    @mousedown.prevent
                />
                <div v-if="$slots.footer" :class="`${prefixCls}-addon ${prefixCls}-option-footer`" @mousedown.prevent>
                    <slot name="footer" />
                </div>
                <div v-else-if="$slots.addon" :class="`${prefixCls}-addon ${prefixCls}-option-footer`" @mousedown.prevent>
                    {{ warnDeprecatedSlot() }}
                    <slot name="addon" />
                </div>
            </template>
        </Popper>
        <div :class="`${prefixCls}-hidden-options`">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { type CSSProperties, computed, defineComponent, provide, ref, unref, watch } from 'vue';
import { isNil } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import { type UseArrayModelReturn, useArrayModel, useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import { useLocale } from '../config-provider/useLocale';
import { SELECT_PROVIDE_KEY, prefixCls } from './const';
import OptionList from './optionList';
import { selectProps } from './props';
import useOptions from './useOptions';
import type { SelectOption, SelectValue } from './interface';

export default defineComponent({
    name: 'FSelect',
    components: {
        Popper,
        SelectTrigger,
        OptionList,
    },
    props: selectProps,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT, 'removeTag', 'visibleChange', 'focus', 'blur', 'clear', 'scroll', 'search', 'filter'],
    setup(props, { emit }) {
        useTheme();
        const { validate, isError, isFormDisabled } = useFormAdaptor({
            valueType: computed(() => (props.multiple ? 'array' : 'string')),
        });
        const innerDisabled = computed(() => props.disabled === true || isFormDisabled.value);
        const isOpenedRef = ref(false);
        // 与 props 中 modelValue 类型保持一致
        const [currentValue, updateCurrentValue] = props.multiple ? (useArrayModel(props, emit) as unknown as UseArrayModelReturn<SelectValue[]>) : useNormalModel(props, emit);

        const triggerRef = ref();
        const triggerWidth = ref(0);

        const filterText = ref('');

        const cacheOptions = ref([]);

        watch(isOpenedRef, () => {
            emit('visibleChange', unref(isOpenedRef));
            // trigger 在mounted 之后可能会改变
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
            if (props.multiple ? ((currentValue.value as SelectValue[]) || []).length : currentValue.value !== null) {
                updateCurrentValue(value);
                handleChange();
            }
            filterText.value = '';
            cacheOptions.value = [];
            emit('clear');
        };

        const { t } = useLocale();
        const inputPlaceholder = computed(() => props.placeholder || t('select.placeholder'));
        const listEmptyText = computed(() => props.emptyText || t('select.emptyText'));

        const { addOption, removeOption, flatBaseOptions } = useOptions({
            props,
        });

        provide(SELECT_PROVIDE_KEY, {
            addOption,
            removeOption,
        });

        // 自定义选项
        const cacheOptionsForTag = computed(() => {
            if (props.filterable && props.tag) {
                if (
                    filterText.value
                    && flatBaseOptions.value.every((option) => {
                        return option.label !== filterText.value;
                    })
                    && cacheOptions.value.every((option) => {
                        return option.value !== filterText.value;
                    })
                ) {
                    return [
                        {
                            value: filterText.value,
                            label: filterText.value,
                            __cache: true,
                        },
                        ...cacheOptions.value,
                    ];
                }
                return cacheOptions.value;
            }
            return [];
        });

        const allOptions = computed(() => {
            return [...cacheOptionsForTag.value, ...flatBaseOptions.value];
        });

        const filteredOptions = computed(() => {
            if (!props.remote && props.filterable && filterText.value) {
                return allOptions.value.filter((option) => {
                    if (option.__isGroup) {
                        return false;
                    } else {
                        if (props.filter) {
                            return props.filter(filterText.value, option);
                        }
                        return String(option.label).includes(filterText.value);
                    }
                });
            }
            return allOptions.value;
        });

        const isSelect = (value: SelectValue) => {
            const selectVal = (unref(currentValue) as SelectValue[]) || [];
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
            if (props.multiple) {
                const selectVal = (unref(currentValue) as SelectValue[]) || [];
                return props.multipleLimit > 0 && props.multipleLimit === selectVal.length;
            }
            return false;
        });

        const onSelect = (value: SelectValue, option?: SelectOption) => {
            if (innerDisabled.value) {
                return;
            }
            if (props.multiple) {
                filterText.value = '';
                if (isSelect(value)) {
                    emit('removeTag', value);
                } else {
                    if (isLimitRef.value) {
                        return;
                    }
                }
            } else {
                // 体验更好
                setTimeout(() => {
                    filterText.value = '';
                }, 400);
                isOpenedRef.value = false;
            }
            if (props.filterable && props.tag) {
                if (props.multiple) {
                    if (isSelect(value)) {
                        const index = cacheOptions.value.findIndex((option) => {
                            return option.value === value;
                        });
                        if (index !== -1) {
                            cacheOptions.value.splice(index, 1);
                        }
                    } else {
                        if (option?.__cache) {
                            cacheOptions.value = [option, ...cacheOptions.value];
                        }
                    }
                } else {
                    if (option?.__cache) {
                        cacheOptions.value = [option];
                    } else {
                        cacheOptions.value = [];
                    }
                }
            }
            updateCurrentValue(unref(value));
            handleChange();
        };

        // select-trigger 选择项展示，只在 currentValue 改变时才改变
        const selectedOptionsRef = ref([]);
        watch(
            [currentValue, allOptions],
            ([newValue, newOptions]) => {
                const getOption = (val: SelectValue) => {
                    let cacheOption;
                    if (newOptions && newOptions.length) {
                        cacheOption = newOptions.find((option) => option.value === val);
                        if (cacheOption) {
                            return cacheOption;
                        }
                    }
                    cacheOption = selectedOptionsRef.value.find((option) => !option.__isGroup && option.value === val);
                    if (cacheOption) {
                        return cacheOption;
                    }
                    return val ? { value: val, label: null } : null;
                };

                if (!props.multiple) {
                    const option = getOption(newValue);
                    selectedOptionsRef.value = option ? [option] : [];
                } else {
                    selectedOptionsRef.value = ((newValue as SelectValue[]) || [])
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
            emit('filter', val);
            // blur 自动清的 inputText 不触发 search
            if (props.remote && !extraInfo?.isClear) {
                emit('search', val);
            }
        };

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

        const hoverOptionValue = ref();

        const onHover = (option: SelectOption) => {
            hoverOptionValue.value = option.value;
        };

        function getFirstOption() {
            const len = filteredOptions.value.length;
            if (len < 1) {
                return;
            }
            let index = 0;
            while (index < len) {
                if (!filteredOptions.value[index].__isGroup && !filteredOptions.value[index].disabled) {
                    break;
                }
                index++;
            }

            if (index < len) {
                return filteredOptions.value[index];
            }
        }

        watch(isOpenedRef, () => {
            if (isOpenedRef.value) {
                if (props.multiple) {
                    const currentSelectValues = (currentValue.value as SelectValue[]) || [];
                    if (currentSelectValues.length > 0) {
                        hoverOptionValue.value = currentSelectValues[0];
                    }
                } else if (!isNil(currentValue.value)) {
                    hoverOptionValue.value = currentValue.value;
                }
                const option = getFirstOption();
                if (isNil(hoverOptionValue.value) && option) {
                    hoverOptionValue.value = option.value;
                }
            } else {
                hoverOptionValue.value = undefined;
            }
        });

        watch(filteredOptions, () => {
            const option = getFirstOption();
            if (isOpenedRef.value && option) {
                hoverOptionValue.value = option.value;
            }
        });

        const onKeyDown = () => {
            if (!isNil(hoverOptionValue.value)) {
                const option = allOptions.value.find((option: SelectOption) => {
                    return !option.__isGroup && option.value === hoverOptionValue.value;
                });
                onSelect(hoverOptionValue.value, option);
            }
        };

        const warnDeprecatedSlot = () => console.warn('[FSelect]: addon 插槽即将废弃，请使用 footer 插槽代替');

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
            innerDisabled,
            onScroll,
            isLimitRef,
            hoverOptionValue,
            onHover,
            onKeyDown,
            warnDeprecatedSlot,
            filterText,
        };
    },
});
</script>
