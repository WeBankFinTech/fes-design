import type { ExtractPropTypes } from 'vue';
import type { CollapseActiveName } from './collapse';
import { definePropType, generateId } from './common';

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
