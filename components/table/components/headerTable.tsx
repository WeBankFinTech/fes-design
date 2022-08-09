import { defineComponent, inject, PropType } from 'vue';
import Mousewheel from '../../_util/directives/mousewheel';
import { provideKey } from '../const';
import Colgroup from './colgroup';
import Header from './header';

import type { ColumnInst } from '../column.vue';

export default defineComponent({
    directives: {
        mousewheel: Mousewheel,
    },
    props: {
        composed: {
            type: Boolean,
            default: false,
        },
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    },
    setup(props) {
        const {
            rootProps,
            prefixCls,
            headerWrapperRef,
            headerWrapperClass,
            headerStyle,
            handleHeaderMousewheel,
        } = inject(provideKey);

        return () => {
            if (!(props.composed && rootProps.showHeader)) {
                return null;
            }
            return (
                <div
                    ref={(el) => {
                        headerWrapperRef.value = el;
                    }}
                    class={headerWrapperClass.value}
                    v-mousewheel={(e: Event, data: any) => {
                        handleHeaderMousewheel(e, data);
                    }}
                >
                    <table
                        class={`${prefixCls}-header`}
                        style={headerStyle.value}
                        cellspacing="0"
                        cellpadding="0"
                    >
                        <Colgroup columns={props.columns} />
                        <Header />
                    </table>
                </div>
            );
        };
    },
});
