import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Breadcrumb from './breadcrumb';
import BreadcrumbItem from './breadcrumb-item';

export { breadcrumbProps } from './props';
export type { BreadcrumbProps } from './props';

type BreadcrumbType = SFCWithInstall<typeof Breadcrumb>;
export const FBreadcrumb = withInstall<BreadcrumbType>(
    Breadcrumb as BreadcrumbType,
);

type BreadcrumbItemType = SFCWithInstall<typeof BreadcrumbItem>;
export const FBreadcrumbItem = withInstall<BreadcrumbItemType>(
    BreadcrumbItem as BreadcrumbItemType,
);

export default FBreadcrumb;
