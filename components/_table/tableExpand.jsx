import { defineComponent } from 'vue';

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
        const { row, rowIndex, column, length } = props;
        if (column.ctx?.slots?.default) {
            return () => (
                <tr>
                    <td colspan={length}>
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
