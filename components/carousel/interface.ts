import type { ComponentObjectPropsOptions } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';
import type useCarousel from './useCarousel';

export type Placement = 'top' | 'bottom' | 'left' | 'right';
export type Direction = 'horizontal' | 'vertical' | '';
export type ArrowType = 'hover' | 'always' | 'never';

export interface CarouselInst extends ReturnType<typeof useCarousel> {
    carouselId?: string;
}

export const carouselItemProps = {
    itemkey: {
        type: String,
        default: '',
    },
} as const satisfies ComponentObjectPropsOptions;

export type CarouselItemProps = ExtractPublicPropTypes<
    typeof carouselItemProps
>;

export interface CarouselItemStates {
    hover: boolean;
    active: boolean;
    inStage: boolean;
    animating: boolean;
}

export interface CarouselItemData extends CarouselItemProps {
    uid: number;
    states: CarouselItemStates;
    translateItem: (
        index: number,
        activeIndex: number,
        oldIndex: number | unknown,
    ) => void;
}
