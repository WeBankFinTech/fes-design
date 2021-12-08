import { withInstall } from '../_util/withInstall';
import Draggable from './draggable';
import vDrag from './directive';

export const FDraggable = withInstall(Draggable, {}, [vDrag]);

export default FDraggable;
