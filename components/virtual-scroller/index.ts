import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import VirtualScroller from './virtual-scroller';

type VirtualScrollerType = SFCWithInstall<typeof VirtualScroller>;

export const FVirtualScroller = withInstall<VirtualScrollerType>(
    VirtualScroller as VirtualScrollerType,
);

export { virtualScrollerProps } from './virtual-scroller';

export type { VirtualScrollerProps } from './virtual-scroller';

export default FVirtualScroller;
