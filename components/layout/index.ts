import { withInstall, withNoopInstall } from '../_util/withInstall';
import Layout from './layout.vue';
import Header from './header.vue';
import Main from './main.vue';
import Aside from './aside.vue';
import Footer from './footer.vue';

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
