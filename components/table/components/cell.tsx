import {
    type ComponentObjectPropsOptions,
    type ExtractPropTypes,
    Fragment,
    type PropType,
    defineComponent,
    inject,
    isVNode,
} from 'vue';
import { isArray, isFunction, isNil, isPlainObject } from 'lodash-es';
import Button from '../../button/button';
import Ellipsis, { type EllipsisProps } from '../../ellipsis/ellipsis';
import { provideKey } from '../const';

import type { ActionType } from '../interface';
import type { ColumnInst } from '../column';
import { stringify } from '../../_util/utils';

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
} as const satisfies ComponentObjectPropsOptions;

export type InnerCellProps = ExtractPropTypes<typeof cellProps>;

const COMPONENT_NAME = 'FTableCell';

export default defineComponent({
    name: COMPONENT_NAME,
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
            const hasEllipsis
                = !isNil(column.props.ellipsis)
                    && column.props.ellipsis !== false;
            const ellipsisProps = isPlainObject(column.props.ellipsis)
                ? (column.props.ellipsis as EllipsisProps)
                : {};
            if (column?.slots?.default) {
                return hasEllipsis
                    ? (
                            <Ellipsis {...ellipsisProps}>
                                {column.slots.default(props)}
                            </Ellipsis>
                        )
                    : (
                            <Fragment>{column.slots.default(props)}</Fragment>
                        );
            }
            const formatterResult = column?.props?.formatter?.(props);
            if (isVNode(formatterResult)) {
                return (
                    <Fragment>
                        {formatterResult}
                    </Fragment>
                );
            }
            const result = formatterResult ?? cellValue;
            Object.assign(ellipsisProps, { content: result });
            return hasEllipsis
                ? <Ellipsis {...ellipsisProps} />
                : (
                        <Fragment>
                            {typeof result === 'object' && result
                                ? stringify(
                                        result,
                                        (err) => console.warn(`[${COMPONENT_NAME}]: render error occurred due to \n`, err),
                                    )
                                : result}
                        </Fragment>
                    );
        };
    },
});
