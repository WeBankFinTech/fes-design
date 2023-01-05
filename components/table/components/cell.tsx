import {
    defineComponent,
    Fragment,
    inject,
    PropType,
    ExtractPropTypes,
} from 'vue';
import { isNil, isArray, isFunction, isPlainObject } from 'lodash-es';
import Button from '../../button/button';
import Ellipsis from '../../ellipsis/ellipsis';
import { provideKey } from '../const';

import type { ActionType } from '../interface';
import type { ColumnInst } from '../column';

const cellProps = {
    row: {
        type: Object,
        required: true,
    },
    rowIndex: Number,
    column: {
        type: Object as PropType<ColumnInst>,
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
    ] as PropType<any>,
} as const;

export type CellProps = Partial<ExtractPropTypes<typeof cellProps>>;

export default defineComponent({
    name: 'FTableCell',
    props: cellProps,
    setup(props) {
        const { prefixCls } = inject(provideKey);
        return () => {
            const { row, column, cellValue } = props;
            if (column.props.action) {
                let actions: ActionType[] = [];
                if (isPlainObject(column.props.action)) {
                    actions = [column.props.action as ActionType];
                }
                if (isArray(column.props.action)) {
                    actions = column.props.action;
                }
                actions = actions.filter(
                    (action) => action.label && isFunction(action.func),
                );
                return (
                    <div class={`${prefixCls}-action`}>
                        {actions.map((action) => (
                            <Button
                                class={`${prefixCls}-action-item`}
                                type="link"
                                onClick={() => {
                                    action.func(row);
                                }}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                );
            }
            const hasEllipsis =
                !isNil(column.props.ellipsis) &&
                column.props.ellipsis !== false;
            const ellipsisProps = isPlainObject(column.props.ellipsis)
                ? column.props.ellipsis
                : {};
            if (column?.slots?.default) {
                return hasEllipsis ? (
                    <Ellipsis {...ellipsisProps}>
                        {column.slots.default(props)}
                    </Ellipsis>
                ) : (
                    <Fragment>{column.slots.default(props)}</Fragment>
                );
            }
            const result = column?.props?.formatter?.(props) ?? cellValue;
            Object.assign(ellipsisProps, { content: result });
            return hasEllipsis ? (
                <Ellipsis {...ellipsisProps}></Ellipsis>
            ) : (
                <Fragment> {result} </Fragment>
            );
        };
    },
});
