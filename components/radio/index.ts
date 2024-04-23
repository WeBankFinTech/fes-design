import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Radio from './radio.vue';

type RadioType = SFCWithInstall<typeof Radio>;

export { radioProps } from './props';
export type { RadioProps } from './props';
export const FRadio = withInstall<RadioType>(Radio as RadioType);

export default FRadio;
