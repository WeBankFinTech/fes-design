import { type ComponentObjectPropsOptions, defineComponent, toRefs } from 'vue';
import { useLocale } from '../config-provider/useLocale';

import getPrefixCls from '../_util/getPrefixCls';
import { COMPONENT_NAME } from './const';

const prefixCls = getPrefixCls('pagination');

export default defineComponent({
    name: COMPONENT_NAME.PAGINATION_TOTAL,
    props: {
        total: {
            type: Number,
            default: 0,
        },
    } satisfies ComponentObjectPropsOptions,
    setup(props) {
        const { total } = toRefs(props);
        const { t } = useLocale();
        return () => (
            <div class={`${prefixCls}-total`}>
                {t('pagination.total', {
                    total: total.value,
                })}
            </div>
        );
    },
});
