import { defineComponent, computed, ref } from 'vue';
import LoadingOutlined from '../icon/LoadingOutlined';
import getPrefixCls from '../_util/getPrefixCls';

const prefixCls = getPrefixCls('btn');

const loadingIconClassName = `${prefixCls}-loading-icon`;
const BUTTON_TYPE = [
    'default',
    'primary',
    'link',
    'text',
    'info',
    'success',
    'warning',
    'danger',
];

export default defineComponent({
    name: 'FButton',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        htmlType: {
            type: String,
            default: 'button',
        },
        size: {
            type: String,
            default: 'middle',
            validator(value) {
                return ['small', 'middle', 'large'].includes(value);
            },
        },
        loading: {
            type: Boolean,
            default: false,
        },
        long: {
            type: Boolean,
            default: false,
        },
        throttle: {
            type: Number,
            default: 300,
        },
        type: {
            type: String,
            default: 'default',
            validator(value) {
                return BUTTON_TYPE.includes(value);
            },
        },
    },
    emits: ['click'],
    setup(props, { slots, emit }) {
        const notAllowed = ref(false);
        const handleClick = (event) => {
            if (notAllowed.value || props.disabled) return;
            notAllowed.value = true;
            setTimeout(() => {
                notAllowed.value = false;
            }, props.throttle);
            emit('click', event);
        };

        const classes = computed(() => ({
            [prefixCls]: true,
            [`${prefixCls}-type-${props.type}`]: props.type,
            [`${prefixCls}-long`]: props.long,
            [`${prefixCls}-${props.size}`]: props.size !== 'middle',
            'is-loading': props.loading || notAllowed.value,
        }));

        return () => (
            <button
                type={props.htmlType}
                disabled={props.disabled}
                class={classes.value}
                onClick={handleClick}
            >
                {props.loading ? (
                    <LoadingOutlined class={loadingIconClassName} />
                ) : (
                    slots.icon?.()
                )}
                {slots.default?.()}
            </button>
        );
    },
});
