import { inject } from 'vue';
import { provideKey } from './const';
import { renderColgroup } from './renderHelper';
import TableHeaderContent from './tableHeaderContent';

export default {
    components: {
        TableHeaderContent,
    },
    props: {
        fixedColumn: Object,
    },
    setup(props) {
        const { prefixCls, headerStyle, layout } = inject(provideKey);

        return () => (
            <table
                className={`${prefixCls}-header`}
                cellspacing="0"
                cellpadding="0"
                border="0"
                style={
                    props.fixedColumn ? { width: '100%' } : headerStyle.value
                }
            >
                {renderColgroup(layout.widthList.value, props.fixedColumn)}
                <TableHeaderContent
                    fixedColumn={props.fixedColumn}
                ></TableHeaderContent>
            </table>
        );
    },
};
