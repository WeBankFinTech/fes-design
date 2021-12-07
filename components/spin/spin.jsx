import {
    defineComponent, computed, ref, watch, onBeforeUnmount,
} from 'vue';
import LoadingOutlined from '../icon/LoadingOutlined';
import getPrefixCls from '../_util/getPrefixCls';

const prefixCls = getPrefixCls('spin');

export default defineComponent({
    name: 'FSpin',
    props: {
        size: {
            type: String,
            default: 'middle',
            validator(value) {
                return ['small', 'middle', 'large'].includes(value);
            },
        },
        description: {
            type: String,
        },
        stroke: {
            type: String,
        },
        delay: {
            type: Number,
            default: 0,
        },
        show: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, { slots }) {
        const isShow = ref(props.show);

        let showTimer = null;

        function clearTimers() {
            clearTimeout(showTimer);
        }
        const hide = () => {
            isShow.value = false;
        };
        const show = () => {
            if (props.delay) {
                showTimer = window.setTimeout(() => {
                    isShow.value = true;
                }, props.delay);
            } else {
                isShow.value = true;
            }
        };
        const toggleState = (value) => {
            clearTimers();
            if (!value) {
                hide();
            } else {
                show();
            }
        };

        watch(() => props.show, toggleState);

        onBeforeUnmount(() => {
            clearTimers();
        });

        const style = computed(() => {
            const o = {};
            if (props.stroke) {
                o.color = props.stroke;
            }
            return o;
        });

        const renderIcon = () => slots.icon?.() || <LoadingOutlined />;
        const renderDesc = () => {
            if (!slots.description && !props.description) return null;
            return (
                <span className={`${prefixCls}-description`}>
                    {slots.description?.() || props.description}
                </span>
            );
        };
        const renderSpin = () => (
            <div
                className={`${prefixCls} is-size-${props.size}`}
                style={style.value}
            >
                {renderIcon()}
            </div>
        );
        return () => {
            if (!slots.default) {
                return isShow.value ? renderSpin() : null;
            }
            return (
                <div
                    className={`${prefixCls}-container ${
                        isShow.value ? 'is-spinning' : ''
                    }`}
                >
                    <div className={`${prefixCls}-content`}>
                        {slots.default()}
                    </div>
                    <div className={`${prefixCls}-wrapper`}>
                        {renderSpin()}
                        {renderDesc()}
                    </div>
                </div>
            );
        };
    },
});
