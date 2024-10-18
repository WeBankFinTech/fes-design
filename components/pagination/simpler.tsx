import {
    type ComponentObjectPropsOptions,
    defineComponent,
    ref,
    toRefs,
    watch,
} from 'vue';
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
    } satisfies ComponentObjectPropsOptions,
    emits: [UPDATE_MODEL_EVENT],
    setup(props, { emit }) {
        const { total } = toRefs(props);

        const [currentPage, updateCurrentPage] = useNormalModel(props, emit);

        // 这里单独定义响应式变量，用 modelValue={currentPage.value} 的方式，会导致无效数据重复赋值可能内部不更新的情况
        const innerCurrent = ref();

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

        // 处理输入页码 change 事件
        const handleChange = (val: string) => {
            // 如果用户输入是非数字的字符，则不做任何行为
            const inputValue = Number(val);
            if (Number.isNaN(inputValue)) {
                return;
            }
            handleCurrentChange(inputValue);
        };

        watch(total, () => {
            if (total.value > 0 && total.value < currentPage.value) {
                updateCurrentPage(total.value);
            }
        });
        watch(currentPage, () => {
            innerCurrent.value = currentPage.value;
        }, {
            immediate: true,
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
                    v-model={innerCurrent.value}
                    onChange={handleChange}
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
