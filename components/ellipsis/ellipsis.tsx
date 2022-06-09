import {
    defineComponent,
    computed,
    ref,
    PropType,
    CSSProperties,
    watch,
    onMounted,
    nextTick,
} from 'vue';
import { isObject } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import Tooltip from '../tooltip/tooltip';
import { useTheme } from '../_theme/useTheme';

const prefixCls = getPrefixCls('ellipsis');

const ellipsisProps = {
    content: String,
    line: {
        type: [Number, String] as PropType<number | string>,
        default: 1,
    },
    tooltip: {
        type: [Boolean, Object] as PropType<boolean | object>,
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

export default defineComponent({
    name: 'FEllipsis',
    components: {
        Tooltip,
    },
    props: ellipsisProps,
    setup(props, { slots }) {
        useTheme();
        const triggerRef = ref<HTMLElement>();
        const isEllipsisRef = ref(true);
        const classListRef = computed(() =>
            [prefixCls, props.class, props.line > 1 && 'is-line-clamp'].filter(
                Boolean,
            ),
        );

        const triggerEllipsisStyleRef = computed(() => {
            return props.line > 1
                ? { '-webkit-line-clamp': props.line }
                : { 'text-overflow': 'ellipsis', 'white-space': 'nowrap' };
        });

        const isTooltipDisabledRef = computed(
            () => !isEllipsisRef.value || props.tooltip === false,
        );

        const toolTipPropsRef = computed(() => {
            if (isObject(props.tooltip)) {
                return props.tooltip;
            }
            return {};
        });

        // 元素可能是隐藏的，当hover时需要重新计算下
        const computeStyle = () => {
            const { value: trigger } = triggerRef;
            if (!trigger) return;
            const ellStyle = triggerEllipsisStyleRef.value;
            Object.assign(trigger.style, ellStyle);
            const { offsetHeight, scrollHeight, scrollWidth, offsetWidth } =
                trigger;
            if (offsetHeight && offsetWidth) {
                if (props.line > 1) {
                    isEllipsisRef.value = scrollHeight > offsetHeight;
                } else {
                    isEllipsisRef.value = scrollWidth > offsetWidth;
                }
            }
            if (!isEllipsisRef.value) {
                for (const key in ellStyle) {
                    (trigger.style as any)[key] = null;
                }
            }
        };

        watch([() => props.line, () => props.content], () => {
            isEllipsisRef.value = true;
            nextTick(computeStyle);
        });

        onMounted(() => {
            isEllipsisRef.value = true;
            nextTick(computeStyle);
        });

        const renderTrigger = () => (
            <span
                ref={triggerRef}
                class={classListRef.value}
                style={props.style}
                onMouseenter={computeStyle}
            >
                {slots.default?.() ?? props.content}
            </span>
        );

        const renderContent = () => {
            return props.content;
        };

        return () => {
            if (isTooltipDisabledRef.value) {
                return renderTrigger();
            }
            return (
                <Tooltip
                    placement="top"
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
