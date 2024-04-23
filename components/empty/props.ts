import type { ComponentObjectPropsOptions, PropType, StyleValue } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const emptyProps = {
    // image URL of empty
    imageSrc: {
        type: String,
        default: '',
    },
    // image style of empty
    imageStyle: {
        type: [Object, Array, String] as PropType<StyleValue>,
        default: () => ({}),
    },
    // description of empty
    description: {
        type: String,
        default: '',
    },
} as const satisfies ComponentObjectPropsOptions;

export type EmptyProps = ExtractPublicPropTypes<typeof emptyProps>;
