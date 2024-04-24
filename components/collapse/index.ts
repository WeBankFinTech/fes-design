import { withInstall, withNoopInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Collapse from './collapse.vue';
import CollapseItem from './collapseItem.vue';

type CollapseType = SFCWithInstall<typeof Collapse>;
type CollapseItemType = SFCWithInstall<typeof CollapseItem>;

export { collapseProps } from './collapseExpose';
export type { CollapseProps } from './collapseExpose';
export const FCollapse = withInstall<CollapseType>(Collapse as CollapseType, {
    CollapseItem,
});

export { collapseItemProps } from './collapseItemExpose';
export type { CollapseItemProps } from './collapseItemExpose';
export const FCollapseItem = withNoopInstall<CollapseItemType>(
    CollapseItem as CollapseItemType,
);

export default FCollapse;
