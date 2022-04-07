import { h, defineComponent, toRefs, ref } from 'vue';

import getPrefixCls from '../_util/getPrefixCls';
import InputInner from '../input/inputInner.vue';
import { COMPONENT_NAME } from './const';
import { useLocale } from '../config-provider/useLocale';

const prefixCls = getPrefixCls('pagination');

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_JUMPER,
    components: {
        InputInner
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
        const { t } = useLocale()
        return () => (
            <div class={`${prefixCls}-jumper`}>
                <span class={`${prefixCls}-jumper-item`}>{t('pagination.goto')}</span>
                <InputInner
                    v-model={current.value}
                    placeholder=""
                    onChange={handleChange}
                ></InputInner>
                <span class={`${prefixCls}-jumper-item`}>{t('pagination.pageClassifier')}</span>
            </div>
        );
    },
});
