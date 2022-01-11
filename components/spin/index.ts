import { withInstall } from '../_util/withInstall';
import Spin from './spin';

import type { SFCWithInstall } from '../_util/interface';

type SpinType = SFCWithInstall<typeof Spin>;
export const FSpin = withInstall<SpinType>(Spin as SpinType);

export default FSpin;
