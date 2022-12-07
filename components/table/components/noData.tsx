import { defineComponent, inject } from 'vue';
import { provideKey } from '../const';

export default defineComponent({
    setup() {
        const { prefixCls, columns, rootProps, rootCtx } = inject(provideKey);

        return () => {
            return (
                <tbody>
                    <tr class={`${prefixCls}-row`}>
                        <td
                            colspan={columns.value.length}
                            class={`${prefixCls}-td ${prefixCls}-cell ${prefixCls}-no-data`}
                        >
                            {rootCtx.slots.empty?.() || rootProps.emptyText}
                        </td>
                    </tr>
                </tbody>
            );
        };
    },
});
