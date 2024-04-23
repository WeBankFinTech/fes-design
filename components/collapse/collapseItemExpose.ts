import { type ComponentObjectPropsOptions } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { definePropType, generateId } from './common';
import type { CollapseActiveName } from './common';

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
} as const satisfies ComponentObjectPropsOptions;
export type CollapseItemProps = ExtractPublicPropTypes<
    typeof collapseItemProps
>;
