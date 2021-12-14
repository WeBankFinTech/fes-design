import { defineComponent } from 'vue';

import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import { FSelect, FOption } from '../select';
import { COMPONENT_NAME } from './const';

const prefixCls = getPrefixCls('pagination');

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_SIZES,
    components: {
        FSelect,
        FOption,
    },
    props: {
        modelValue: {
            type: Number,
            default: 10,
        },
        pageSizeOption: {
            type: Array,
        },
    },
    emits: [UPDATE_MODEL_EVENT],
    setup(props, { emit }) {
        const [pageSize] = useNormalModel(props, emit);
        const renderOptions = () => props.pageSizeOption.map((item) => <FOption key={item} value={item} label={`${item}条/页`}></FOption>);

        return () => (
            <div className={`${prefixCls}-size`}>
                <FSelect v-model={pageSize.value}>{renderOptions()}</FSelect>
            </div>
        );
    },
});
