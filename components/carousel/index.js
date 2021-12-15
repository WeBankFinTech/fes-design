import { withInstall, withNoopInstall } from '../_util/withInstall';
import Carousel from './carousel';
import CarouselItem from './carousel-item';

export const FCarousel = withInstall(Carousel, { CarouselItem });
export const FCarouselItem = withNoopInstall(CarouselItem);

export default FCarousel;
