import { h, defineComponent, PropType } from 'vue';

import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import FSelect from '../select/select.vue';
import FOption from '../select/option.vue';
import { COMPONENT_NAME } from './const';
import { useLocale } from '../config-provider/useLocale';

const prefixCls = getPrefixCls('pagination');

const pagerSizeProps = {
    modelValue: {
        type: Number,
        default: 10,
    },
    pageSizeOption: {
        type: Array as PropType<number[]>
    },
    change: {
        type: Function,
    },
} as const;

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_SIZES,
    props: pagerSizeProps,
    components: {
        FSelect,
        FOption
    },
    emits: [UPDATE_MODEL_EVENT],
    setup(props, { emit }) {
        const [pageSize] = useNormalModel(props, emit);
        const { t } = useLocale()
        const change = () => {
            props.change();
        }
        const renderOptions = () =>
            props.pageSizeOption && props.pageSizeOption.map((item) => (
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
                    onChange={change}
                >
                    {renderOptions()}
                </FSelect>
            </div>
        );
    },
});
