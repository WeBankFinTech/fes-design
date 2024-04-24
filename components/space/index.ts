import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Space from './space';

type SpaceType = SFCWithInstall<typeof Space>;

export { spaceProps } from './props';
export type { SpaceProps } from './props';
export const FSpace = withInstall<SpaceType>(Space as SpaceType);

export default FSpace;
