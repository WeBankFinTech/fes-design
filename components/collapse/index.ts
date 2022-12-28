import { withInstall, withNoopInstall } from '../_util/withInstall';
import Collapse from './collapse.vue';
import CollapseItem from './collapseItem.vue';
import type { SFCWithInstall } from '../_util/interface';

type CollapseType = SFCWithInstall<typeof Collapse>;
type CollapseItemType = SFCWithInstall<typeof CollapseItem>;

export const FCollapse = withInstall<CollapseType>(Collapse as CollapseType, {
    CollapseItem,
});

export const FCollapseItem = withNoopInstall<CollapseItemType>(
    CollapseItem as CollapseItemType,
);

export default FCollapse;
