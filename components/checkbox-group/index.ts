import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import CheckboxGroup from './checkbox-group.vue';

export { checkboxGroupProps } from './props';
export type { CheckboxGroupProps } from './props';

type CheckboxGroupType = SFCWithInstall<typeof CheckboxGroup>;
export const FCheckboxGroup = withInstall<CheckboxGroupType>(
    CheckboxGroup as CheckboxGroupType,
);

export default FCheckboxGroup;
