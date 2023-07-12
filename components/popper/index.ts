import { withInstall } from '../_util/withInstall';
import Popper from './popper';

import type { SFCWithInstall } from '../_util/interface';

type PopperType = SFCWithInstall<typeof Popper>;

export { popperProps } from './props';
export type { PopperProps } from './props';
export const FPopper = withInstall<PopperType>(Popper as PopperType);

export default FPopper;
