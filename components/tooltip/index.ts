import { withInstall } from '../_util/withInstall';
import Tooltip from './tooltip';

import type { SFCWithInstall } from '../_util/interface';

type TooltipType = SFCWithInstall<typeof Tooltip>;
export const FTooltip = withInstall<TooltipType>(Tooltip as TooltipType);

export default FTooltip;
export type { ToolTipProps } from './tooltip';
