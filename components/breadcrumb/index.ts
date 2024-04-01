import { withInstall } from '../_util/withInstall';
import Breadcrumb from './breadcrumb';
import BreadcrumbItem from './breadcrumb-item';
import type { SFCWithInstall } from '../_util/interface';

export { breadcrumbProps } from './props';
export type { BreadcrumbProps } from './props';

type BreadcrumbType = SFCWithInstall<typeof Breadcrumb>;
export const FBreadcrumb = withInstall<BreadcrumbType>(
    Breadcrumb as BreadcrumbType,
);

type BreadCrumbItemType = SFCWithInstall<typeof BreadcrumbItem>;
export const FBreadCrumbItem = withInstall<BreadCrumbItemType>(
    BreadcrumbItem as BreadCrumbItemType,
);

export default FBreadcrumb;
