import { reactive, computed, watch, SetupContext, Ref } from 'vue';
import type { TableProps } from './table';

export default ({ props, ctx }: { props: TableProps; ctx: SetupContext }) => {
    const onDragstart = (event, item, index) => {
        console.log('handleDargStart', event, item, index);
    };
    const onDragend = (event, item, setting) => {
        console.log('handleDargEnd', event, item, setting);
    };
    const beforeDragend = (item, start, end) => {
        console.log('beforeDragEnd', item, start, end);
        return true;
    };

    return {
        onDragstart,
        onDragend,
        beforeDragend,
    };
};
