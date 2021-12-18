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
        composed: {
            type: Boolean,
        },
        isFixed: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['ref', 'scroll'],
    setup(props, { emit }) {
        console.log('composetable setup');
        const {
            layout,
            prefixCls,
            headerWrapperStyle,
            headerStyle,
            bodyWrapperStyle,
            bodyStyle,
            fixBodyWrapperStyle,
        } = inject(provideKey);
        return () => (
            <>
                {props.composed && props.showHeader && (
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
                )}
                <div
                    ref={(ele) => {
                        emit('ref', { body: ele });
                    }}
                    className={`${prefixCls}-body-wrapper`}
                    style={{
                        ...bodyWrapperStyle.value,
                        ...(props.isFixed ? fixBodyWrapperStyle.value : {}),
                    }}
                    onScroll={(e) => {
                        if (layout.isScrollY.value) {
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
                    />
                </div>
            </>
        );
    },
});
