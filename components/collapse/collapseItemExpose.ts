import { definePropType, generateId } from './common';
import type { ExtractPropTypes } from 'vue';
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
};
export type CollapseItemProps = Partial<
    ExtractPropTypes<typeof collapseItemProps>
>;
