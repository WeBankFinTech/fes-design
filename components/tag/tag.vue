<template>
    <div :class="classes" :style="{ backgroundColor }" @click="handleClick">
        <template v-if="$slots.icon">
            <slot name="icon"></slot>
        </template>
        <slot></slot>
        <CloseCircleOutlined
            v-if="closable"
            :class="`${prefixCls}__close`"
            @click.stop="handleClose"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import CloseCircleOutlined from '../icon/CloseOutlined';

const prefixCls = getPrefixCls('tag');

const TAG_TYPE = ['default', 'success', 'info', 'warning', 'danger'] as const;
const TAG_SIZE = ['small', 'middle', 'large'] as const;
const TAG_EFFECT = ['dark', 'light', 'plain'] as const;

interface TagProps {
    type: typeof TAG_TYPE[number];
    closable: boolean;
    backgroundColor: string;
    size: typeof TAG_SIZE[number];
    effect: typeof TAG_EFFECT[number];
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
</script>

<script>
export default {
    name: 'FTag',
};
</script>
