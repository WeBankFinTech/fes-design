import { withInstall, withNoopInstall } from '../_util/withInstall';
import Grid from './grid.vue';
import GridItem from './gridItem.vue';

import type { SFCWithInstall } from '../_util/interface';

type GridType = SFCWithInstall<typeof Grid>;
type GridItemType = SFCWithInstall<typeof GridItem>;

export { gridProps } from './grid.vue';
export type { GridProps } from './grid.vue';
export const FGrid = withInstall<GridType>(Grid as GridType, { GridItem });

export { gridItemProps } from './gridItem.vue';
export type { GridItemProps } from './gridItem.vue';
export const FGridItem = withNoopInstall<GridItemType>(
    GridItem as GridItemType,
);

export default FGrid;
