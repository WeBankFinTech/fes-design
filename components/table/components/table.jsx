import { defineComponent, inject } from 'vue';
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

        return () => (
            <table cellspacing="0" cellpadding="0" border="0">
                <Colgroup columns={props.columns} />
                {props.hasHeader && <Header />}
                {props.hasBody && <Body columns={props.columns} />}
            </table>
        );
    },
});
