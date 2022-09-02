import {
    defineComponent,
    inject,
    computed,
    PropType,
    CSSProperties,
    Fragment,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { DESCRIPTIONS_PROVIDE_KEY } from './constants';

const prefixCls = getPrefixCls('descriptions-item');

const DescriptionsItemProps = {
    contentStyle: [Object, String] as PropType<CSSProperties | string>,
    label: String,
    labelStyle: [Object, String] as PropType<CSSProperties | string>,
    span: {
        type: Number,
        default: 1,
    },
} as const;

export default defineComponent({
    name: 'FDescriptionsItem',
    props: DescriptionsItemProps,
    setup(props, { slots }) {
        const { parentProps } = inject(DESCRIPTIONS_PROVIDE_KEY);
        const style = computed(() => {
            return {
                display: 'flex',
                alignItems:
                    parentProps.value.labelPlacement === 'left'
                        ? 'center'
                        : 'flex-start',
                'flex-direction':
                    parentProps.value.labelPlacement === 'left'
                        ? 'row'
                        : 'column',
                'grid-column-start': `span ${props.span}`,
            } as CSSProperties;
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
            if (parentProps.value.labelPlacement === 'left') {
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
                    <span
                        class={`${prefixCls}-label`}
                        style={innerLabelStyle.value}
                    >
                        {renderLabel()}
                        {renderSeparator()}
                    </span>
                    <span
                        class={`${prefixCls}-content`}
                        style={innerContentStyle.value}
                    >
                        {slots.default()}
                    </span>
                </div>
            );
        };
    },
});
