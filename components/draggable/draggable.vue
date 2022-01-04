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
<script setup lang="ts">
import { computed, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useDraggable } from './useDraggable';
import { useTheme } from '../_theme/useTheme';

import type { DraggableEmits } from './interface';

const prefixCls = getPrefixCls('draggable');

type DraggableProps = {
    modelValue: [];
    droppable: boolean;
    disabled: boolean;
};

const props = withDefaults(defineProps<DraggableProps>(), {
    droppable: false,
    disabled: false,
});

const emit = defineEmits<DraggableEmits>();

useTheme();
const rootRef = ref<HTMLElement>();
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
} = useDraggable(rootRef, propsRef, {
    emit,
});
</script>

<script lang="ts">
export default {
    name: 'FDraggable',
};
</script>
