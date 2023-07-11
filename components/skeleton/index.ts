import { withInstall } from '../_util/withInstall';
import Skeleton from './skeleton';

import type { SFCWithInstall } from '../_util/interface';

type SkeletonType = SFCWithInstall<typeof Skeleton>;
export { skeletonProps } from './skeleton';
export type { SkeletonProps } from './skeleton';
export const FSkeleton = withInstall<SkeletonType>(Skeleton as SkeletonType);

export default FSkeleton;
