import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Checkbox from './checkbox.vue';

export { checkboxProps } from './props';
export type { CheckboxProps } from './props';

type CheckboxType = SFCWithInstall<typeof Checkbox>;
export const FCheckbox = withInstall<CheckboxType>(Checkbox as CheckboxType);

export default FCheckbox;
