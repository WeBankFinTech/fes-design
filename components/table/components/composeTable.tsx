import { h, defineComponent, inject, Fragment, computed } from 'vue';
import { isUndefined } from 'lodash-es';
import Mousewheel from '../../_util/directives/mousewheel';
import { provideKey } from '../const';
import Table from './table';
import VirtualTable from './virtualTable';

export default defineComponent({
    directives: {
        mousewheel: Mousewheel,
    },
    emits: ['ref', 'scroll', 'mousewheelHeader'],
    setup(props, { emit }) {
        const {
            layout,
            prefixCls,
            headerWrapperClass,
            headerStyle,
            bodyWrapperClass,
            bodyWrapperStyle,
            bodyStyle,
            columns,
            rootProps,
        } = inject(provideKey);

        // 计算出传入columns列的对应的宽度
        const columnsRef = computed(() => {
            const widthListValue = layout.widthList.value;
            return columns.value.map((column) => ({
                ...column,
                width: (widthListValue as any)[column.id],
            }));
        });

        // 是否两个table
        const composed = computed(() => {
            return !isUndefined(rootProps.height);
        });

        return () => (
            <>
                {composed.value && rootProps.showHeader && (
                    <div
                        ref={(ele) => {
                            emit('ref', { header: ele });
                        }}
                        class={headerWrapperClass.value}
                        v-mousewheel={(e: Event, data: any) => {
                            emit('mousewheelHeader', e, data);
                        }}
                    >
                        <Table
                            class={`${prefixCls}-header`}
                            style={headerStyle.value}
                            columns={columnsRef.value}
                            hasHeader={true}
                            hasBody={false}
                        />
                    </div>
                )}
                {rootProps.virtualScroll ? (
                    <VirtualTable columns={columnsRef.value}/>
                ) : (
                    <div
                        ref={(ele) => {
                            emit('ref', { body: ele });
                        }}
                        class={bodyWrapperClass.value}
                        style={bodyWrapperStyle.value}
                        onScroll={(e) => {
                            if (
                                layout.isScrollX.value ||
                                layout.isScrollY.value
                            ) {
                                emit('scroll', e);
                            }
                        }}
                    >
                        <Table
                            class={`${prefixCls}-body`}
                            style={bodyStyle.value}
                            columns={columnsRef.value}
                            hasHeader={!composed.value && rootProps.showHeader}
                            hasBody={true}
                        />
                    </div>
                )}
            </>
        );
    },
});
