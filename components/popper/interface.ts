import { type PLACEMENT } from '../_util/constants';
import type { VModelEvent } from '../_util/interface';

export interface PopperEmits {
    (e: VModelEvent, val: boolean): void;
}

export interface VirtualRect {
    x: number;
    y: number;
}

export type Placement = (typeof PLACEMENT)[number];

export interface Popper {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
}
