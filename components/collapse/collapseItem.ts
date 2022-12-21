import type { ExtractPropTypes } from 'vue';
import { definePropType, generateId, CollapseActiveName } from './common';

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
};
export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>;
