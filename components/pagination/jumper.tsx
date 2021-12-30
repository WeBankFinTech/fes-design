import { h, defineComponent, toRefs, ref } from 'vue';

import getPrefixCls from '../_util/getPrefixCls';
import FInput from '../input/input.vue';
import { COMPONENT_NAME } from './const';

const prefixCls = getPrefixCls('pagination');

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_JUMPER,
    components: {
        FInput,
    },
    props: {
        total: {
            type: Number,
            default: 0,
        },
        change: {
            type: Function,
            default: null,
        },
    },
    setup(props) {
        const current = ref();
        const { total } = toRefs(props);
        const handleChange = (val: string) => {
            const cur = parseInt(val, 10);
            if (Number.isNaN(cur)) {
                return;
            }
            const currentPage =
                cur < 1 ? 1 : cur > total.value ? total.value : cur;
            current.value = currentPage;
            props.change(currentPage);
        };
        return () => (
            <div class={`${prefixCls}-jumper`}>
                <span class={`${prefixCls}-jumper-item`}>跳至</span>
                <span class={`${prefixCls}-jumper-item`}>第</span>
                <FInput
                    v-model={current.value}
                    placeholder=""
                    onChange={handleChange}
                ></FInput>
                <span class={`${prefixCls}-jumper-item`}>页</span>
            </div>
        );
    },
});
