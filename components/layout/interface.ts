import { COMPONENT_NAME } from './const';

import type { Ref, CSSProperties, ToRefs } from 'vue';

export interface LayoutChild {
    type: COMPONENT_NAME;
}

export type AsidePlacement = 'left' | 'right' | '';

export interface LayoutProps {
    embedded?: boolean;
    fixed?: boolean;
    containerClass?: CSSProperties;
    containerStyle?: CSSProperties;
}

export interface LayoutInst extends ToRefs<LayoutProps> {
    addChild: (child: LayoutChild) => void;
    asidePlacement?: Ref<AsidePlacement>;
}
