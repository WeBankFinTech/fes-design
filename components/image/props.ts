import type { InjectionKey, Ref } from 'vue';

export type PreviewImageType = {
    id: number;
    url: string;
    name?: string;
    size: { width: number; height: number };
    download: boolean;
};
export interface PreviewInst {
    curIndex?: Ref<number>;
    isGroup?: Ref<boolean | undefined>;
    setCurrent?: (val: number) => void;
    registerImage?: (param: PreviewImageType) => () => void;
    setShowPreview?: (val: boolean) => void;
    next?: () => void;
    prev?: () => void;
}

export const PREVIEW_PROVIDE_KEY: InjectionKey<PreviewInst> =
    Symbol('wPreview');
