<template>
    <ul
        ref="rootRef"
        :class="prefixCls"
        @mousedown="handleSelectDrag"
        @dragover="handleDragover"
        @dragend="handleDragEnd"
        @drop="handleDragEnd"
        @mouseup="handleDragEnd"
        @transitionend="handleTransitionEnd"
    >
        <li
            v-for="(item, index) in modelValue"
            :key="index"
            :class="`${prefixCls}-item`"
            :draggable="settings[index]?.draggable"
            :style="settings[index]?.style"
        >
            <slot :item="item"></slot>
        </li>
    </ul>
</template>
<script>
import { computed, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useDraggable, emits } from './useDraggable';

const prefixCls = getPrefixCls('draggable');

export default {
    name: 'FDraggable',
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        droppable: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits,
    setup(props, ctx) {
        const rootRef = ref(null);
        const propsRef = computed(() => ({
            droppable: props.droppable,
            disabled: props.disabled,
            list: [...props.modelValue],
        }));
        const {
            settings,
            handleSelectDrag,
            handleDragover,
            handleDragEnd,
            handleTransitionEnd,
        } = useDraggable(rootRef, propsRef, ctx);

        return {
            rootRef,
            prefixCls,
            settings,
            handleSelectDrag,
            handleDragover,
            handleDragEnd,
            handleTransitionEnd,
        };
    },
};
</script>
