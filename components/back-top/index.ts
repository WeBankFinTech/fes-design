import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import BackTop from './backTop';

export { backTopProps } from './props';
export type { BackTopProps } from './props';

type BackTopType = SFCWithInstall<typeof BackTop>;
export const FBackTop = withInstall<BackTopType>(BackTop as BackTopType);

export default FBackTop;
