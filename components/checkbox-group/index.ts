import { withInstall } from '../_util/withInstall';
import CheckboxGroup from './checkbox-group.vue';

import type { SFCWithInstall } from '../_util/interface';

export { checkboxGroupProps } from './const';
export type { CheckboxGroupProps } from './const';

type CheckboxGroupType = SFCWithInstall<typeof CheckboxGroup>;
export const FCheckboxGroup = withInstall<CheckboxGroupType>(
    CheckboxGroup as CheckboxGroupType,
);

export default FCheckboxGroup;
