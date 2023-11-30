import { isNumber, isString } from 'lodash-es';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import { definePropType } from './common';
import type { CollapseActiveName } from './common';
import type { ExtractPublicPropTypes } from '../_util/interface';

type Arrayable<T> = T | T[];

export type CollapseModelValue = Arrayable<CollapseActiveName>;
export type Mutable<T> = { -readonly [P in keyof T]: T[P] }; // 移除只读特性

export const emitChangeFn = (value: CollapseModelValue) =>
    typeof isNumber(value) || isString(value) || Array.isArray(value);

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
} as const;

export type CollapseProps = ExtractPublicPropTypes<typeof collapseProps>;

export const collapseEmits = {
    [UPDATE_MODEL_EVENT]: emitChangeFn,
    [CHANGE_EVENT]: emitChangeFn,
};
export type CollapseEmits = typeof collapseEmits;
