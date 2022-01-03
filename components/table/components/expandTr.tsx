import { h, defineComponent, inject, PropType } from 'vue';
import { provideKey } from '../const';

import type { ColumnInst } from '../interface'

export default defineComponent({
    name: 'FTableExpand',
    props: {
        row: {
            type: Object,
            required: true,
        },
        column: {
            type: Object as PropType<ColumnInst>,
            required: true,
        },
        rowIndex: Number,
        length: Number,
    },
    setup(props) {
        const { prefixCls } = inject(provideKey);
        const { row, rowIndex, column, length } = props;
        if (column?.slots?.default) {
            return () => (
                <tr class={`${prefixCls}-expand-tr`}>
                    <td colspan={length} class={`${prefixCls}-expand-td`}>
                        {column.slots.default({
                            row,
                            rowIndex,
                            column,
                        })}
                    </td>
                </tr>
            );
        }
        return null;
    },
});
