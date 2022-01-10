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

<script setup lang="ts">
import { computed, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import CloseCircleFilled from '../icon/CloseCircleFilled';
import CloseCircleOutlined from '../icon/CloseCircleOutlined';

const prefixCls = getPrefixCls('tag');

interface TagProps {
    type?: 'default' | 'success' | 'info' | 'warning' | 'danger';
    closable?: boolean;
    backgroundColor?: string;
    size?: 'small' | 'middle' | 'large';
    effect?: 'dark' | 'light' | 'plain';
}

type TagEmits = {
    (e: 'close', event: Event): void;
    (e: 'click', event: Event): void;
};

const props = withDefaults(defineProps<TagProps>(), {
    type: 'default',
    closable: false,
    size: 'middle',
    effect: 'light',
});

const emit = defineEmits<TagEmits>();

useTheme();
const { type, size, effect } = props;

/**
 * computed
 */
const classes = computed(() => ({
    [prefixCls]: true,
    [`${prefixCls}-type--${type}`]: type,
    [`${prefixCls}-size--${size}`]: size,
    [`${prefixCls}-effect--${effect}`]: effect,
}));

/**
 * methods
 */
const handleClose = (event: Event) => {
    emit('close', event);
};

const handleClick = (event: Event) => {
    emit('click', event);
};

function useHover() {
    const isHover = ref(false);

    const mouseCloseOver = () => {
        isHover.value = true;
    };
    const mouseCloseLeave = () => {
        isHover.value = false;
    };

    return {
        isHover,
        mouseCloseOver,
        mouseCloseLeave,
    };
}
const { isHover, mouseCloseOver, mouseCloseLeave } = useHover();
</script>

<script lang="ts">
export default {
    name: 'FTag',
};
</script>
