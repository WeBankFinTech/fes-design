import { isNumber, isString } from 'lodash-es';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import type { ExtractPropTypes } from 'vue';
import { definePropType } from './common';

type Arrayable<T> = T | T[];

export type CollapseActiveName = string | number;
export type CollapseModelValue = Arrayable<CollapseActiveName>;
export type Mutable<T> = { -readonly [P in keyof T]: T[P] }; // 移除只读特性

const mutable = <T extends readonly any[] | Record<string, unknown>>(val: T) =>
    val as Mutable<typeof val>;

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
        default: () => mutable([] as const), // 常量
    },
};
export type CollapseProps = ExtractPropTypes<typeof collapseProps>; // todo

export const collapseEmits = {
    [UPDATE_MODEL_EVENT]: emitChangeFn,
    [CHANGE_EVENT]: emitChangeFn,
};
export type CollapseEmits = typeof collapseEmits;
