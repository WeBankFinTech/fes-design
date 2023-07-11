import {
    defineComponent,
    computed,
    ref,
    watch,
    onBeforeUnmount,
    PropType,
    CSSProperties,
} from 'vue';
import LoadingOutlined from '../icon/LoadingOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('spin');

type SpinSize = 'small' | 'middle' | 'large';

export const spinProps = {
    size: {
        type: String as PropType<SpinSize>,
        default: 'middle',
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
} as const;

export type SpinProps = ExtractPublicPropTypes<typeof spinProps>;

export default defineComponent({
    name: 'FSpin',
    props: spinProps,
    setup(props, { slots }) {
        useTheme();
        const isShow = ref(props.show);

        let showTimer: ReturnType<typeof setTimeout>;

        function clearTimers() {
            clearTimeout(showTimer);
        }
        const hide = () => {
            isShow.value = false;
        };
        const show = () => {
            if (props.delay) {
                showTimer = setTimeout(() => {
                    isShow.value = true;
                }, props.delay);
            } else {
                isShow.value = true;
            }
        };
        const toggleState = (value: boolean) => {
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
            const o: CSSProperties = {};
            if (props.stroke) {
                o.color = props.stroke;
            }
            return o;
        });

        const renderIcon = () => slots.icon?.() || <LoadingOutlined />;
        const renderDesc = () => {
            if (!slots.description && !props.description) return null;
            return (
                <span class={`${prefixCls}-description`}>
                    {slots.description?.() || props.description}
                </span>
            );
        };
        const renderSpin = () => (
            <div
                class={`${prefixCls} is-size-${props.size}`}
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
                    class={`${prefixCls}-container ${
                        isShow.value ? 'is-spinning' : ''
                    }`}
                >
                    <div class={`${prefixCls}-content`}>
                        {slots.default?.()}
                    </div>
                    <div class={`${prefixCls}-wrapper`}>
                        {renderSpin()}
                        {renderDesc()}
                    </div>
                </div>
            );
        };
    },
});
