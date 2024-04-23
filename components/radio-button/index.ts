import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import RadioButton from './radio-button';

type RadioButtonType = SFCWithInstall<typeof RadioButton>;

export { radioButtonProps } from './props';
export type { RadioButtonProps } from './props';
export const FRadioButton = withInstall<RadioButtonType>(
    RadioButton as RadioButtonType,
);

export default FRadioButton;
