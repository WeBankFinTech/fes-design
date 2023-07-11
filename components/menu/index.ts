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

export { menuProps } from './const';
export type { MenuProps } from './const';
export const FMenu = withInstall<MenuType>(Menu as MenuType, {
    MenuItem,
    MenuGroup,
    SubMenu,
});

export { menuItemProps } from './menuItem';
export type { MenuItemProps } from './menuItem';
export const FMenuItem = withNoopInstall<MenuItemType>(
    MenuItem as MenuItemType,
);

export { menuGroupProps } from './menuGroup';
export type { MenuGroupProps } from './menuGroup';
export const FMenuGroup = withNoopInstall<MenuGroupType>(
    MenuGroup as MenuGroupType,
);

export { subMenuProps } from './subMenu';
export type { SubMenuProps } from './subMenu';
export const FSubMenu = withNoopInstall<SubMenuType>(SubMenu as SubMenuType);

export default FMenu;
