import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Draggable from './draggable';
import vDrag from './directive';

type DraggableType = SFCWithInstall<typeof Draggable>;
export const FDraggable = withInstall<DraggableType>(
    Draggable as DraggableType,
    {},
    [vDrag],
);

export { draggableProps } from './draggable';
export type { DraggableProps } from './draggable';

export default FDraggable;
