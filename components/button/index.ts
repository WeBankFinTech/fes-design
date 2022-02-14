import { withInstall } from '../_util/withInstall';
import Button from './button';

import type { SFCWithInstall } from '../_util/interface';

type ButtonType = SFCWithInstall<typeof Button>;
export const FButton = withInstall<ButtonType>(Button as ButtonType);

export default FButton;
