import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export interface AnchorLink {
    title: string;
    href: string;
    children?: AnchorLink[];
}

export const anchorProps = {
    links: {
        type: Array as PropType<AnchorLink[]>,
        default: () => [],
    },
    container: {
        type: Object as PropType<HTMLElement>,
    },
    currentAnchor: {
        type: String,
        default: '',
    },
    offsetTop: {
        type: Number,
        default: 0,
    },
    bounds: {
        type: Number,
        default: 5,
    },
} as const satisfies ComponentObjectPropsOptions;

export type AnchorProps = ExtractPublicPropTypes<typeof anchorProps>;

export const anchorEmits = {
    click: (e: MouseEvent, href: string) => e instanceof MouseEvent,
    change: (href: string) => typeof href === 'string',
};
export type AnchorEmits = typeof anchorEmits;