import { type ComponentObjectPropsOptions } from 'vue';
import {
    type ComponentInnerProps,
    type ExtractPublicPropTypes,
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

export interface BreadcrumbInject {
    props: BreadcrumbInnerProps;
}
