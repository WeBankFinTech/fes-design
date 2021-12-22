import { defineComponent, toRefs } from 'vue';

import getPrefixCls from '../_util/getPrefixCls';
import { COMPONENT_NAME } from './const';

const prefixCls = getPrefixCls('pagination');

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_TOTAL,
    props: {
        total: {
            type: Number,
            default: 0,
        },
    },
    setup(props) {
        const { total } = toRefs(props);
        return () => <div class={`${prefixCls}-total`}>共{total.value}条</div>;
    },
});
