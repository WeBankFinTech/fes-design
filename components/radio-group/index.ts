import { withInstall } from '../_util/withInstall';
import RadioGroup from './radio-group.vue';

import type { SFCWithInstall } from '../_util/interface';

type RadioGroupType = SFCWithInstall<typeof RadioGroup>;

export { radioGroupProps } from './const';
export type { RadioGroupProps } from './const';
export const FRadioGroup = withInstall<RadioGroupType>(
    RadioGroup as RadioGroupType,
);

export default FRadioGroup;
