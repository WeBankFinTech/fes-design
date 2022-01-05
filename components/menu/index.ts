import { withInstall, withNoopInstall } from '../_util/withInstall';
import Menu from './menu';
import MenuItem from './menuItem';
import MenuGroup from './menuGroup';
import SubMenu from './subMenu';

import type { SFCWithInstall } from '../_util/interface';

type MenuType = SFCWithInstall<typeof Menu>;
type MenuItemType = SFCWithInstall<typeof MenuItem>;
type MenuGroupType = SFCWithInstall<typeof MenuGroup>;
type SubMenuType = SFCWithInstall<typeof SubMenu>;

export const FMenu = withInstall<MenuType>(Menu as MenuType, {
    MenuItem,
    MenuGroup,
    SubMenu,
});
export const FMenuItem = withNoopInstall<MenuItemType>(
    MenuItem as MenuItemType,
);
export const FMenuGroup = withNoopInstall<MenuGroupType>(
    MenuGroup as MenuGroupType,
);
export const FSubMenu = withNoopInstall<SubMenuType>(SubMenu as SubMenuType);

export default FMenu;
