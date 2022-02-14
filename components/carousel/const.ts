import type { InjectionKey } from 'vue';
import type { CarouselInst } from './interface';

export const CAROUSEL_NAME = 'FCarousel';
export const CAROUSEL_ITEM_NAME = 'FCarouselItem';

export const provideKey: InjectionKey<CarouselInst> = Symbol(CAROUSEL_NAME);

export const CHANGE_EVENT = 'change';
export const CARD_SCALE = 0.83;
