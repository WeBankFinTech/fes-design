import { defineComponent, PropType } from 'vue';

import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import FSelect from '../select/select.vue';
import FOption from '../select/option';
import { useLocale } from '../config-provider/useLocale';
import { COMPONENT_NAME } from './const';

const prefixCls = getPrefixCls('pagination');

const pagerSizeProps = {
    modelValue: {
        type: Number,
        default: 10,
    },
    pageSizeOption: {
        type: Array as PropType<number[]>,
    },
} as const;

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_SIZES,
    components: {
        FSelect,
        FOption,
    },
    props: pagerSizeProps,
    emits: [UPDATE_MODEL_EVENT],
    setup(props, { emit }) {
        const [pageSize] = useNormalModel(props, emit);
        const { t } = useLocale();
        const renderOptions = () =>
            props.pageSizeOption &&
            props.pageSizeOption.map((item) => (
                <FOption
                    key={item}
                    value={item}
                    label={`${item}${t('pagination.pageSize')}`}
                ></FOption>
            ));

        return () => (
            <div class={`${prefixCls}-size`}>
                <FSelect
                    class={`${prefixCls}-size-select`}
                    v-model={pageSize.value}
                >
                    {renderOptions()}
                </FSelect>
            </div>
        );
    },
});
