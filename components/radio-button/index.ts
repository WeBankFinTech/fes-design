import { withInstall } from '../_util/withInstall';
import RadioButton from './radio-button';

import type { SFCWithInstall } from '../_util/interface';

type RadioButtonType = SFCWithInstall<typeof RadioButton>;

export { radioButtonProps } from './radio-button';
export type { RadioButtonProps } from './radio-button';
export const FRadioButton = withInstall<RadioButtonType>(
    RadioButton as RadioButtonType,
);

export default FRadioButton;
