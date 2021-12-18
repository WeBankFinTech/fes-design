import { defineComponent, Fragment } from 'vue';

export default defineComponent({
    name: 'FTableLabel',
    props: {
        column: {
            type: Object,
            required: true,
        },
        columnIndex: Number,
    },
    setup(props) {
        const column = props.column;
        const renderHeader = () =>
            column?.ctx?.slots?.header?.(props) || column?.props?.label || '';
        return () => <Fragment>{renderHeader()}</Fragment>;
    },
});
