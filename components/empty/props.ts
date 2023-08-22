import type { ExtractPublicPropTypes } from '../_util/interface';

export const emptyProps = {
    /**
     * @description image URL of empty
     */
    image: {
        type: String,
        default: '',
    },
    /**
     * @description image size (width) of empty
     */
    imageSize: Number,
    /**
     * @description description of empty
     */
    description: {
        type: String,
        default: '',
    },
} as const;

export type EmptyProps = ExtractPublicPropTypes<typeof emptyProps>;
