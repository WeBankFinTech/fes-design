import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Skeleton from './skeleton';

type SkeletonType = SFCWithInstall<typeof Skeleton>;
export { skeletonProps } from './skeleton';
export type { SkeletonProps } from './skeleton';
export const FSkeleton = withInstall<SkeletonType>(Skeleton as SkeletonType);

export default FSkeleton;
