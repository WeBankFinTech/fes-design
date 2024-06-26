import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Pagination from './pagination';

type PaginationType = SFCWithInstall<typeof Pagination>;

export { paginationProps } from './const';
export type { PaginationProps } from './const';
export const FPagination = withInstall<PaginationType>(
    Pagination as PaginationType,
);

export default FPagination;
