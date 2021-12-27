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
            <bar
                :scrollbarRef="[scrollbarRef]"
                :containerRef="containerRef"
                :move="thumbMoveX"
                :ratio="ratioX"
                :size="sizeWidth"
                :always="always"
            />
            <bar
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

<script lang="ts">
import {
    computed,
    CSSProperties,
    nextTick,
    onMounted,
    PropType,
    ref,
    defineComponent,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { addUnit, requestAnimationFrame } from '../_util/utils';
import useResize from '../_util/use/useResize';

import Bar from './bar.vue';

import useScrollbar from './useScrollbar';

const prefixCls = getPrefixCls('scrollbar');

const scrollbarProps = {
    height: {
        type: [Number, String] as PropType<number | string>,
    },
    maxHeight: {
        type: [Number, String] as PropType<number | string>,
    },
    native: {
        type: Boolean,
        default: false,
    },
    containerClass: [Array, Object, String] as PropType<CSSProperties>,
    containerStyle: [Array, Object, String] as PropType<CSSProperties>,
    noresize: Boolean,
    always: {
        type: Boolean,
        default: false,
    },
    minSize: {
        type: Number,
        default: 20,
    },
} as const;

export default defineComponent({
    name: 'FScrollbar',
    components: {
        Bar,
    },
    props: scrollbarProps,
    emits: ['scroll'],
    setup(props, { emit }) {
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
        const scrollbarRef = ref();

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
            computed(() =>
                containerRef.value
                    ? containerRef.value.firstElementChild
                    : null,
            ),
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

        return {
            scrollbarRef,
            containerRef,
            style,
            prefixCls,
            setScrollTop,
            setScrollLeft,
            update: onUpdate,
            handleScroll,
            thumbMoveX,
            thumbMoveY,
            ratioX,
            ratioY,
            sizeHeight,
            sizeWidth,
        };
    },
});
</script>
