import { h, defineComponent, PropType } from 'vue';

import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import FSelect from '../select/select.vue';
import FOption from '../select/option.vue';
import { COMPONENT_NAME } from './const';

const prefixCls = getPrefixCls('pagination');

const pagerSizeProps = {
    modelValue: {
        type: Number,
        default: 10,
    },
    pageSizeOption: {
        type: Array as PropType<number[]>
    },
} as const;

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_SIZES,
    props: pagerSizeProps,
    emits: [UPDATE_MODEL_EVENT],
    setup(props, { emit }) {
        const [pageSize] = useNormalModel(props, emit);
        const renderOptions = () =>
            props.pageSizeOption && props.pageSizeOption.map((item) => (
                <FOption
                    key={item}
                    value={item}
                    label={`${item}条/页`}
                ></FOption>
            ));

        return () => (
            <div class={`${prefixCls}-size`}>
                <FSelect v-model={pageSize.value}>{renderOptions()}</FSelect>
            </div>
        );
    },
});
