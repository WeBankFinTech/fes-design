import { defineComponent, inject } from 'vue';
import { provideKey } from '../const';

export default defineComponent({
    name: 'FTableExpand',
    props: {
        row: {
            type: Object,
            required: true,
        },
        column: {
            type: Object,
            required: true,
        },
        rowIndex: Number,
        length: Number,
    },
    setup(props) {
        const { prefixCls } = inject(provideKey);
        const { row, rowIndex, column, length } = props;
        if (column.ctx?.slots?.default) {
            return () => (
                <tr className={`${prefixCls}-expand-tr`}>
                    <td colspan={length} className={`${prefixCls}-expand-td`}>
                        {column.ctx.slots.default({
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
