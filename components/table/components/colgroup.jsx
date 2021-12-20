import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        columns: {
            type: Array,
            required: true,
        },
    },
    setup(props) {
        const renderColgroup = (columns) => (
            <colgroup>
                {columns.map((column) => (
                    <col
                        key={column.id}
                        name={column.id}
                        style={{ width: `${column.width}px` }}
                    />
                ))}
            </colgroup>
        );
        return () => renderColgroup(props.columns);
    },
});
