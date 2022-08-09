import { defineComponent, computed, toRefs, watch } from 'vue';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import LeftOutlined from '../icon/LeftOutlined';
import RightOutlined from '../icon/RightOutlined';
import MoreOutlined from '../icon/MoreOutlined';
import DoubleLeftOutlined from '../icon/DoubleLeftOutlined';
import DoubleRightOutlined from '../icon/DoubleRightOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { COMPONENT_NAME } from './const';

const prefixCls = getPrefixCls('pagination');
const STEP = 5; // 理论上说根据对称性只能为奇数，实际偶数也可

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_PAGER,
    components: {
        LeftOutlined,
        RightOutlined,
        MoreOutlined,
        DoubleLeftOutlined,
        DoubleRightOutlined,
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
        const pages = computed(() => {
            const res = [];
            let count = 0;
            const currentVal = Number.isNaN(parseInt(currentPage.value, 10))
                ? 1
                : parseInt(currentPage.value, 10);
            let start = currentVal - Math.floor(STEP / 2);
            while (count < STEP) {
                res.push(start);
                count += 1;
                start += 1;
            }
            while (res[0] < 1) {
                res.shift();
                const lastCount: number = res[res.length - 1];
                if (lastCount < total.value - 1) {
                    res.push(lastCount + 1);
                }
            }
            while (res[res.length - 1] > total.value) {
                res.pop();
                if (res[0] > 2) {
                    res.unshift(res[0] - 1);
                }
            }
            if (res[0] === 1) {
                res.shift();
            }
            if (res[res.length - 1] === total.value) {
                res.pop();
            }
            return res;
        });
        const handleCurrentChange = (cur: number) => {
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

        const getClassList = (cur: number) =>
            `${prefixCls}-pager-item${
                cur === parseInt(currentPage.value, 10) ? ' is-active' : ''
            }`;
        const getBtnElement = () =>
            pages.value.map((item) => (
                <div
                    class={getClassList(item)}
                    onClick={handleCurrentChange.bind(null, item)}
                >
                    {item}
                </div>
            ));

        const renderPrevDoubleJump = () => {
            if (pages.value.length > 0 && pages.value[0] > 2) {
                return (
                    <div
                        class={`${prefixCls}-pager-item is-double-jump`}
                        onClick={handleCurrentChange.bind(
                            null,
                            currentPage.value - STEP,
                        )}
                    >
                        <div class={'is-more'}>
                            <MoreOutlined />
                        </div>
                        <div class={'is-jump'}>
                            <DoubleLeftOutlined />
                        </div>
                    </div>
                );
            }
            return null;
        };

        const renderNextDoubleJump = () => {
            if (
                pages.value.length > 0 &&
                pages.value[pages.value.length - 1] < total.value - 1
            ) {
                return (
                    <div
                        class={`${prefixCls}-pager-item is-double-jump`}
                        onClick={handleCurrentChange.bind(
                            null,
                            currentPage.value + STEP,
                        )}
                    >
                        <div class={'is-more'}>
                            <MoreOutlined />
                        </div>
                        <div class={'is-jump'}>
                            <DoubleRightOutlined />
                        </div>
                    </div>
                );
            }
            return null;
        };

        const renderLast = () => {
            if (total.value > 1) {
                return (
                    <div
                        class={getClassList(total.value)}
                        onClick={handleCurrentChange.bind(null, total.value)}
                    >
                        {total.value}
                    </div>
                );
            }
            return null;
        };

        watch(total, () => {
            if (total.value > 0 && total.value < currentPage.value) {
                updateCurrentPage(total.value);
            }
        });
        return () => (
            <div class={`${prefixCls}-pager`}>
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
                <div
                    class={getClassList(1)}
                    onClick={handleCurrentChange.bind(null, 1)}
                >
                    1
                </div>
                {renderPrevDoubleJump()}
                {getBtnElement()}
                {renderNextDoubleJump()}
                {renderLast()}
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
