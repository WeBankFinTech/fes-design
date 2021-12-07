import { withInstall, withNoopInstall } from '../_util/withInstall';
import Menu from './menu';
import MenuItem from './menuItem';
import MenuGroup from './menuGroup';
import SubMenu from './subMenu';

export const FMenu = withInstall(Menu, {
    MenuItem, MenuGroup, SubMenu,
});
export const FMenuItem = withNoopInstall(MenuItem);
export const FMenuGroup = withNoopInstall(MenuGroup);
export const FSubMenu = withNoopInstall(SubMenu);

export default FMenu;
