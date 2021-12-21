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

<script>
import { computed, nextTick, onMounted, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { addUnit, requestAnimationFrame } from '../_util/utils';
import useResize from '../_util/use/useResize';

import Bar from './bar';

import useScrollbar from './useScrollbar';

const prefixCls = getPrefixCls('scrollbar');

export default {
    name: 'FScrollbar',
    components: {
        Bar,
    },
    props: {
        height: {
            type: [Number, String],
        },
        maxHeight: {
            type: [Number, String],
        },
        native: {
            type: Boolean,
            default: false,
        },
        containerClass: [Array, Object, String],
        containerStyle: [Array, Object, String],
        noresize: Boolean,
        always: {
            type: Boolean,
            default: false,
        },
        minSize: {
            type: Number,
            default: 20,
        },
    },
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

        const move = (type, to, duration) => {
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

        const setScrollTop = (val, duration) => {
            move('scrollTop', val, duration);
        };
        const setScrollLeft = (val, duration) => {
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
};
</script>
