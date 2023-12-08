import { withInstall } from '../_util/withInstall';
import Badge from './badge';
import type { SFCWithInstall } from '../_util/interface';

export { badgeProps } from './props';
export type { BadgeProps } from './props';

type BadgeType = SFCWithInstall<typeof Badge>;
export const FBadge = withInstall<BadgeType>(Badge as BadgeType);

export default FBadge;
