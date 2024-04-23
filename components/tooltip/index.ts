import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Tooltip from './tooltip';

type TooltipType = SFCWithInstall<typeof Tooltip>;

export { toolTipProps } from './tooltip';
export type { ToolTipProps } from './tooltip';
export const FTooltip = withInstall<TooltipType>(Tooltip as TooltipType);

export default FTooltip;
