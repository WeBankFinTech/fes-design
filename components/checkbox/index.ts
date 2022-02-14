import { withInstall } from '../_util/withInstall';
import Checkbox from './checkbox.vue';

import type { SFCWithInstall } from '../_util/interface';

type CheckboxType = SFCWithInstall<typeof Checkbox>;
export const FCheckbox = withInstall<CheckboxType>(Checkbox as CheckboxType);

export default FCheckbox;
