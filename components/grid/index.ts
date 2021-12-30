import { withInstall, withNoopInstall } from '../_util/withInstall';
import Grid from './grid';
import GridItem from './gridItem';

export const FGrid = withInstall(Grid, {
    GridItem,
});
export const FGridItem = withNoopInstall(GridItem);

export default FGrid;
