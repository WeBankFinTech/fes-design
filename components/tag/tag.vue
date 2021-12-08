<template>
    <div
        :class="classes"
        :style="{ backgroundColor }"
        @click="handleClick"
    >
        <template v-if="$slots.icon">
            <slot name="icon"></slot>
        </template>
        <slot></slot>
        <CloseOutlined v-if="closable" :class="`${prefixCls}__close`" @click.stop="handleClose" />
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import CloseOutlined from '../icon/CloseOutlined';

const prefixCls = getPrefixCls('tag');

const TAG_TYPE = ['default', 'success', 'info', 'warning', 'danger'];
const TAG_SIZE = ['small', 'middle', 'large'];
const TAG_EFFECT = ['dark', 'light', 'plain'];


export default defineComponent({
    name: 'FTag',
    components: { CloseOutlined },
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
        };
    },
});
</script>
