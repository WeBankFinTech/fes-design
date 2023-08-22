import type { ExtractPublicPropTypes } from '../_util/interface';

type RequiredByKeys<T, K> = Omit<T & Required<Pick<T, K & keyof T>>, never>;

/**
 * NOTE: 下面部分仅为测试用，经 review 后再合入 _util/interface
 */

type ComponentRequiredProps<
    CompProps,
    Prop extends keyof CompProps = keyof CompProps,
> = Prop extends Prop // 仅触发联合类型 extends 分配率
    ? CompProps[Prop] extends { required: true }
        ? Prop
        : never
    : never;

type ComponentDefaultProps<
    CompProps,
    Prop extends keyof CompProps = keyof CompProps,
> = Prop extends Prop // 仅触发联合类型 extends 分配率
    ? CompProps[Prop] extends { default: any }
        ? Prop
        : never
    : never;

// 提取正确的 Props 类型：required: true 的时候，类型为必填
export type ComponentProps<CP> = RequiredByKeys<
    ExtractPublicPropTypes<CP>,
    ComponentRequiredProps<CP>
>;

// 组件内部消费的正确 Props 类型：有 required 和 default 字段，则为必填
export type ComponentInnerProps<CP> = RequiredByKeys<
    ExtractPublicPropTypes<CP>,
    ComponentRequiredProps<CP> | ComponentDefaultProps<CP>
>;
