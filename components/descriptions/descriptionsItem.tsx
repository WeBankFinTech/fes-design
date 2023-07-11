import {
    defineComponent,
    inject,
    computed,
    PropType,
    CSSProperties,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { DESCRIPTIONS_PROVIDE_KEY } from './constants';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('descriptions-item');

export const descriptionsItemProps = {
    contentStyle: [Object, String] as PropType<CSSProperties | string>,
    label: String,
    labelStyle: [Object, String] as PropType<CSSProperties | string>,
    span: {
        type: Number,
        default: 1,
    },
} as const;

export type DescriptionsItemProps = ExtractPublicPropTypes<
    typeof descriptionsItemProps
>;

export default defineComponent({
    name: 'FDescriptionsItem',
    props: descriptionsItemProps,
    setup(props, { slots }) {
        const { parentProps } = inject(DESCRIPTIONS_PROVIDE_KEY);
        const style = computed<CSSProperties>(() => {
            return {
                display: 'flex',
                'flex-direction':
                    parentProps.value.labelPlacement === 'left'
                        ? 'row'
                        : 'column',
                'grid-column-start': `span ${
                    props.span <= parentProps.value.column
                        ? props.span
                        : parentProps.value.column
                }`,
            };
        });
        const innerContentStyle = computed(() => {
            return [parentProps.value.contentStyle, props.contentStyle].filter(
                Boolean,
            );
        });
        const innerLabelStyle = computed(() => {
            return [
                parentProps.value.labelStyle,
                props.labelStyle,
                {
                    textAlign: parentProps.value.labelAlign,
                },
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
                parentProps.value.labelPlacement === 'left' &&
                !parentProps.value.bordered
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
                            parentProps.value.labelPlacement === 'top' &&
                                'is-top',
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
