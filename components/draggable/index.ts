import { withInstall } from '../_util/withInstall';
import Draggable from './draggable.vue';
import vDrag from './directive';

export const FDraggable = withInstall(Draggable, {}, [vDrag]);

export default FDraggable;
