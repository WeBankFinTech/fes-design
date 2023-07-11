import {
    defineComponent,
    provide,
    computed,
    PropType,
    CSSProperties,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { DESCRIPTIONS_PROVIDE_KEY } from './constants';
import type { LabelAlign, LabelPlacement } from './constants';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('descriptions');

export const descriptionsProps = {
    column: {
        type: Number,
        default: 3,
    },
    contentStyle: [Object, String] as PropType<CSSProperties | string>,
    labelAlign: {
        type: String as PropType<LabelAlign>,
        default: 'left',
        validator(value: string) {
            return ['left', 'right', 'center'].includes(value);
        },
    },
    labelPlacement: {
        type: String as PropType<LabelPlacement>,
        default: 'left',
        validator(value: string) {
            return ['left', 'top'].includes(value);
        },
    },
    labelStyle: [Object, String] as PropType<CSSProperties | string>,
    separator: {
        type: String,
        default: ':',
    },
    title: String,
    bordered: Boolean,
} as const;

export type DescriptionsProps = ExtractPublicPropTypes<
    typeof descriptionsProps
>;

export default defineComponent({
    name: 'FDescriptions',
    props: descriptionsProps,
    setup(props, { slots }) {
        const style = computed(() => ({
            'grid-template-columns': `repeat(${props.column}, 1fr)`,
        }));

        const renderHeader = () => {
            if (slots.header) {
                return slots.header();
            }
            if (props.title) {
                return <div class={`${prefixCls}-header`}>{props.title}</div>;
            }
            return null;
        };

        provide(DESCRIPTIONS_PROVIDE_KEY, {
            parentProps: computed(() => {
                return {
                    column: props.column,
                    contentStyle: props.contentStyle,
                    labelAlign: props.labelAlign,
                    labelPlacement: props.labelPlacement,
                    labelStyle: props.labelStyle,
                    separator: props.separator,
                    bordered: props.bordered,
                };
            }),
        });

        return () => {
            return (
                <div class={prefixCls}>
                    {renderHeader()}
                    <div
                        class={[
                            `${prefixCls}-body`,
                            props.bordered && 'is-bordered',
                        ]}
                        style={style.value}
                    >
                        {slots.default?.()}
                    </div>
                </div>
            );
        };
    },
});
