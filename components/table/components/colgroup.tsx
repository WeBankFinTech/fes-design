import { defineComponent, PropType, inject } from 'vue';
import { provideKey } from '../const';
import type { ColumnInst } from '../column';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    },
    setup(props) {
        const { layout } = inject(provideKey);
        const renderColgroup = (columns: ColumnInst[]) => (
            <colgroup>
                {columns.map((column) => {
                    const width = layout.widthList.value[column.id]?.width;
                    const minWidth =
                        layout.widthList.value[column.id]?.minWidth;
                    return (
                        <col
                            key={column.id}
                            style={[
                                width && { width: `${width}px` },
                                minWidth && { minWidth: `${minWidth}px` },
                            ]}
                        />
                    );
                })}
            </colgroup>
        );
        return () => renderColgroup(props.columns);
    },
});
