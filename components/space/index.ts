import { withInstall } from '../_util/withInstall';
import Space from './space';

import type { SFCWithInstall } from '../_util/interface';

type SpaceType = SFCWithInstall<typeof Space>;
export const FSpace = withInstall<SpaceType>(Space as SpaceType);

export default FSpace;
