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
                    @remove="handleRemove"
                    @clear="handleClear"
                    @focus="focus"
                    @blur="blur"
                    @input="handleFilterTextChange"
                />
            </template>
            <template #default>
                <Scrollbar
                    :containerStyle="dropdownStyle"
                    :containerClass="`${prefixCls}-dropdown`"
                >
                    <slot>
                        <div :class="`${prefixCls}-null`">{{ emptyText }}</div>
                    </slot>
                </Scrollbar>
            </template>
        </Popper>
    </div>
</template>
<script>
import {
    defineComponent,
    ref,
    provide,
    unref,
    reactive,
    watch,
    computed,
    onMounted,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel, useArrayModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import Scrollbar from '../scrollbar';
import { key } from './const';
import PROPS from './props';

const prefixCls = getPrefixCls('select');

export default defineComponent({
    name: 'FSelect',
    components: {
        Popper,
        Scrollbar,
        SelectTrigger,
    },
    props: {
        ...PROPS,
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
        const filterText = ref('');

        watch(isOpened, () => {
            emit('visibleChange', unref(isOpened));
        });
        watch(currentValue, () => {
            emit(CHANGE_EVENT, unref(currentValue));
            validate(CHANGE_EVENT);
        });

        const handleClear = () => {
            const value = props.multiple ? [] : null;
            updateCurrentValue(value);
            emit('clear');
        };

        const options = reactive([]);
        const addOption = (option) => {
            if (!options.includes(option)) {
                options.push(option);
            }
        };

        const isSelect = (value) => {
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

        const onSelect = (value) => {
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
                return options.filter((option) => option.value === val);
            }
            return val.map((value) => {
                const filteredOption = options.filter(
                    (option) => option.value === value,
                );
                if (filteredOption.length) {
                    return filteredOption[0];
                }
                return { value };
            });
        });

        provide(key, {
            onSelect,
            isSelect,
            addOption,
            filterText,
        });

        const focus = (e) => {
            emit('focus', e);
        };

        const blur = (e) => {
            emit('blur', e);
            validate('blur');
        };

        const handleFilterTextChange = (val) => {
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
            const style = {};
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
        };
    },
});
</script>
