import {
    type ComponentObjectPropsOptions,
    type PropType,
    defineComponent,
    inject,
} from 'vue';
import { useEventListener } from '@vueuse/core';
import { provideKey } from '../const';
import type { ColumnInst } from '../column';
import Colgroup from './colgroup';
import Header from './header';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    } satisfies ComponentObjectPropsOptions,
    setup(props) {
        const {
            prefixCls,
            headerWrapperRef,
            headerWrapperClass,
            headerStyle,
            headerShadowVisible,
            handleHeaderMousewheel,
        } = inject(provideKey);

        useEventListener(headerWrapperRef, 'wheel', handleHeaderMousewheel, {
            passive: false,
        });

        return () => {
            return (
                <>
                    {headerShadowVisible.value.left
                        ? (
                            <div class={`${prefixCls}-header-shadow-left`} />
                            )
                        : undefined}
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
                    {headerShadowVisible.value.right
                        ? (
                            <div class={`${prefixCls}-header-shadow-right`} />
                            )
                        : undefined}
                </>
            );
        };
    },
});
