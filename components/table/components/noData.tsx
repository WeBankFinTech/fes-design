import { defineComponent, inject } from 'vue';
import { provideKey } from '../const';

export default defineComponent({
    setup() {
        const { prefixCls, rootProps, rootCtx } = inject(provideKey);

        return () => {
            return (
                <div class={`${prefixCls}-no-data`}>
                    {rootCtx.slots.empty?.() || rootProps.emptyText}
                </div>
            );
        };
    },
});
