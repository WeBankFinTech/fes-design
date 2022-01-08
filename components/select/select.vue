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
        >
            <template #trigger>
                <SelectTrigger
                    ref="triggerRef"
                    :selectedOptions="selectedOptions"
                    :disabled="disabled"
                    :clearable="clearable"
                    :isOpened="isOpened"
                    :multiple="multiple"
                    :placeholder="placeholder"
                    :filterable="filterable"
                    :collapseTags="collapseTags"
                    :collapseTagsLimit="collapseTagsLimit"
                    @remove="onSelect"
                    @clear="handleClear"
                    @focus="focus"
                    @blur="blur"
                    @input="handleFilterTextChange"
                />
            </template>
            <template #default>
                <div ref="hiddenOptions" :class="`${prefixCls}-hidden-options`">
                    <slot />
                </div>
                <OptionList
                    :options="filteredOptions"
                    :prefixCls="prefixCls"
                    :containerStyle="dropdownStyle"
                    :isSelect="isSelect"
                    :onSelect="onSelect"
                    :emptyText="emptyText"
                />
            </template>
        </Popper>
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
    props: {
        ...selectProps,
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
        const { validate } = useFormAdaptor(
            computed(() => (props.multiple ? 'array' : 'string')),
        );
        const isOpened = ref(false);
        const [currentValue, updateCurrentValue] = props.multiple
            ? useArrayModel(props, emit)
            : useNormalModel(props, emit);

        watch(isOpened, () => {
            emit('visibleChange', unref(isOpened));
        });
        watch(currentValue, () => {
            emit(CHANGE_EVENT, unref(currentValue));
            validate(CHANGE_EVENT);
        });

        const handleClear = () => {
            const value: null | [] = props.multiple ? [] : null;
            updateCurrentValue(value);
            emit('clear');
        };

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

        const options = computed(() => [...props.options, ...childOptions]);

        const filterText = ref('');

        const filteredOptions = computed(() =>
            options.value.filter(
                (option) =>
                    !filterText.value ||
                    String(option.label).includes(filterText.value),
            ),
        );

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

        const onSelect = (value: SelectValue) => {
            if (props.disabled) return;
            filterText.value = '';
            if (props.multiple) {
                if (isSelect(value)) {
                    emit('removeTag', value);
                } else {
                    const selectVal = unref(currentValue);
                    if (
                        props.multipleLimit > 0 &&
                        props.multipleLimit === selectVal.length
                    ) {
                        return;
                    }
                }
            } else {
                isOpened.value = false;
            }
            updateCurrentValue(unref(value));
        };

        // select-trigger 选择项展示
        const selectedOptions = computed(() => {
            const val = unref(currentValue);
            if (!props.multiple) {
                return options.value.filter((option) => option.value === val);
            }
            return val.map((value: SelectValue) => {
                const filteredOption = options.value.filter(
                    (option) => option.value === value,
                );
                if (filteredOption.length) {
                    return filteredOption[0];
                }
                return { value };
            });
        });

        provide(key, {
            addOption,
            removeOption,
        });

        const focus = (e: Event) => {
            emit('focus', e);
        };

        const blur = (e: Event) => {
            if (isOpened.value) {
                isOpened.value = false;
            }
            emit('blur', e);
            validate('blur');
        };

        const handleFilterTextChange = (val: string) => {
            filterText.value = val;
        };

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
            handleRemove: onSelect,
            handleClear,
            selectedOptions,
            focus,
            blur,
            handleFilterTextChange,
            triggerRef,
            dropdownStyle,
            isSelect,
            onSelect,
            filteredOptions,
        };
    },
});
</script>
