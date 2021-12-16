import { defineComponent, computed, ref, onMounted } from 'vue';
import { isObject } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import Tooltip from '../tooltip';

const prefixCls = getPrefixCls('ellipsis');

export default defineComponent({
    name: 'FEllipsis',
    components: {
        Tooltip,
    },
    props: {
        line: {
            type: [Number, String],
            default: 1,
        },
        tooltip: {
            type: [Boolean, Object],
            default: {
                showAfter: 500,
            },
        },
        triggerClass: {
            type: String,
        },
        style: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    setup(props, { slots }) {
        const triggerRef = ref(null);
        const overflowVisible = ref(false);
        const classList = computed(() =>
            [prefixCls, props.triggerClass, props.line > 1 && 'is-line-clamp']
                .filter(Boolean)
                .join(' '),
        );
        const style = computed(() => {
            const _style = props.style;
            if (props.line > 1) {
                _style['-webkit-line-clamp'] = props.line;
            }
            return _style;
        });
        const tooltipDisabled = computed(
            () => overflowVisible.value || props.tooltip === false,
        );
        // 元素可能是隐藏的，当hover时需要重新计算下
        const handleDisabled = () => {
            const { value: trigger } = triggerRef;
            if (props.line > 1) {
                overflowVisible.value =
                    trigger.scrollHeight <= trigger.offsetHeight;
            } else {
                overflowVisible.value =
                    trigger.scrollWidth <= trigger.offsetWidth;
            }
        };
        onMounted(handleDisabled);
        const toolTipSlots = () => ({
            content: slots.default,
        });
        const toolTipProps = computed(() => {
            if (isObject(props.tooltip)) {
                return props.tooltip;
            }
            return {};
        });
        const renderTrigger = () => (
            <span
                ref={triggerRef}
                className={classList.value}
                style={style.value}
                onMouseenter={handleDisabled}
            >
                {slots.default?.()}
            </span>
        );
        return () => {
            if (tooltipDisabled.value) {
                return renderTrigger();
            }
            return (
                <Tooltip
                    placement="top"
                    {...toolTipProps.value}
                    v-slots={toolTipSlots()}
                >
                    {renderTrigger()}
                </Tooltip>
            );
        };
    },
});
