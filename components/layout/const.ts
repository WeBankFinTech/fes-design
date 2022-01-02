import type { InjectionKey } from 'vue';

import type { LayoutInst } from './interface';

export enum COMPONENT_NAME {
    LAYOUT = 'FLayout',
    HEADER = 'FHeader',
    FOOTER = 'FFooter',
    ASIDE = 'FAside',
    MAIN = 'FMain',
}

export const LAYOUT_PROVIDE_KEY: InjectionKey<LayoutInst> = Symbol('FLayout');
