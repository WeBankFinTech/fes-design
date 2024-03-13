import { withInstall } from '../_util/withInstall';
import Checkbox from './checkbox.vue';

import type { SFCWithInstall } from '../_util/interface';

export { checkboxProps } from './props';
export type { CheckboxProps } from './props';

type CheckboxType = SFCWithInstall<typeof Checkbox>;
export const FCheckbox = withInstall<CheckboxType>(Checkbox as CheckboxType);

export default FCheckbox;
