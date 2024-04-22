import type { ComponentObjectPropsOptions } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const sliderProps = {

} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type SliderProps = ExtractPublicPropTypes<typeof sliderProps>;
