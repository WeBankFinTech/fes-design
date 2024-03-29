import { type ComponentObjectPropsOptions } from 'vue';
import {
    type ExtractPublicPropTypes,
    type ComponentInnerProps,
} from '../_util/interface';

export const breadcrumbProps = {
    // 分隔符，默认为/
    separator: {
        type: String,
        default: '/',
    },
    fontSize: {
        type: Number,
        default: 14,
    },
} as const satisfies ComponentObjectPropsOptions;

export type BreadcrumbProps = ExtractPublicPropTypes<typeof breadcrumbProps>;

type BreadcrumbInnerProps = ComponentInnerProps<typeof breadcrumbProps>;

// 子层级的props
export const breadcrumbItemProps = {
    // 跳转行为
    replace: {
        type: Boolean,
        default: false,
    },
    // 跳转的路由
    to: {
        type: String,
    },
} as const satisfies ComponentObjectPropsOptions;

export type BreadcrumbItemProps = ExtractPublicPropTypes<
    typeof breadcrumbItemProps
>;

export type BreadcrumbInject = {
    props: BreadcrumbInnerProps;
};
