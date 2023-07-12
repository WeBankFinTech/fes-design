import { withInstall, withNoopInstall } from '../_util/withInstall';
import Layout from './layout.vue';
import Header from './header.vue';
import Main from './main.vue';
import Aside from './aside.vue';
import Footer from './footer.vue';

import type { SFCWithInstall } from '../_util/interface';

type LayoutType = SFCWithInstall<typeof Layout>;
type HeaderType = SFCWithInstall<typeof Header>;
type MainType = SFCWithInstall<typeof Main>;
type AsideType = SFCWithInstall<typeof Aside>;
type FooterType = SFCWithInstall<typeof Footer>;

export { layoutProps } from './const';
export type { LayoutProps } from './const';
export const FLayout = withInstall<LayoutType>(Layout as LayoutType, {
    Header,
    Main,
    Aside,
    Footer,
});

export { layoutHeaderProps } from './header.vue';
export type { LayoutHeaderProps } from './header.vue';
export const FHeader = withNoopInstall<HeaderType>(Header as HeaderType);

export { layoutMainProps } from './main.vue';
export type { LayoutMainProps } from './main.vue';
export const FMain = withNoopInstall<MainType>(Main as MainType);

export { layoutAsideProps } from './aside.vue';
export type { LayoutAsideProps } from './aside.vue';
export const FAside = withNoopInstall<AsideType>(Aside as AsideType);

export { layoutFooterProps } from './footer.vue';
export type { LayoutFooterProps } from './footer.vue';
export const FFooter = withNoopInstall<FooterType>(Footer as FooterType);

export default FLayout;
