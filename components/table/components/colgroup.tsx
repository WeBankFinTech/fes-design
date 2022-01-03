import { h, defineComponent, PropType } from 'vue';

import type { ColumnInst } from '../interface'

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    },
    setup(props) {
        const renderColgroup = (columns: ColumnInst[]) => (
            <colgroup>
                {columns.map((column) => (
                    <col
                        key={column.id}
                        style={{ width: `${column.width}px` }}
                    />
                ))}
            </colgroup>
        );
        return () => renderColgroup(props.columns);
    },
});
