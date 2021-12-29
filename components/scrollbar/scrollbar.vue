<template>
    <div ref="scrollbarRef" :class="prefixCls">
        <div
            ref="containerRef"
            :class="[
                `${prefixCls}-container`,
                containerClass,
                !native && `${prefixCls}-hidden-native-bar`,
            ]"
            :style="style"
            @scroll="handleScroll"
        >
            <slot></slot>
        </div>
        <template v-if="!native">
            <FBar
                :scrollbarRef="[scrollbarRef]"
                :containerRef="containerRef"
                :move="thumbMoveX"
                :ratio="ratioX"
                :size="sizeWidth"
                :always="always"
            />
            <FBar
                :scrollbarRef="[scrollbarRef]"
                :containerRef="containerRef"
                :move="thumbMoveY"
                :ratio="ratioY"
                :size="sizeHeight"
                vertical
                :always="always"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { addUnit, requestAnimationFrame } from '../_util/utils';
import useResize from '../_util/use/useResize';

import type { ScrollbarProps } from './interface';

import FBar from './bar.vue';

import useScrollbar from './useScrollbar';

const prefixCls = getPrefixCls('scrollbar');

const props = withDefaults(defineProps<ScrollbarProps>(), {
    minSize: 20,
});

type ScrollbarEmits = {
    (e: 'scroll', val: { scrollTop: number; scrollLeft: number }): void;
};

const emit = defineEmits<ScrollbarEmits>();

useTheme();
const {
    onUpdate,
    onScroll,
    containerRef,
    ratioX,
    ratioY,
    thumbMoveX,
    thumbMoveY,
    sizeHeight,
    sizeWidth,
} = useScrollbar(props);
const scrollbarRef = ref<HTMLElement>();

const style = computed(() => [
    props.containerStyle,
    {
        height: addUnit(props.height),
        maxHeight: addUnit(props.maxHeight),
    },
]);

const handleScroll = () => {
    onScroll();
    const containerRefValue = containerRef.value;
    if (containerRefValue) {
        emit('scroll', {
            scrollTop: containerRefValue.scrollTop,
            scrollLeft: containerRefValue.scrollLeft,
        });
    }
};

useResize(
    containerRef,
    onUpdate,
    computed(() => props.noresize),
);

onMounted(() => {
    if (!props.native) {
        nextTick(onUpdate);
    }
});

const move = (type: string, to: number, duration: number) => {
    if (!duration || duration <= 0) {
        containerRef.value[type] = to;
        return;
    }
    const difference = to - containerRef.value[type];
    const perTick = (difference / duration) * 10;
    requestAnimationFrame(() => {
        containerRef.value[type] += perTick;
        if (containerRef.value[type] === to) {
            return;
        }
        move(type, to, duration - 10);
    });
};

const setScrollTop = (val: number, duration: number) => {
    move('scrollTop', val, duration);
};
const setScrollLeft = (val: number, duration: number) => {
    move('scrollLeft', val, duration);
};

defineExpose({
    setScrollTop,
    setScrollLeft,
});
</script>

<script>
export default {
    name: 'FScrollbar',
};
</script>
