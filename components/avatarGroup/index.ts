import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import AvatarGroup from './avatarGroup';

export { avatarGroupProps } from './props';
export type { AvatarGroupProps } from './props';

type AvatarGroupType = SFCWithInstall<typeof AvatarGroup>;
export const FAvatarGroup = withInstall<AvatarGroupType>(
    AvatarGroup as AvatarGroupType,
);

export default FAvatarGroup;
