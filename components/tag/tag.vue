<template>
    <div :class="classes" :style="{ backgroundColor }" @click="handleClick">
        <template v-if="$slots.icon">
            <slot name="icon" />
        </template>
        <slot />
        <div v-if="closable" :class="`${prefixCls}__close`">
            <CloseCircleOutlined
                class="outlined"
                @click.stop="handleClose"
            />
            <CloseCircleFilled
                class="filled"
                @click.stop="handleClose"
            />
        </div>
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

        return {
            prefixCls,
            classes,
            handleClose,
            handleClick,
        };
    },
});
</script>
