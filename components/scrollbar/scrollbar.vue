<template>
    <div ref="scrollbarRef" :class="wrapperClassRef">
        <div
            ref="containerRef"
            :class="containerClassRef"
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
        <div
            v-if="shadowRef.x && scrollX && scrollXRatio < 1"
            :class="`${prefixCls}-shadow-right`"
        ></div>
        <div
            v-if="shadowRef.x && scrollX && scrollXRatio > 0"
            :class="`${prefixCls}-shadow-left`"
        ></div>
        <div
            v-if="shadowRef.y && scrollY && scrollYRatio < 1"
            :class="`${prefixCls}-shadow-bottom`"
        ></div>
        <div
            v-if="shadowRef.y && scrollY && scrollYRatio > 0"
            :class="`${prefixCls}-shadow-top`"
        ></div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    nextTick,
    onMounted,
    ref,
    CSSProperties,
    PropType,
    ExtractPropTypes,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { addUnit, requestAnimationFrame } from '../_util/utils';
import useResize from '../_util/use/useResize';
import FBar from './bar.vue';
import useScrollbar from './useScrollbar';
import { COMMON_PROPS } from './const';

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
    containerStyle: Object as PropType<CSSProperties>,
    noresize: Boolean,
    always: {
        type: Boolean,
        default: false,
    },
    minSize: {
        type: Number,
        default: 20,
    },
    ...COMMON_PROPS,
} as const;

export type ScrollbarProps = Partial<ExtractPropTypes<typeof scrollbarProps>>;

export default defineComponent({
    name: 'FScrollbar',
    components: {
        FBar,
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
            scrollX,
            scrollXRatio,
            scrollY,
            scrollYRatio,
        } = useScrollbar(props);
        const scrollbarRef = ref<HTMLElement>();

        const shadowRef = computed(() => {
            if (typeof props.shadow === 'boolean') {
                return {
                    x: props.shadow,
                    y: props.shadow,
                };
            }
            return props.shadow;
        });

        const style = computed(() => [
            props.containerStyle,
            {
                height: addUnit(props.height),
                maxHeight: addUnit(props.maxHeight),
            },
        ]);

        const wrapperClassRef = computed(() => [prefixCls]);

        const containerClassRef = computed(() => [
            `${prefixCls}-container`,
            props.containerClass,
            !props.native && `${prefixCls}-hidden-native-bar`,
        ]);

        const handleScroll = (event: Event) => {
            onScroll();
            const containerRefValue = containerRef.value;
            if (containerRefValue) {
                emit('scroll', event, containerRefValue);
            }
        };

        useResize(
            containerRef,
            () => {
                onUpdate();
                onScroll();
            },
            computed(() => props.noresize),
        );

        onMounted(() => {
            if (!props.native) {
                nextTick(onUpdate);
            }
            onScroll();
        });

        const move = (
            type: 'scrollTop' | 'scrollLeft',
            to: number,
            duration: number,
        ) => {
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
            wrapperClassRef,
            containerClassRef,
            scrollX,
            scrollXRatio,
            scrollY,
            scrollYRatio,
            shadowRef,
        };
    },
});
</script>
