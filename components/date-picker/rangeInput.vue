<template>
    <span
        :class="[prefixCls, disabled && 'is-disabled']"
        tabindex="0"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @focus="(e) => $emit('focus', e)"
        @blur="(e) => $emit('blur', e)"
    >
        <input
            :class="`${prefixCls}-inner`"
            :value="dateTexts[0]"
            :placeholder="innerPlaceHolder[0]"
            readonly
        />
        <span :class="`${prefixCls}-separator`">
            <slot name="separator"></slot>
        </span>
        <input
            :class="`${prefixCls}-inner`"
            :value="dateTexts[1]"
            :placeholder="innerPlaceHolder[1]"
            readonly
        />
        <span :class="`${prefixCls}-suffix`" @mousedown.prevent>
            <CloseCircleFilled
                v-if="showClear"
                @click.stop="clear"
            />
            <slot v-else name="suffix"></slot>
        </span>
    </span>
</template>

<script>
import { computed, ref } from 'vue';
import { isArray } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { CloseCircleFilled } from '../icon';

import { DATE_TYPE } from './const';
import { isEmptyValue, timeFormat } from './helper';

const prefixCls = getPrefixCls('range-input');

function useFocus(emit) {
    const focused = ref(false);

    const handleFocus = (event) => {
        focused.value = true;
        emit('focus', event);
    };

    const handleBlur = (event) => {
        focused.value = false;
        emit('blur', event);
    };

    return {
        focused,
        handleFocus,
        handleBlur,
    };
}

function useMouse(emit) {
    const hovering = ref(false);
    const onMouseLeave = (e) => {
        hovering.value = false;
        emit('mouseleave', e);
    };

    const onMouseEnter = (e) => {
        hovering.value = true;
        emit('mouseenter', e);
    };

    return {
        hovering,
        onMouseLeave,
        onMouseEnter,
    };
}


export default {
    components: {
        CloseCircleFilled,
    },
    props: {
        type: String,
        selectedDates: {
            type: Array,
            default: () => [],
        },
        separator: String,
        clearable: Boolean,
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: [String, Array],
    },
    emits: ['clear', 'focus', 'blur', 'mouseleave', 'mouseenter'],
    setup(props, { emit }) {
        const innerPlaceHolder = computed(() => (isArray(props.placeholder) ? props.placeholder : [props.placeholder, props.placeholder]));

        const dateTexts = computed(() => {
            if (isEmptyValue(props.selectedDates)) {
                return [];
            }
            const format = DATE_TYPE[props.type].format;
            return [timeFormat(props.selectedDates[0], format), timeFormat(props.selectedDates[1], format)];
        });

        const {
            focused,
            handleFocus,
            handleBlur,
        } = useFocus(emit);

        const {
            hovering,
            onMouseLeave,
            onMouseEnter,
        } = useMouse(emit);

        const showClear = computed(() => props.clearable
            && !props.disabled
            && props.selectedDates?.length
            && (focused.value || hovering.value));

        const clear = () => {
            emit('clear');
        };

        return {
            prefixCls,
            innerPlaceHolder,
            dateTexts,

            focused,
            handleFocus,
            handleBlur,

            hovering,
            onMouseLeave,
            onMouseEnter,

            showClear,
            clear,
        };
    },
};
</script>
