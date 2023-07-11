<template>
    <div :class="classes" :style="{ backgroundColor }" @click="handleClick">
        <template v-if="$slots.icon">
            <slot name="icon"></slot>
        </template>
        <slot></slot>
        <template v-if="closable">
            <CloseCircleOutlined
                v-show="!isHover"
                :class="`${prefixCls}__close`"
                @click.stop="handleClose"
                @mouseover="mouseCloseOver"
            />
            <CloseCircleFilled
                v-show="isHover"
                :class="`${prefixCls}__close`"
                @click.stop="handleClose"
                @mouseleave="mouseCloseLeave"
            />
        </template>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import CloseCircleFilled from '../icon/CloseCircleFilled';
import CloseCircleOutlined from '../icon/CloseCircleOutlined';
import { CLOSE_EVENT } from '../_util/constants';
import { tagProps } from './props';
import { useHover } from './useHover';

const prefixCls = getPrefixCls('tag');

export default defineComponent({
    name: 'FTag',
    components: {
        CloseCircleFilled,
        CloseCircleOutlined,
    },
    props: {
        ...tagProps,
    },
    emits: ['click', CLOSE_EVENT],
    setup(props, { emit }) {
        useTheme();

        const classes = computed(() => ({
            [prefixCls]: true,
            [`${prefixCls}-type--${props.type}`]: props.type,
            [`${prefixCls}-size--${props.size}`]: props.size,
            [`${prefixCls}-effect--${props.effect}`]: props.effect,
            'is-bordered': props.bordered,
        }));

        const handleClose = (event: Event) => {
            emit(CLOSE_EVENT, event);
        };

        const handleClick = (event: Event) => {
            emit('click', event);
        };

        const { isHover, mouseCloseOver, mouseCloseLeave } = useHover();

        return {
            prefixCls,
            classes,
            handleClose,
            handleClick,
            isHover,
            mouseCloseOver,
            mouseCloseLeave,
        };
    },
});
</script>
