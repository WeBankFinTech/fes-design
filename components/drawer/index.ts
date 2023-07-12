import { withInstall } from '../_util/withInstall';
import Drawer from './drawer';

import type { SFCWithInstall } from '../_util/interface';

type DrawerType = SFCWithInstall<typeof Drawer>;
export const FDrawer = withInstall<DrawerType>(Drawer as DrawerType);

export { drawerProps } from './drawer';
export type { DrawerProps } from './drawer';

export default FDrawer;
