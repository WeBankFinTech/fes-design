import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Ellipsis from './ellipsis';

type EllipsisType = SFCWithInstall<typeof Ellipsis>;
export const FEllipsis = withInstall<EllipsisType>(Ellipsis as EllipsisType);

export { ellipsisProps } from './ellipsis';
export type { EllipsisProps } from './ellipsis';

export default FEllipsis;
