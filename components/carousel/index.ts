import { withInstall, withNoopInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Carousel from './carousel';
import CarouselItem from './carousel-item';

type CarouselType = SFCWithInstall<typeof Carousel>;
type CarouselItemType = SFCWithInstall<typeof CarouselItem>;

export { carouselProps } from './carousel';
export type { CarouselProps } from './carousel';

export const FCarousel = withInstall<CarouselType>(Carousel as CarouselType, {
    CarouselItem,
});

export { carouselItemProps } from './interface';
export type { CarouselItemProps } from './interface';
export const FCarouselItem = withNoopInstall<CarouselItemType>(
    CarouselItem as CarouselItemType,
);

export default FCarousel;
