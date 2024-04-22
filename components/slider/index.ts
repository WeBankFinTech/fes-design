import type { SFCWithInstall } from '../_util/interface';
import { withInstall } from '../_util/withInstall';
import { Slider } from './slider';

export { sliderProps } from './props';
export type { SliderProps } from './props';

type SliderType = SFCWithInstall<typeof Slider>;

export const FSlider = withInstall<SliderType>(Slider as SliderType);
export default FSlider;
