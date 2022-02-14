import { withInstall } from '../_util/withInstall';
import InputNumber from './input-number.vue';

import type { SFCWithInstall } from '../_util/interface';

type InputNumberType = SFCWithInstall<typeof InputNumber>;
export const FInputNumber = withInstall<InputNumberType>(
    InputNumber as InputNumberType,
);

export default FInputNumber;
