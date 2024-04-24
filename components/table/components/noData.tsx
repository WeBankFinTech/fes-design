import { defineComponent, inject } from 'vue';
import { provideKey } from '../const';
import { useLocale } from '../../config-provider/useLocale';

export default defineComponent({
    setup() {
        const { prefixCls, rootProps, rootCtx } = inject(provideKey);

        const { t } = useLocale();

        return () => {
            const emptyText
                = rootCtx.slots.empty?.()
                ?? rootProps.emptyText
                ?? t('empty.emptyText');

            return <div class={`${prefixCls}-no-data`}>{emptyText}</div>;
        };
    },
});
