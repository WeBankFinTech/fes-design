import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Popper from './popper';

type PopperType = SFCWithInstall<typeof Popper>;

export { popperProps } from './props';
export type { PopperProps } from './props';
export const FPopper = withInstall<PopperType>(Popper as PopperType);

export default FPopper;
