import { h, defineComponent, Fragment } from 'vue';

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
        const renderHeader = () =>
            props.column?.slots?.header?.(props) ||
            props.column?.props?.label ||
            '';
        return () => <Fragment>{renderHeader()}</Fragment>;
    },
});
