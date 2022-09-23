import { defineComponent, inject, PropType } from 'vue';
import { provideKey } from '../const';

import type { ColumnInst } from '../column';

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
        return () => {
            const { row, rowIndex, column, length } = props;
            if (column?.slots?.default) {
                return (
                    <tr class={`${prefixCls}-row`}>
                        <td
                            colspan={length}
                            class={`${prefixCls}-td ${prefixCls}-cell ${prefixCls}-expanded-cell`}
                        >
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
        };
    },
});
