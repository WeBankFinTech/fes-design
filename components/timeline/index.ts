import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Timeline from './timeline';

export { timelineProps } from './props';
export type { TimelineProps } from './props';

type TimelineType = SFCWithInstall<typeof Timeline>;
export const FTimeline = withInstall<TimelineType>(Timeline as TimelineType);

export default FTimeline;
