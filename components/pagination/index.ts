import { withInstall } from '../_util/withInstall';
import Pagination from './pagination';

import type { SFCWithInstall } from '../_util/interface';

type PaginationType = SFCWithInstall<typeof Pagination>;
export const FPagination = withInstall<PaginationType>(
    Pagination as PaginationType,
);

export default FPagination;
