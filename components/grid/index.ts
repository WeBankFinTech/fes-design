import { withInstall, withNoopInstall } from '../_util/withInstall';
import Grid from './grid.vue';
import GridItem from './gridItem.vue';

import type { SFCWithInstall } from '../_util/interface';

type GridType = SFCWithInstall<typeof Grid>;
type GridItemType = SFCWithInstall<typeof GridItem>;
export const FGrid = withInstall<GridType>(Grid as GridType, { GridItem });

export const FGridItem = withNoopInstall<GridItemType>(
    GridItem as GridItemType,
);

export default FGrid;
