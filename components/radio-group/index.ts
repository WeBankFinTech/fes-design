import { withInstall } from '../_util/withInstall';
import RadioGroup from './radio-group.vue';

import type { SFCWithInstall } from '../_util/interface';

type RadioGroupType = SFCWithInstall<typeof RadioGroup>;

export { radioGroupProps } from './props';
export type { RadioGroupProps } from './props';
export const FRadioGroup = withInstall<RadioGroupType>(
    RadioGroup as RadioGroupType,
);

export default FRadioGroup;
