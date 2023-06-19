import { defineComponent, inject, PropType } from 'vue';
import { useEventListener } from '@vueuse/core';
import { provideKey } from '../const';
import Colgroup from './colgroup';
import Header from './header';

import type { ColumnInst } from '../column';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    },
    setup(props) {
        const {
            prefixCls,
            headerWrapperRef,
            headerWrapperClass,
            headerStyle,
            handleHeaderMousewheel,
        } = inject(provideKey);

        useEventListener(headerWrapperRef, 'wheel', handleHeaderMousewheel, {
            passive: false,
        });

        return () => {
            return (
                <div
                    ref={(el) => {
                        headerWrapperRef.value = el;
                    }}
                    class={headerWrapperClass.value}
                >
                    <table
                        class={`${prefixCls}-header`}
                        style={headerStyle.value}
                        cellspacing="0"
                        cellpadding="0"
                    >
                        <Colgroup columns={props.columns} />
                        <Header columns={props.columns} />
                    </table>
                </div>
            );
        };
    },
});
