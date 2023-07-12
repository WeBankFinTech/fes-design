import { withInstall } from '../_util/withInstall';
import Ellipsis from './ellipsis';
import type { SFCWithInstall } from '../_util/interface';

type EllipsisType = SFCWithInstall<typeof Ellipsis>;
export const FEllipsis = withInstall<EllipsisType>(Ellipsis as EllipsisType);

export { ellipsisProps } from './ellipsis';
export type { EllipsisProps } from './ellipsis';

export default FEllipsis;
