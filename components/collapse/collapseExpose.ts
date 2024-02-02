import { type ComponentObjectPropsOptions } from 'vue';
import { definePropType } from './common';
import type { CollapseActiveName } from './common';
import type { ExtractPublicPropTypes } from '../_util/interface';

type Arrayable<T> = T | T[];

export type CollapseModelValue = Arrayable<CollapseActiveName>;
export type Mutable<T> = { -readonly [P in keyof T]: T[P] }; // 移除只读特性

export const collapseProps = {
    accordion: Boolean,
    arrow: {
        type: String,
        default: 'right', // 'left', 'right', 默认right
    },
    modelValue: {
        type: definePropType<CollapseModelValue>([Array, String, Number]),
    },
    embedded: {
        type: Boolean,
        default: true,
    },
} as const satisfies ComponentObjectPropsOptions;

export type CollapseProps = ExtractPublicPropTypes<typeof collapseProps>;
