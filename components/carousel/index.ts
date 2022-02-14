import { withInstall, withNoopInstall } from '../_util/withInstall';
import Carousel from './carousel';
import CarouselItem from './carousel-item';

import type { SFCWithInstall } from '../_util/interface';

type CarouselType = SFCWithInstall<typeof Carousel>;
type CarouselItemType = SFCWithInstall<typeof CarouselItem>;

export const FCarousel = withInstall<CarouselType>(Carousel as CarouselType, {
    CarouselItem,
});
export const FCarouselItem = withNoopInstall<CarouselItemType>(
    CarouselItem as CarouselItemType,
);

export default FCarousel;
