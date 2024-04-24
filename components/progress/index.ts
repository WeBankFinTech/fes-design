import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Progress from './progress';

export { progressProps } from './props';
export type { ProgressProps } from './props';

type ProgressType = SFCWithInstall<typeof Progress>;
export const FProgress = withInstall<ProgressType>(Progress as ProgressType);

export default FProgress;
