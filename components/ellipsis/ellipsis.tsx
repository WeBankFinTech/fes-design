import {
    defineComponent,
    computed,
    ref,
    PropType,
    CSSProperties,
    StyleValue,
} from 'vue';
import { isObject } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import Tooltip from '../tooltip';
import { useTheme } from '../_theme/useTheme';
import type { ToolTipProps } from '../tooltip';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('ellipsis');

export const ellipsisProps = {
    content: [Number, String] as PropType<number | string>,
    line: {
        type: [Number, String] as PropType<number | string>,
        default: 1,
    },
    tooltip: {
        type: [Boolean, Object] as PropType<boolean | ToolTipProps>,
        default: () =>
            ({
                showAfter: 500,
            } as ToolTipProps),
    },
    class: [String, Array, Object] as PropType<string | object | []>,
    style: {
        type: [String, Array, Object] as PropType<string | CSSProperties>,
        default() {
            return {};
        },
    },
} as const;

export type EllipsisProps = ExtractPublicPropTypes<typeof ellipsisProps>;

export default defineComponent({
    name: 'FEllipsis',
    components: {
        Tooltip,
    },
    props: ellipsisProps,
    setup(props, { slots }) {
        useTheme();

        const triggerRef = ref<HTMLElement>();

        const triggerInnerRef = ref<HTMLElement>();

        const classListRef = computed(() =>
            [prefixCls, props.class].filter(Boolean),
        );

        const line = computed(() => {
            return Number(props.line);
        });

        const styleRef = computed(() => {
            const ellStyle: StyleValue =
                line.value > 1
                    ? {
                          display: '-webkit-inline-box',
                          '-webkit-line-clamp': line.value,
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
            const { offsetHeight, scrollHeight, offsetWidth } = trigger;
            if (offsetHeight && offsetWidth) {
                if (line.value > 1) {
                    isEllipsis = scrollHeight > offsetHeight;
                } else {
                    const { value: triggerInner } = triggerInnerRef;
                    isEllipsis =
                        triggerInner.getBoundingClientRect().width >
                        trigger.getBoundingClientRect().width;
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
                {line.value > 1 ? (
                    slots.default?.() ?? props.content
                ) : (
                    <span ref={triggerInnerRef}>
                        {slots.default?.() ?? props.content}
                    </span>
                )}
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
