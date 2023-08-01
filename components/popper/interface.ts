import { PLACEMENT } from '../_util/constants';
import type { VModelEvent } from '../_util/interface';

export type PopperEmits = {
    (e: VModelEvent, val: boolean): void;
};

export type VirtualRect = {
    x: number;
    y: number;
};

export type Placement = (typeof PLACEMENT)[number];

export type Popper = {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
};
