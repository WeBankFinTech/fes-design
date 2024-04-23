import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Spin from './spin';

type SpinType = SFCWithInstall<typeof Spin>;

export { spinProps } from './spin';
export type { SpinProps } from './spin';
export const FSpin = withInstall<SpinType>(Spin as SpinType);

export default FSpin;
