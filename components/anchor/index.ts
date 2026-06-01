import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Anchor from './anchor';

export { anchorProps } from './props';
export type { AnchorProps, AnchorLink, AnchorEmits } from './props';

type AnchorType = SFCWithInstall<typeof Anchor>;
export const FAnchor = withInstall<AnchorType>(Anchor as AnchorType);

export default FAnchor;