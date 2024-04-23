import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Scrollbar from './scrollbar.vue';

type ScrollbarType = SFCWithInstall<typeof Scrollbar>;

export { scrollbarProps } from './const';
export type { ScrollbarProps } from './const';
export const FScrollbar = withInstall<ScrollbarType>(
    Scrollbar as ScrollbarType,
);

export default FScrollbar;
