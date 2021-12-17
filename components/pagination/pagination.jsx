import {
    defineComponent, computed, toRefs, watch, ref,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT } from '../_util/constants';
import Simpler from './simpler';
import Pager from './pager';
import Sizes from './sizes';
import Jumper from './jumper';
import Total from './total';
import { COMPONENT_NAME, PROPS } from './const';

const prefixCls = getPrefixCls('pagination');

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION,
    components: {
        Simpler, Pager, Sizes, Jumper, Total,
    },
    props: PROPS,
    emits: [CHANGE_EVENT, 'pageSizeChange', 'update:currentPage', 'update:pageSize'],
    setup(props, { emit }) {
        const [currentPage, updateCurrentPage] = useNormalModel(props, emit, {
            prop: 'currentPage',
        });
        const [pageSize] = useNormalModel(props, emit, {
            prop: 'pageSize',
        });
        const {
            small, pageSizeOption, totalCount, simple, showSizeChanger, showQuickJumper, showTotal,
        } = toRefs(props);
        const totalPage = ref(Math.ceil(totalCount.value / pageSize.value));
        const classList = computed(() => `${prefixCls}${small.value ? ` ${prefixCls}-small` : ''}`);
        const sizeOption = computed(() => {
            const res = pageSizeOption.value.slice();
            if (res.includes(pageSize.value) === false) {
                res.push(pageSize.value);
            }
            res.sort((x, y) => x - y);
            return res;
        });

        const changeCurrentPage = (cur) => {
            updateCurrentPage(cur);
        };

        const renderSimpler = () => {
            if (!simple.value) {
                return null;
            }
            return (
                <Simpler
                    v-model={currentPage.value}
                    total={totalPage.value}
                />
            );
        };

        const renderPager = () => {
            if (simple.value) {
                return null;
            }
            return (
                <Pager
                    v-model={currentPage.value}
                    total={totalPage.value}
                />
            );
        };

        const renderSizes = () => {
            if (!showSizeChanger.value) {
                return null;
            }
            return (
                <Sizes
                    v-model={pageSize.value}
                    page-size-option={sizeOption.value}
                />
            );
        };

        const renderJumper = () => {
            if (!showQuickJumper.value) {
                return null;
            }
            return (
                <Jumper
                    total={totalPage.value}
                    change={changeCurrentPage}
                />
            );
        };

        const renderTotal = () => {
            if (!showTotal.value) {
                return null;
            }
            return (
                <Total
                    total={totalCount.value}
                />
            );
        };

        watch(totalCount, () => {
            totalPage.value = Math.ceil(totalCount.value / pageSize.value);
        });
        watch(currentPage, () => {
            emit(CHANGE_EVENT, currentPage.value);
        });
        watch(pageSize, () => {
            totalPage.value = Math.ceil(totalCount.value / pageSize.value);
            emit('pageSizeChange', pageSize.value);
        });
        return () => (
            <div className={classList.value}>
            {renderSimpler()}
            {renderPager()}
            {renderSizes()}
            {renderJumper()}
            {renderTotal()}
        </div>
        );
    },
});
