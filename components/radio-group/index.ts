import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import RadioGroup from './radio-group.vue';

type RadioGroupType = SFCWithInstall<typeof RadioGroup>;

export { radioGroupProps } from './props';
export type { RadioGroupProps } from './props';
export const FRadioGroup = withInstall<RadioGroupType>(
    RadioGroup as RadioGroupType,
);

export default FRadioGroup;
