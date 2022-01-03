import type { CSSProperties } from 'vue';

export type ScrollbarProps = {
    height?: number | string;
    maxHeight?: number | string;
    native?: boolean;
    containerClass?: CSSProperties;
    containerStyle?: CSSProperties;
    noresize?: boolean;
    always?: boolean;
    minSize?: number;
};
