import {
    defineComponent,
    provide,
    computed,
    PropType,
    CSSProperties,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import {
    DESCRIPTIONS_PROVIDE_KEY,
    LabelAlign,
    LabelPlacement,
} from './constants';

const prefixCls = getPrefixCls('descriptions');

const descriptionsProps = {
    column: {
        type: Number,
        default: 3,
    },
    contentStyle: [Object, String] as PropType<CSSProperties | string>,
    labelAlign: {
        type: String as PropType<LabelAlign>,
        default: 'left',
    },
    labelPlacement: {
        type: String as PropType<LabelPlacement>,
        default: 'left',
    },
    labelStyle: [Object, String] as PropType<CSSProperties | string>,
    separator: {
        type: String,
        default: ':',
    },
    title: String,
} as const;

export default defineComponent({
    name: 'FDescriptions',
    props: descriptionsProps,
    setup(props, { slots }) {
        const style = computed(() => ({
            'grid-template-columns': `repeat(${props.column}, ${props.column}fr)`,
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
                    contentStyle: props.contentStyle,
                    labelAlign: props.labelAlign,
                    labelPlacement: props.labelPlacement,
                    labelStyle: props.labelStyle,
                    separator: props.separator,
                };
            }),
        });

        return () => {
            return (
                <div>
                    {renderHeader()}
                    <div class={`${prefixCls}-body`} style={style.value}>
                        {slots.default()}
                    </div>
                </div>
            );
        };
    },
});
