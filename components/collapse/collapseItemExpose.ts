import { definePropType, generateId } from './common';
import type { CollapseActiveName } from './common';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const collapseItemProps = {
    title: {
        type: String,
        default: '',
    },
    name: {
        type: definePropType<CollapseActiveName>([String, Number]),
        default: () => generateId(),
    },
    disabled: Boolean,
} as const;
export type CollapseItemProps = ExtractPublicPropTypes<
    typeof collapseItemProps
>;
