import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import VirtualList from './virtualList';

type VirtualListType = SFCWithInstall<typeof VirtualList>;
export { virtualProps } from './props';
export type { VirtualProps } from './props';
export const FVirtualList = withInstall<VirtualListType>(
    VirtualList as VirtualListType,
);

export default FVirtualList;
