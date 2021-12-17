import { defineComponent, inject } from 'vue';
import { provideKey } from '../const';
import Table from './table';

export default defineComponent({
    components: {
        Table,
    },
    props: {
        showHeader: {
            type: Boolean,
        },
        columns: {
            type: Array,
            required: true,
        },
        isScroll: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    emits: ['ref'],
    setup(props, { emit }) {
        const {
            prefixCls,
            headerWrapperStyle,
            headerStyle,
            bodyWrapperStyle,
            bodyStyle,
        } = inject(provideKey);
        if (props.isScroll && props.showHeader) {
            return () => (
                <>
                    <div
                        ref={(ele) => {
                            emit('ref', { header: ele });
                        }}
                        className={`${prefixCls}-header-wrapper`}
                        style={headerWrapperStyle.value}
                    >
                        <Table
                            class={`${prefixCls}-header`}
                            style={headerStyle.value}
                            columns={props.columns}
                            hasHeader={true}
                            hasBody={false}
                        />
                    </div>
                    <div
                        ref={(ele) => {
                            emit('ref', { body: ele });
                        }}
                        className={`${prefixCls}-body-wrapper`}
                        style={bodyWrapperStyle.value}
                    >
                        <Table
                            class={`${prefixCls}-body`}
                            style={bodyStyle.value}
                            columns={props.columns}
                            hasHeader={false}
                            hasBody={true}
                        />
                    </div>
                </>
            );
        }
        return () => (
            <div
                ref={(ele) => {
                    emit('ref', { body: ele });
                }}
                className={`${prefixCls}-body-wrapper`}
                style={bodyWrapperStyle.value}
            >
                <Table
                    class={`${prefixCls}-body`}
                    style={bodyStyle.value}
                    columns={props.columns}
                    hasHeader={props.showHeader}
                    hasBody={true}
                />
            </div>
        );
    },
});
