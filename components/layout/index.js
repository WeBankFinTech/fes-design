import { withInstall, withNoopInstall } from '../_util/withInstall';
import Layout from './layout';
import Header from './header';
import Main from './main';
import Aside from './aside';
import Footer from './footer';

export const FLayout = withInstall(Layout, {
    Header,
    Main,
    Aside,
    Footer,
});
export const FHeader = withNoopInstall(Header);
export const FMain = withNoopInstall(Main);
export const FAside = withNoopInstall(Aside);
export const FFooter = withNoopInstall(Footer);

export default FLayout;
