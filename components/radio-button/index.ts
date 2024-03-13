import { withInstall } from '../_util/withInstall';
import RadioButton from './radio-button';

import type { SFCWithInstall } from '../_util/interface';

type RadioButtonType = SFCWithInstall<typeof RadioButton>;

export { radioButtonProps } from './props';
export type { RadioButtonProps } from './props';
export const FRadioButton = withInstall<RadioButtonType>(
    RadioButton as RadioButtonType,
);

export default FRadioButton;
