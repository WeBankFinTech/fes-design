<template>
    <div ref="scrollbarRef" :class="wrapperClassRef">
        <div
            ref="containerRef"
            :class="containerClassRef"
            :style="style"
            @scroll="handleScroll"
        >
            <div
                ref="contentRef"
                :class="`${prefixCls}-content`"
                :style="[scrollX && { width: 'fit-content' }, contentStyle]"
            >
                <slot></slot>
            </div>
        </div>
        <template v-if="!native">
            <FBar
                :scrollbarRef="[scrollbarRef]"
                :containerRef="containerRef"
                :move="thumbMoveX"
                :ratio="ratioX"
                :size="sizeWidth"
                :always="always"
                :style="horizontalRatioStyle"
            />
            <FBar
                :scrollbarRef="[scrollbarRef]"
                :containerRef="containerRef"
                :move="thumbMoveY"
                :ratio="ratioY"
                :size="sizeHeight"
                vertical
                :always="always"
                :style="verticalRatioStyle"
            />
        </template>
        <div
            v-if="shadowRef.x && scrollX && scrollXRatio < 1"
            :class="`${prefixCls}-shadow-right`"
            :style="shadowStyle"
        ></div>
        <div
            v-if="shadowRef.x && scrollX && scrollXRatio > 0"
            :class="`${prefixCls}-shadow-left`"
            :style="shadowStyle"
        ></div>
        <div
            v-if="shadowRef.y && scrollY && scrollYRatio < 1"
            :class="`${prefixCls}-shadow-bottom`"
            :style="shadowStyle"
        ></div>
        <div
            v-if="shadowRef.y && scrollY && scrollYRatio > 0"
            :class="`${prefixCls}-shadow-top`"
            :style="shadowStyle"
        ></div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { pxfy, requestAnimationFrame } from '../_util/utils';
import useResize from '../_util/use/useResize';
import FBar from './bar.vue';
import useScrollbar from './useScrollbar';
import { scrollbarProps } from './const';

const prefixCls = getPrefixCls('scrollbar');

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

        const contentRef = ref<HTMLElement>();

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
                height: pxfy(props.height),
                maxHeight: pxfy(props.maxHeight),
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
            contentRef,
            () => {
                onUpdate();
                onScroll();
            },
            computed(() => props.noresize),
            false,
        );

        useResize(
            scrollbarRef,
            () => {
                onUpdate();
                onScroll();
            },
            computed(() => props.noresize),
            false,
        );

        onMounted(() => {
            // 等待content插槽内容渲染完毕用setTimeout
            if (!props.native) {
                setTimeout(onUpdate, 0);
            }
            setTimeout(onScroll, 0);
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
            contentRef,
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
