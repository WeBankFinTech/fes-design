import {
    type CSSProperties,
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    isVNode,
    onBeforeMount,
    onBeforeUnmount,
} from 'vue';
import { isNil } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import {
    DESCRIPTIONS_ITEM_DEFAULT_SPAN,
    DESCRIPTIONS_PREFIX_CLASS,
    DESCRIPTIONS_PROVIDE_KEY,
} from './constants';
import { descriptionsItemProps } from './props';

const prefixCls = getPrefixCls('descriptions-item');
const COMPONENT_NAME = 'FDescriptionsItem';

export default defineComponent({
    name: COMPONENT_NAME,
    props: descriptionsItemProps,
    setup(props, { slots }) {
        const { parentProps, addItem, removeItem, items } = inject(
            DESCRIPTIONS_PROVIDE_KEY,
        );

        // register Item component
        const instance = getCurrentInstance();

        onBeforeMount(() => {
            // 父组件结构变动，需相应调整此处查找逻辑
            const parentChildren = instance.parent.subTree.children;
            if (!Array.isArray(parentChildren)) {
                return;
            }

            const bodyVNodeChildren
                = parentChildren
                    .filter(isVNode)
                    .find((c) =>
                        c.props?.class?.includes(
                            `${DESCRIPTIONS_PREFIX_CLASS}-body`,
                        ),
                    )?.children ?? [];
            if (
                !Array.isArray(bodyVNodeChildren)
                || !isVNode(bodyVNodeChildren[0])
                || !Array.isArray(bodyVNodeChildren[0].children)
            ) {
                return;
            }
            const index = bodyVNodeChildren[0].children.findIndex(
                (itemVNode) => {
                    if (!isVNode(itemVNode)) {
                        return false;
                    }
                    return itemVNode.component?.uid === instance.uid;
                },
            );
            if (index === -1) {
                return;
            }

            addItem({
                id: instance.uid,
                index,
                props,
                slots,
            });
        });

        onBeforeUnmount(() => {
            removeItem(instance.uid);
        });

        const isLastItem = computed<boolean>(
            () => items.value[items.value.length - 1]?.id === instance.uid,
        );

        const span = computed<number>(() => {
            let span: number;

            const column = parentProps.value.column;
            if (isLastItem.value) {
                if (isNil(props.span)) {
                    const restItemsSpanSum = items.value.reduce(
                        (sum, { props }, index) => {
                            if (index === items.value.length - 1) {
                                return sum;
                            }
                            return (
                                sum
                                + (props.span ?? DESCRIPTIONS_ITEM_DEFAULT_SPAN)
                            );
                        },
                        0,
                    );
                    let resultSpanSum;
                    if (restItemsSpanSum % column === 0) {
                        resultSpanSum
                            = (restItemsSpanSum / column + 1) * column;
                    } else {
                        resultSpanSum
                            = Math.ceil(restItemsSpanSum / column) * column;
                    }
                    span = resultSpanSum - restItemsSpanSum;
                } else {
                    span = props.span;
                }
            } else {
                span = props.span ?? DESCRIPTIONS_ITEM_DEFAULT_SPAN;
            }

            if (span > column) {
                span = column;
            }

            return span;
        });

        const style = computed<CSSProperties>(() => {
            const flexDirection
                = parentProps.value.labelPlacement === 'left' ? 'row' : 'column';

            return {
                'display': 'flex',
                'flex-direction': flexDirection,
                'grid-column-start': `span ${span.value}`,
            };
        });
        const innerLabelStyle = computed(() => {
            let appendStyle: CSSProperties = {
                textAlign: parentProps.value.labelAlign,
            };
            if (
                parentProps.value.bordered
                && parentProps.value.labelPlacement === 'left'
            ) {
                appendStyle = {
                    ...appendStyle,
                    flexBasis: `${(1 / (span.value * 2)) * 100}%`,
                };
            }

            return [
                parentProps.value.labelStyle,
                props.labelStyle,
                appendStyle,
            ].filter(Boolean);
        });
        const innerContentStyle = computed(() => {
            let appendStyle: CSSProperties = {};
            if (
                parentProps.value.bordered
                && parentProps.value.labelPlacement === 'left'
            ) {
                appendStyle = {
                    ...appendStyle,
                    flexBasis: `${100 - (1 / (span.value * 2)) * 100}%`,
                };
            }

            return [
                parentProps.value.contentStyle,
                props.contentStyle,
                appendStyle,
            ].filter(Boolean);
        });

        const renderLabel = () => {
            if (slots.label) {
                return slots.label();
            }
            if (props.label) {
                return props.label;
            }
            return null;
        };

        const renderSeparator = () => {
            if (
                parentProps.value.labelPlacement === 'left'
                && !parentProps.value.bordered
            ) {
                return (
                    <span class={`${prefixCls}-separator`}>
                        {parentProps.value.separator}
                    </span>
                );
            }
            return null;
        };

        return () => {
            return (
                <div style={style.value}>
                    <label
                        class={[
                            `${prefixCls}-label`,
                            parentProps.value.labelPlacement === 'top'
                            && 'is-top',
                            parentProps.value.bordered && 'is-bordered',
                        ]}
                        style={innerLabelStyle.value}
                    >
                        {renderLabel()}
                    </label>
                    {renderSeparator()}
                    <span
                        class={[
                            `${prefixCls}-content`,
                            parentProps.value.bordered && 'is-bordered',
                        ]}
                        style={innerContentStyle.value}
                    >
                        {slots.default?.()}
                    </span>
                </div>
            );
        };
    },
});
