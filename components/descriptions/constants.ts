import type { InjectionKey, CSSProperties, ComputedRef } from 'vue';

export type LabelAlign = 'center' | 'left' | 'right';
export type LabelPlacement = 'top' | 'left';

export const DESCRIPTIONS_PROVIDE_KEY: InjectionKey<{
    parentProps: ComputedRef<{
        contentStyle: CSSProperties | string;
        labelAlign: LabelAlign;
        labelPlacement: LabelPlacement;
        labelStyle: CSSProperties | string;
        separator: string;
    }>;
}> = Symbol('DESCRIPTIONS_PROVIDE_KEY');
