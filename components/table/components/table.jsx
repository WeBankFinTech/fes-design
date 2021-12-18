import { computed, defineComponent, inject } from 'vue';
import { provideKey } from '../const';
import Colgroup from './colgroup';
import Header from './header';
import Body from './body';

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
            type: Array,
            required: true,
        },
    },
    setup(props) {
        const { layout } = inject(provideKey);
        // 计算出传入columns列的对应的宽度
        const widthList = computed(() => {
            const widtListValue = layout.widthList.value;
            return props.columns.map((column) => ({
                ...column,
                width: widtListValue[column.id],
            }));
        });

        return () => (
            <table cellspacing="0" cellpadding="0" border="0">
                <Colgroup columns={widthList.value} />
                {props.hasHeader && <Header />}
                {props.hasBody && <Body columns={props.columns} />}
            </table>
        );
    },
});
