import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Avatar from './avatar';

export { avatarProps } from './props';
export type { AvatarProps } from './props';

type AvatarType = SFCWithInstall<typeof Avatar>;
export const FAvatar = withInstall<AvatarType>(Avatar as AvatarType);

export default FAvatar;
