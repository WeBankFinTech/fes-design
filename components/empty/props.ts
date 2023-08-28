import type { PropType, StyleValue } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const emptyProps = {
    /**
     * @description image URL of empty
     */
    imageSrc: {
        type: String,
        default: '',
    },
    /**
     * @description image style of empty
     */
    imageStyle: {
        type: [Object, Array, String] as PropType<StyleValue>,
        default: () => ({}),
    },
    /**
     * @description description of empty
     */
    description: {
        type: String,
        default: '',
    },
} as const;

export type EmptyProps = ExtractPublicPropTypes<typeof emptyProps>;
