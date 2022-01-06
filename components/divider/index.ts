import { withInstall } from '../_util/withInstall';
import Divider from './divider';

import type { SFCWithInstall } from '../_util/interface';

type DividerType = SFCWithInstall<typeof Divider>;
export const FDivider = withInstall<DividerType>(Divider as DividerType);

export default FDivider;
