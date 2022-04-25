import type { InjectionKey, Ref } from 'vue';

export interface PreviewInst {
    curIndex?: Ref<number>;
    isGroup?: Ref<boolean | undefined>;
    setCurrent?: (val: number) => void;
    registerImage?: (
        id: number,
        url: string,
        name: string | undefined,
        size: { width: number; height: number },
    ) => () => void;
    setShowPreview?: (val: boolean) => void;
    next: () => void;
    prev: () => void;
}

export const PREVIEW_PROVIDE_KEY: InjectionKey<PreviewInst> =
    Symbol('wPreview');
