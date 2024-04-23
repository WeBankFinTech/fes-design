import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Button from './button';

export { buttonProps } from './button';
export type { ButtonProps } from './button';

type ButtonType = SFCWithInstall<typeof Button>;
export const FButton = withInstall<ButtonType>(Button as ButtonType);

export default FButton;
