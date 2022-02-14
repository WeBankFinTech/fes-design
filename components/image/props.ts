import type { InjectionKey, Ref } from 'vue';

export interface PreviewInst {
    curIndex?: Ref<number>;
    isGroup?: Ref<boolean | undefined>;
    setCurrent?: (val: number) => void;
    previewUrls?: Record<number, string>;
    registerImage?: (id: number, url: string) => () => void;
    setShowPreview?: (val: boolean) => void;
}

export const PREVIEW_PROVIDE_KEY: InjectionKey<PreviewInst> =
    Symbol('wPreview');
