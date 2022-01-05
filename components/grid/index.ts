import { withInstall, withNoopInstall } from '../_util/withInstall';
import Grid from './grid.vue';
import GridItem from './gridItem.vue';

export const FGrid = withInstall(Grid, {
    GridItem,
});
export const FGridItem = withNoopInstall(GridItem);

export default FGrid;
