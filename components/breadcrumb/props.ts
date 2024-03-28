import { type ComponentObjectPropsOptions, type PropType } from 'vue';
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
    // 是否展示icon
    icon: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

export type BreadcrumbProps = ExtractPublicPropTypes<typeof breadcrumbProps>;

type BreadcrumbInnerProps = ComponentInnerProps<typeof breadcrumbProps>;

// 面包屑的菜单数据
type Menu = {
    name: string;
    path: string;
};

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
    menu: {
        type: Array as PropType<Menu[]>,
        default: () => [] as Menu[],
    },
} as const satisfies ComponentObjectPropsOptions;

export type BreadcrumbItemProps = ExtractPublicPropTypes<
    typeof breadcrumbItemProps
>;

export type BreadcrumbInject = {
    props: BreadcrumbInnerProps;
};
