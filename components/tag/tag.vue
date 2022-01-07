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

<script>
import { computed, defineComponent, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import CloseCircleFilled from '../icon/CloseCircleFilled';
import CloseCircleOutlined from '../icon/CloseCircleOutlined';

const prefixCls = getPrefixCls('tag');

const TAG_TYPE = ['default', 'success', 'info', 'warning', 'danger'];
const TAG_SIZE = ['small', 'middle', 'large'];
const TAG_EFFECT = ['dark', 'light', 'plain'];

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

export default defineComponent({
    name: 'FTag',
    components: { CloseCircleFilled, CloseCircleOutlined },
    props: {
        type: {
            type: String,
            default: 'default',
            validator(value) {
                return !value || TAG_TYPE.includes(value);
            },
        },
        closable: {
            type: Boolean,
            default: false,
        },
        backgroundColor: {
            type: String,
            default: '',
        },
        size: {
            type: String,
            default: 'middle',
            validator(value) {
                return !value || TAG_SIZE.includes(value);
            },
        },
        effect: {
            type: String,
            default: 'light',
            validator(value) {
                return !value || TAG_EFFECT.indexOf(value) !== -1;
            },
        },
    },
    emits: ['close', 'click'],
    setup(props, ctx) {
        useTheme();
        const { type, size, effect } = props;

        const { isHover, mouseCloseOver, mouseCloseLeave } = useHover();

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
        const handleClose = (event) => {
            ctx.emit('close', event);
        };

        const handleClick = (event) => {
            ctx.emit('click', event);
        };

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
