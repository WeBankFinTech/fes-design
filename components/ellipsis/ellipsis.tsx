import {
    defineComponent,
    computed,
    ref,
    onMounted,
    PropType,
    CSSProperties,
} from 'vue';
import { isObject } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import Tooltip from '../tooltip/tooltip';
import { useTheme } from '../_theme/useTheme';

const prefixCls = getPrefixCls('ellipsis');

const ellipsisProps = {
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
        type: Object as PropType<CSSProperties>,
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
        const noEllipsisRef = ref(false);
        const classListRef = computed(() =>
            [prefixCls, props.class, props.line > 1 && 'is-line-clamp'].filter(
                Boolean,
            ),
        );
        const styleRef = computed(() => {
            return [
                props.style,
                !noEllipsisRef.value && props.line > 1
                    ? { '-webkit-line-clamp': props.line }
                    : { 'text-overflow': 'ellipsis', 'white-space': 'nowrap' },
            ];
        });
        const isTooltipDisabledRef = computed(
            () => noEllipsisRef.value || props.tooltip === false,
        );
        const toolTipPropsRef = computed(() => {
            if (isObject(props.tooltip)) {
                return props.tooltip;
            }
            return {};
        });

        // 元素可能是隐藏的，当hover时需要重新计算下
        const handleDisabled = () => {
            const { value: trigger } = triggerRef;
            if (!trigger) return;
            if (props.line > 1) {
                noEllipsisRef.value =
                    trigger.scrollHeight <= trigger.offsetHeight;
            } else {
                noEllipsisRef.value =
                    trigger.scrollWidth <= trigger.offsetWidth;
            }
        };

        onMounted(handleDisabled);
        const renderTrigger = () => (
            <span
                ref={triggerRef}
                class={classListRef.value}
                style={styleRef.value}
                onMouseenter={handleDisabled}
            >
                {slots.default?.()}
            </span>
        );

        return () => {
            if (isTooltipDisabledRef.value) {
                return renderTrigger();
            }
            return (
                <Tooltip
                    placement="top"
                    {...toolTipPropsRef.value}
                    v-slots={{
                        content: slots.tooltip ?? slots.default,
                    }}
                >
                    {renderTrigger()}
                </Tooltip>
            );
        };
    },
});
