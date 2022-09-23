import { defineComponent, PropType } from 'vue';

import type { ColumnInst } from '../column';

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
                        style={[
                            column.width && { width: `${column.width}px` },
                            column.minWidth && {
                                width: `${column.minWidth}px`,
                            },
                        ]}
                    />
                ))}
            </colgroup>
        );
        return () => renderColgroup(props.columns);
    },
});
