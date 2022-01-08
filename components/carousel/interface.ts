import { ToRefs, ExtractPropTypes, Ref } from 'vue';
import useCarousel from './useCarousel';
import useCarouselItem from './useCarouselItem';

export type Placement = 'top' | 'bottom' | 'left' | 'right';
export type Direction = 'horizontal' | 'vertical' | '';

export interface CarouselInst
    extends ReturnType<typeof useCarouselItem>,
        ReturnType<typeof useCarousel> {
    carouselId: string;
}

export const carouselItemProps = {
    key: {
        type: String,
        default: '',
    },
} as const;

export type CarouselItemProps = Partial<
    ExtractPropTypes<typeof carouselItemProps>
>;

export interface CarouselItemStatus {
    hover: Ref<boolean>;
    active: boolean;
    inStage: boolean;
    animating: boolean;
}

export type UnionCarouselItemData = CarouselItemProps &
    ToRefs<CarouselItemStatus>;

export interface CarouselItem extends UnionCarouselItemData {
    uid: number;
    translateItem: (
        index: number,
        activeIndex: number,
        oldIndex: number | unknown,
    ) => void;
}
