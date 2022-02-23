import { h, defineComponent, inject, PropType } from 'vue';
import { provideKey } from '../const';
import Colgroup from './colgroup';
import Header from './header';
import Tr from './tr';

import type { ColumnInst } from '../column.vue';

export default defineComponent({
    props: {
        hasHeader: {
            type: Boolean,
            default: true,
        },
        hasBody: {
            type: Boolean,
            default: true,
        },
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    },
    setup(props) {
        const { showData, getRowKey } = inject(provideKey);
        
        const renderBodyTrList = () =>
            showData.value.length ? (
                showData.value.map((row: object, rowIndex: number) => (
                    <Tr
                        row={row}
                        rowIndex={rowIndex}
                        columns={props.columns}
                        key={(getRowKey({ row }) || rowIndex) as any}
                    />
                ))
            ) : (
                <Tr columns={props.columns} />
            );

        return () => (
            <table cellspacing="0" cellpadding="0">
                <Colgroup columns={props.columns} />
                {props.hasHeader && <Header />}
                {props.hasBody && (
                    <tbody>{renderBodyTrList()}</tbody>
                )}
            </table>
        );
    },
});
