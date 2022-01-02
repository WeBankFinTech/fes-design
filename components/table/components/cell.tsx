import { h, defineComponent, Fragment, inject } from 'vue';
import { isArray, isFunction, isPlainObject } from 'lodash-es';
import Button from '../../button/button';
import Ellipsis from '../../ellipsis/ellipsis';
import { provideKey } from '../const';

export default defineComponent({
    name: 'FTableCell',
    props: {
        row: {
            type: Object,
            required: true,
        },
        rowIndex: Number,
        column: {
            type: Object,
            required: true,
        },
        columnIndex: Number,
        cellValue: [
            String,
            Number,
            Date,
            Boolean,
            Array,
            Object,
            Function,
            Symbol,
        ],
    },
    setup(props) {
        const { prefixCls } = inject(provideKey);
        const { row, column, cellValue } = props;
        if (column.props.action) {
            let actions = [];
            if (isPlainObject(column.props.action)) {
                actions = [column.props.action];
            }
            if (isArray(column.props.action)) {
                actions = column.props.action;
            }
            actions = actions.filter(
                (action) => action.label && isFunction(action.func),
            );
            return () => (
                <div class={`${prefixCls}-action`}>
                    {actions.map((action) => (
                        <Button
                            class={`${prefixCls}-action-item`}
                            type="link"
                            onClick={() => {
                                action.func(row);
                            }}
                        >
                            {' '}
                            {action.label}
                        </Button>
                    ))}
                </div>
            );
        }
        if (column.ctx?.slots?.default) {
            return () =>
                column.props.ellipsis ? (
                    <Ellipsis>{column.ctx.slots.default(props)}</Ellipsis>
                ) : (
                    <Fragment>{column.ctx.slots.default(props)}</Fragment>
                );
        }
        const getResult = () =>
            column?.props?.formatter?.(props) || cellValue || '';
        return () =>
            column.props.ellipsis ? (
                <Ellipsis>{getResult()}</Ellipsis>
            ) : (
                <Fragment>{getResult()}</Fragment>
            );
    },
});
