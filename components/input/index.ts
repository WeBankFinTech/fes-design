import { withInstall } from '../_util/withInstall';
import Input from './input.vue';

import type { SFCWithInstall } from '../_util/interface';

type InputType = SFCWithInstall<typeof Input>;

export { inputProps } from './input.vue';
export type { InputProps } from './input.vue';
export const FInput = withInstall<InputType>(Input as InputType);

export default FInput;
