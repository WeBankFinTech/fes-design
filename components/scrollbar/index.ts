import { withInstall } from '../_util/withInstall';
import Scrollbar from './scrollbar.vue';

import type { SFCWithInstall } from '../_util/interface';

type ScrollbarType = SFCWithInstall<typeof Scrollbar>;
export const FScrollbar = withInstall<ScrollbarType>(
    Scrollbar as ScrollbarType,
);

export default FScrollbar;
