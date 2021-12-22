import { defineComponent, toRefs, watch } from 'vue';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import LeftOutlined from '../icon/LeftOutlined';
import RightOutlined from '../icon/RightOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { COMPONENT_NAME } from './const';

const prefixCls = getPrefixCls('pagination');

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_SIMPLER,
    components: {
        LeftOutlined,
        RightOutlined,
    },
    props: {
        modelValue: {
            type: Number,
            default: 1,
        },
        total: {
            type: Number,
            default: 0,
        },
    },
    emits: [UPDATE_MODEL_EVENT],
    setup(props, { emit }) {
        const { total } = toRefs(props);
        const [currentPage, updateCurrentPage] = useNormalModel(props, emit);

        const handleCurrentChange = (cur) => {
            let temp = 0;
            if (cur < 1) {
                temp = 1;
            } else if (cur > total.value) {
                temp = total.value < 1 ? 1 : total.value;
            } else {
                temp = cur;
            }
            updateCurrentPage(temp);
        };

        watch(total, () => {
            if (total.value > 0 && total.value < currentPage.value) {
                updateCurrentPage(total.value);
            }
        });

        return () => (
            <div class={`${prefixCls}-pager ${prefixCls}-simpler`}>
                <div
                    class={`${prefixCls}-pager-item${
                        currentPage.value <= 1 ? ' is-disabled' : ''
                    }`}
                    onClick={handleCurrentChange.bind(
                        null,
                        currentPage.value - 1,
                    )}
                >
                    <LeftOutlined />
                </div>
                <div class={`${prefixCls}-pager-item is-current`}>
                    {currentPage.value}
                </div>
                <div class={`${prefixCls}-simpler-total`}>
                    <i class={`${prefixCls}-simpler-total-split`}>/</i>
                    <span>{total.value}</span>
                </div>
                <div
                    class={`${prefixCls}-pager-item${
                        total.value <= currentPage.value ? ' is-disabled' : ''
                    }`}
                    onClick={handleCurrentChange.bind(
                        null,
                        currentPage.value + 1,
                    )}
                >
                    <RightOutlined />
                </div>
            </div>
        );
    },
});
