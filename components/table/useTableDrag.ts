import { SetupContext } from 'vue';
import type { TableProps } from './table';

export default ({ props, ctx }: { props: TableProps; ctx: SetupContext }) => {
    const onDragstart = (event: DragEvent, item: unknown, index: number) => {
        ctx.emit('dragstart', event, item, index);
    };

    const onDragend = (event: DragEvent, item: unknown, index: number) => {
        ctx.emit('dragend', event, item, index);
    };

    return {
        onDragstart,
        onDragend,
        beforeDragend: props.beforeDragend,
    };
};
