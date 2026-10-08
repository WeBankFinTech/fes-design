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
                    :ariaControls="optionListId"
                    :ariaActiveDescendant="activeDescendantId"
                    :ariaLabelledby="triggerAriaLabelledby"
                    @keydown="onTriggerKeyDown"
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
                    :id="optionListId"
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
import useId from '../_util/use/useId';
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
        const { validate, isError, isFormDisabled, labelId } = useFormAdaptor({
            valueType: computed(() => (props.multiple ? 'array' : 'string')),
        });
        const innerDisabled = computed(() => props.disabled === true || isFormDisabled.value);
        const isOpenedRef = ref(false);

        // 无障碍：表单 label 关联（FFormItem 注入；无 label 时为 undefined）
        const triggerAriaLabelledby = computed(() => unref(labelId));
        // 与 props 中 modelValue 类型保持一致
        const [currentValue, updateCurrentValue] = props.multiple ? (useArrayModel(props, emit) as unknown as UseArrayModelReturn<SelectValue[]>) : useNormalModel(props, emit);

        // 无障碍：下拉列表 id，供触发器 aria-controls 关联
        const optionListId = useId();
        // 无障碍：当前高亮选项 id，供 aria-activedescendant 朗读
        const activeDescendantId = computed(() => {
            if (!isOpenedRef.value || isNil(hoverOptionValue.value)) {
                return undefined;
            }
            return `${optionListId}-option-${String(hoverOptionValue.value)}`;
        });

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

        // 无障碍：键盘导航。焦点保留在触发器上，
        // 上下键移动高亮项（aria-activedescendant 跟随朗读），Enter 选中，Esc 关闭
        const selectableOptions = computed(() =>
            filteredOptions.value.filter((option) => !option.__isGroup && !option.disabled),
        );

        const moveHover = (step: number) => {
            const options = selectableOptions.value;
            if (!options.length) {
                return;
            }
            const currentIndex = options.findIndex(
                (option) => option.value === hoverOptionValue.value,
            );
            let nextIndex = currentIndex + step;
            if (nextIndex < 0) {
                nextIndex = options.length - 1;
            }
            if (nextIndex > options.length - 1) {
                nextIndex = 0;
            }
            hoverOptionValue.value = options[nextIndex].value;
        };

        // filterable/remote 且已输入过滤文本时，Home/End 属于输入框光标操作，
        // 不劫持（否则下拉打开时无法把光标移到文本首尾）
        const isFiltering = () =>
            Boolean(props.filterable || props.remote) && Boolean(filterText.value);

        // 归一化按键名：真实浏览器返回 'Enter'/'ArrowDown'（DOM key）
        // 或 'Enter'/'ArrowDown'（DOM code）；合成事件可能给小写 'enter'、
        // 甚至把数字 keyCode 塞进 code 字段——统一折算成 DOM key 风格
        const normalizeKey = (e: KeyboardEvent): string => {
            const raw = String(e.key ?? e.code ?? '');
            if (/^\d+$/.test(raw) || raw === 'Unidentified' || raw === '') {
                // 纯数字视为 keyCode，按常见键位折算
                const map: Record<string, string> = {
                    13: 'Enter',
                    27: 'Escape',
                    35: 'End',
                    36: 'Home',
                    38: 'ArrowUp',
                    40: 'ArrowDown',
                };
                return map[raw] ?? '';
            }
            const code = String(e.code ?? '');
            if (/^(?:Enter|NumpadEnter|Escape|Home|End|ArrowUp|ArrowDown)$/.test(code)) {
                return code === 'NumpadEnter' ? 'Enter' : code;
            }
            if (/^arrow/i.test(raw)) {
                return raw.replace(/^arrow/i, 'Arrow');
            }
            return raw.charAt(0).toUpperCase() + raw.slice(1);
        };

        const onTriggerKeyDown = (e: KeyboardEvent) => {
            if (innerDisabled.value) {
                return;
            }
            // IME 组合态守卫：中文/日文输入法选词确认的 Enter（连同
            // isComposing=true / keyCode 229 的变体）不应触发选项选中
            if (e.isComposing || e.keyCode === 229) {
                return;
            }
            switch (normalizeKey(e)) {
                case 'Enter':
                    e.preventDefault();
                    if (isOpenedRef.value) {
                        onKeyDown();
                    } else {
                        isOpenedRef.value = true;
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (!isOpenedRef.value) {
                        isOpenedRef.value = true;
                    } else {
                        moveHover(1);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (isOpenedRef.value) {
                        moveHover(-1);
                    }
                    break;
                case 'Escape':
                    if (isOpenedRef.value) {
                        e.stopPropagation();
                        isOpenedRef.value = false;
                    }
                    break;
                case 'Home':
                    if (
                        isOpenedRef.value
                        && selectableOptions.value.length
                        && !isFiltering()
                    ) {
                        e.preventDefault();
                        hoverOptionValue.value = selectableOptions.value[0].value;
                    }
                    break;
                case 'End':
                    if (
                        isOpenedRef.value
                        && selectableOptions.value.length
                        && !isFiltering()
                    ) {
                        e.preventDefault();
                        hoverOptionValue.value
                            = selectableOptions.value[selectableOptions.value.length - 1].value;
                    }
                    break;
                default:
                    break;
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
            onTriggerKeyDown,
            optionListId,
            activeDescendantId,
            triggerAriaLabelledby,
            warnDeprecatedSlot,
            filterText,
        };
    },
});
</script>
