import type {
    CSSProperties,
    ComponentObjectPropsOptions,
    PropType,
} from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';
import type { LabelAlign, LabelPlacement } from './interface';

// ----- Description -----

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
} as const satisfies ComponentObjectPropsOptions;

export type DescriptionsProps = ExtractPublicPropTypes<
    typeof descriptionsProps
>;

// ----- Description Item -----

export const descriptionsItemProps = {
    contentStyle: [Object, String] as PropType<CSSProperties | string>,
    label: String,
    labelStyle: [Object, String] as PropType<CSSProperties | string>,
    span: {
        type: Number,
    },
} as const satisfies ComponentObjectPropsOptions;

export type DescriptionsItemProps = ExtractPublicPropTypes<
    typeof descriptionsItemProps
>;
