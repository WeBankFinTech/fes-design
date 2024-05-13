import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Link from './link';

export { linkProps } from './props';
export type { LinkProps } from './props';

type LinkType = SFCWithInstall<typeof Link>;
export const FLink = withInstall<LinkType>(Link as LinkType);

export default FLink;
