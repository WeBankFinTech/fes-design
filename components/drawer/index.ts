import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Drawer from './drawer';

type DrawerType = SFCWithInstall<typeof Drawer>;
export const FDrawer = withInstall<DrawerType>(Drawer as DrawerType);

export { drawerProps } from './props';
export type { DrawerProps } from './props';

export default FDrawer;
