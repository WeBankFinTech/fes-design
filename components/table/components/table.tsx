import { h, computed, defineComponent, inject, PropType } from 'vue';
import { provideKey } from '../const';
import Colgroup from './colgroup';
import Header from './header';
import Body from './body';

import type { ColumnInst } from '../interface'

export default defineComponent({
    components: {
        Colgroup,
        Header,
        Body,
    },
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
        emptyText: {
            type: String,
        },
    },
    setup(props) {
        const { layout } = inject(provideKey);
        // 计算出传入columns列的对应的宽度
        const _columns = computed(() => {
            const widtListValue = layout.widthList.value;
            return props.columns.map((column) => ({
                ...column,
                width: (widtListValue as any)[column.id],
            }));
        });

        return () => (
            <table cellspacing="0" cellpadding="0">
                <Colgroup columns={_columns.value} />
                {props.hasHeader && <Header />}
                {props.hasBody && (
                    <Body emptyText={props.emptyText} columns={props.columns} />
                )}
            </table>
        );
    },
});
