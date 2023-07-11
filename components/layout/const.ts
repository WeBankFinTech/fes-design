import { Ref, CSSProperties, ToRefs, PropType, InjectionKey } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export enum COMPONENT_NAME {
    LAYOUT = 'FLayout',
    HEADER = 'FHeader',
    FOOTER = 'FFooter',
    ASIDE = 'FAside',
    MAIN = 'FMain',
}

export interface LayoutChild {
    type: COMPONENT_NAME;
}

export type AsidePlacement = 'left' | 'right' | '';

export const layoutProps = {
    embedded: {
        type: Boolean,
        default: false,
    },
    fixed: {
        type: Boolean,
        default: false,
    },
    containerClass: [Array, Object, String] as PropType<CSSProperties>,
    containerStyle: Object as PropType<CSSProperties>,
} as const;

export type LayoutProps = ExtractPublicPropTypes<typeof layoutProps>;

export interface LayoutInst extends ToRefs<LayoutProps> {
    addChild: (child: LayoutChild) => void;
    asidePlacement?: Ref<AsidePlacement>;
}

export const LAYOUT_PROVIDE_KEY: InjectionKey<LayoutInst> = Symbol('FLayout');
