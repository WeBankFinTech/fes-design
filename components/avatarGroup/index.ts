import { withInstall } from '../_util/withInstall';
import AvatarGroup from './avatarGroup';
import type { SFCWithInstall } from '../_util/interface';

export { avatarGroupProps } from './props';
export type { AvatarGroupProps } from './props';

type AvatarGroupType = SFCWithInstall<typeof AvatarGroup>;
export const FAvatarGroup = withInstall<AvatarGroupType>(
    AvatarGroup as AvatarGroupType,
);

export default FAvatarGroup;
