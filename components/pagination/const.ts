import type { PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const COMPONENT_NAME = {
    PAGINATION: 'FPagination',
    PAGINATION_JUMPER: 'FPaginationJumper',
    PAGINATION_PAGER: 'FPaginationPager',
    PAGINATION_SIMPLER: 'FPaginationSimpler',
    PAGINATION_SIZES: 'FPaginationSizes',
    PAGINATION_TOTAL: 'FPaginationTotal',
};

export const PROVIDE_KEY = Symbol('PaginationProvideKey');

export const paginationProps = {
    // 每页显示条目个数
    pageSize: {
        type: Number,
        default: 10,
    },
    // 当前页码
    currentPage: {
        type: Number,
        default: 1,
    },
    // 总条数
    totalCount: {
        type: Number,
        default: 0,
    },
    // 每页条数
    pageSizeOption: {
        type: Array as PropType<number[]>,
        default() {
            return [10, 20, 30, 50, 100];
        },
    },
    // 是否显示快速跳转
    showQuickJumper: {
        type: Boolean,
        default: false,
    },
    // 是否显示每页条数的选择器
    showSizeChanger: {
        type: Boolean,
        default: false,
    },
    // 是否显示总条数
    showTotal: {
        type: Boolean,
        default: false,
    },
    // 是否使用小型分页样式
    small: {
        type: Boolean,
        default: false,
    },
    // 是否使用简洁样式
    simple: {
        type: Boolean,
        default: false,
    },
} as const;

export type PaginationProps = ExtractPublicPropTypes<typeof paginationProps>;
