<template>
    <div
        tabindex="0"
        :class="triggerClass"
        @mouseenter="inputHovering = true"
        @mouseleave="inputHovering = false"
        @focus="handleFocus"
        @blur="handleBlur"
    >
        <Label
            :isOpened="isOpened"
            :selectedOptions="selectedOptions"
            :multiple="multiple"
            :placeholder="placeholder"
            :filterable="filterable"
            :disabled="disabled"
            :collapseTags="collapseTags"
            :collapseTagsLimit="collapseTagsLimit"
            @remove-tag="handleRemove"
            @input="handleFilterTextChange"
        ></Label>
        <div :class="`${prefixCls}-icons`">
            <UpOutlined
                v-show="isOpened && !showClear"
                :class="`${prefixCls}-icon`"
            />
            <DownOutlined
                v-show="!isOpened && !showClear"
                :class="`${prefixCls}-icon`"
            />
            <CloseCircleFilled
                v-if="clearable"
                v-show="showClear"
                :class="`${prefixCls}-icon`"
                @click.stop="handleClear"
            />
        </div>
    </div>
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import Label from './label';
import UpOutlined from '../icon/UpOutlined';
import DownOutlined from '../icon/DownOutlined';
import CloseCircleFilled from '../icon/CloseCircleFilled';

const prefixCls = getPrefixCls('select-trigger');

function useFocus(emit, props) {
    const isFocus = ref(false);

    const handleFocus = (event) => {
        if (props.disabled) return;
        isFocus.value = true;
        emit('focus', event);
    };

    const handleBlur = (event) => {
        if (props.disabled) return;
        isFocus.value = false;
        emit('blur', event);
    };

    return {
        isFocus,
        handleFocus,
        handleBlur,
    };
}

export default defineComponent({
    name: 'FSelect',
    components: {
        Label,
        UpOutlined,
        DownOutlined,
        CloseCircleFilled,
    },
    props: {
        selectedOptions: {
            type: Array,
            default() {
                return [];
            },
        },
        disabled: Boolean,
        clearable: Boolean,
        isOpened: Boolean,
        multiple: Boolean,
        filterable: Boolean,
        placeholder: String,
        collapseTags: Boolean,
        collapseTagsLimit: Number,
    },
    emits: ['remove', 'clear', 'focus', 'blur', 'input'],
    setup(props, { emit }) {
        const inputHovering = ref(false);
        const unSelected = computed(() => props.selectedOptions.length === 0);
        const { isFocus, handleFocus, handleBlur } = useFocus(emit, props);
        const showClear = computed(
            () =>
                !props.disabled &&
                props.clearable &&
                !unSelected.value &&
                inputHovering.value,
        );
        const triggerClass = computed(() => ({
            [`${prefixCls}`]: true,
            'is-active': props.isOpened || isFocus.value,
            'is-disabled': props.disabled,
            'is-multiple': props.multiple,
        }));
        const handleRemove = (val) => {
            if (props.disabled) return;
            emit('remove', val);
        };
        const handleClear = () => {
            if (props.disabled) return;
            emit('clear');
        };
        const handleFilterTextChange = (val) => {
            if (props.disabled) return;
            emit('input', val);
        };
        return {
            prefixCls,
            inputHovering,
            showClear,
            triggerClass,
            unSelected,
            handleRemove,
            handleClear,
            handleFocus,
            handleBlur,
            handleFilterTextChange,
        };
    },
});
</script>
