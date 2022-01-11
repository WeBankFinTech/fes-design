import type { VModelEvent } from '../_util/interface';

export type DraggableEmits = {
    (e: VModelEvent, ...args: any[]): void;
    (e: 'drag-start', ...args: any[]): void;
    (e: 'drag-end', ...args: any[]): void;
};
