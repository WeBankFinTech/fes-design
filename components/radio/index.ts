import { withInstall } from '../_util/withInstall';
import Radio from './radio.vue';

import type { SFCWithInstall } from '../_util/interface';

type RadioType = SFCWithInstall<typeof Radio>;

export { radioProps } from './props';
export type { RadioProps } from './props';
export const FRadio = withInstall<RadioType>(Radio as RadioType);

export default FRadio;
