import { withInstall } from '../_util/withInstall';
import VirtualList from './virtualList';

import type { SFCWithInstall } from '../_util/interface';

type VirtualListType = SFCWithInstall<typeof VirtualList>;
export const FVirtualList = withInstall<VirtualListType>(
    VirtualList as VirtualListType,
);

export default FVirtualList;
