import { isNumber, isString } from 'lodash-es';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
<<<<<<< HEAD:components/collapse/collapseExpose.ts
import type { ExtractPropTypes } from 'vue';
import { definePropType } from './common';
import type { CollapseActiveName } from './common';
=======
import { definePropType, CollapseActiveName } from './common';
import type { ExtractPropTypes } from 'vue';
>>>>>>> d9c5759 (refactor: 处理ts提示):components/collapse/collapse.ts

type Arrayable<T> = T | T[];

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
export type CollapseProps = Partial<ExtractPropTypes<typeof collapseProps>>;

export const collapseEmits = {
    [UPDATE_MODEL_EVENT]: emitChangeFn,
    [CHANGE_EVENT]: emitChangeFn,
};
export type CollapseEmits = typeof collapseEmits;
