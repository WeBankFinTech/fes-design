import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import InputNumber from './input-number.vue';

type InputNumberType = SFCWithInstall<typeof InputNumber>;

export { inputNumberProps } from './input-number.vue';
export type { InputNumberProps } from './input-number.vue';

export const FInputNumber = withInstall<InputNumberType>(
    InputNumber as InputNumberType,
);

export default FInputNumber;
