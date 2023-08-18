import { defineComponent, toRefs, watch } from 'vue';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import LeftOutlined from '../icon/LeftOutlined';
import RightOutlined from '../icon/RightOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import InputInner from '../input/inputInner.vue';
import { useNormalModel } from '../_util/use/useModel';
import { COMPONENT_NAME } from './const';

const prefixCls = getPrefixCls('pagination');

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_SIMPLER,
    components: {
        LeftOutlined,
        RightOutlined,
        InputInner,
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

        const handleCurrentChange = (current: number) => {
            let temp = 0;
            if (current < 1) {
                temp = 1;
            } else if (current > total.value) {
                temp = total.value < 1 ? 1 : total.value;
            } else {
                temp = current;
            }
            updateCurrentPage(temp);
        };

        // 处理输入页码的事件
        const handleInputChange = (val: string) => {
            // 如果用户输入是非数字的字符，则不做任何行为
            const inputValue = Number(val);
            if (isNaN(inputValue)) return;
            handleCurrentChange(inputValue);
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
                {/* 当前页面页码 */}
                <InputInner
                    class={`${prefixCls}-jumper-input`}
                    modelValue={currentPage.value}
                    onChange={handleInputChange}
                ></InputInner>
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
