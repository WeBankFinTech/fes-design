import {
    defineComponent,
    computed,
    ref,
    PropType,
    CSSProperties,
    ExtractPropTypes,
} from 'vue';
import { isObject } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import Tooltip from '../tooltip';
import type { ToolTipProps } from '../tooltip';
import { useTheme } from '../_theme/useTheme';

const prefixCls = getPrefixCls('ellipsis');

const ellipsisProps = {
    content: String,
    line: {
        type: [Number, String] as PropType<number | string>,
        default: 1,
    },
    tooltip: {
        type: [Boolean, Object] as PropType<boolean | ToolTipProps>,
        default: {
            showAfter: 500,
        },
    },
    class: [String, Array, Object] as PropType<string | object | []>,
    style: {
        type: [String, Array, Object] as PropType<string | CSSProperties>,
        default() {
            return {};
        },
    },
} as const;

export type EllipsisProps = ExtractPropTypes<typeof ellipsisProps>;

export default defineComponent({
    name: 'FEllipsis',
    components: {
        Tooltip,
    },
    props: ellipsisProps,
    setup(props, { slots }) {
        useTheme();

        const triggerRef = ref<HTMLElement>();

        const classListRef = computed(() =>
            [prefixCls, props.class].filter(Boolean),
        );

        const styleRef = computed(() => {
            const ellStyle =
                props.line > 1
                    ? {
                          display: '-webkit-inline-box',
                          '-webkit-line-clamp': props.line,
                          '-webkit-box-orient': 'vertical',
                      }
                    : { 'text-overflow': 'ellipsis', 'white-space': 'nowrap' };
            return [props.style, ellStyle];
        });

        const toolTipPropsRef = computed(() => {
            if (isObject(props.tooltip)) {
                return props.tooltip;
            }
            return {};
        });

        // 元素可能是隐藏的，当hover时需要重新计算下
        const getDisabled = () => {
            let isEllipsis = true;
            const { value: trigger } = triggerRef;
            if (!trigger) return true;
            const { offsetHeight, scrollHeight, scrollWidth, offsetWidth } =
                trigger;
            if (offsetHeight && offsetWidth) {
                if (props.line > 1) {
                    isEllipsis = scrollHeight > offsetHeight;
                } else {
                    isEllipsis = scrollWidth > offsetWidth;
                }
            }
            return !isEllipsis;
        };

        const renderTrigger = () => (
            <span
                ref={triggerRef}
                class={classListRef.value}
                style={styleRef.value}
            >
                {slots.default?.() ?? props.content}
            </span>
        );

        const renderContent = () => {
            return props.content;
        };

        return () => {
            if (!props.tooltip) {
                return renderTrigger();
            }
            return (
                <Tooltip
                    placement="top"
                    disabled={getDisabled}
                    {...toolTipPropsRef.value}
                    v-slots={{
                        content:
                            slots.tooltip ?? slots.default ?? renderContent,
                    }}
                >
                    {renderTrigger()}
                </Tooltip>
            );
        };
    },
});
