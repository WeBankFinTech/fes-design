import { defineComponent, inject } from 'vue';
import Mousewheel from '../../_util/directives/mousewheel';
import { provideKey } from '../const';
import Table from './table';

export default defineComponent({
    components: {
        Table,
    },
    directives: {
        mousewheel: Mousewheel,
    },
    props: {
        showHeader: {
            type: Boolean,
        },
        columns: {
            type: Array,
            required: true,
        },
        composed: {
            type: Boolean,
        },
        emptyText: {
            type: String,
        },
    },
    emits: ['ref', 'scroll', 'mousewheelHeader'],
    setup(props, { emit }) {
        const {
            layout,
            prefixCls,
            headerWrapperClass,
            headerWrapperStyle,
            headerStyle,
            bodyWrapperClass,
            bodyWrapperStyle,
            bodyStyle,
        } = inject(provideKey);
        return () => (
            <>
                {props.composed && props.showHeader && (
                    <div
                        ref={(ele) => {
                            emit('ref', { header: ele });
                        }}
                        class={headerWrapperClass.value}
                        style={headerWrapperStyle.value}
                        v-mousewheel={(e) => {
                            emit('mousewheelHeader', e);
                        }}
                    >
                        <Table
                            class={`${prefixCls}-header`}
                            style={headerStyle.value}
                            columns={props.columns}
                            hasHeader={true}
                            hasBody={false}
                            emptyText={props.emptyText}
                        />
                    </div>
                )}
                <div
                    ref={(ele) => {
                        emit('ref', { body: ele });
                    }}
                    class={bodyWrapperClass.value}
                    style={bodyWrapperStyle.value}
                    onScroll={(e) => {
                        if (layout.isScrollX.value || layout.isScrollY.value) {
                            emit('scroll', e);
                        }
                    }}
                >
                    <Table
                        class={`${prefixCls}-body`}
                        style={bodyStyle.value}
                        columns={props.columns}
                        hasHeader={!props.composed && props.showHeader}
                        hasBody={true}
                        emptyText={props.emptyText}
                    />
                </div>
            </>
        );
    },
});
