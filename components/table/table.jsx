import { defineComponent, onMounted, nextTick, watch, reactive } from 'vue';
import { isUndefined } from 'lodash-es';
import { TABLE_NAME, SIZE } from './const';
import useTable from './useTable';
import Table from './components/scrollTable';

export default defineComponent({
    name: TABLE_NAME,
    components: {
        Table,
    },
    props: {
        data: {
            type: Array,
            data: () => [],
        },
        rowKey: [Function, String],
        bordered: {
            type: Boolean,
            default: false,
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        emptyText: {
            type: String,
            default: '暂无数据',
        },
        size: {
            type: String,
            validator(value) {
                return SIZE.includes(value);
            },
            default: 'normal',
        },
        spanMethod: Function,
        rowClassName: [Function, String],
        rowStyle: [Function, Object],
        height: Number,
    },
    emits: [
        'cell-click',
        'expand-change',
        'header-click',
        'row-click',
        'select',
        'select-all',
        'selection-change',
        'sort-change',
    ],
    setup(props, ctx) {
        console.log('table setup1');
        const {
            handleSelect,
            handleSelectAll,
            clearSelect,
            wrapperRef,
            wrapperClass,
            wrapperStyle,
            columns,
            headerWrapperRef,
            bodyWrapperRef,
        } = useTable(props, ctx);

        ctx.expose &&
            ctx.expose({
                toggleRowSelection: handleSelect,
                toggleAllSelection: handleSelectAll,
                clearSelection: clearSelect,
            });

        const handleRef = (data) => {
            if (data.header) {
                headerWrapperRef.value = data.header;
            }
            if (data.body) {
                bodyWrapperRef.value = data.body;
            }
        };

        return () => (
            <div
                ref={wrapperRef}
                className={wrapperClass.value}
                style={wrapperStyle.value}
            >
                <div ref="hiddenColumns" class="hidden-columns">
                    {ctx.slots?.default()}
                </div>
                <Table
                    onRef={handleRef}
                    showHeader={props.showHeader}
                    columns={columns.value}
                    isScroll={!isUndefined(props.height)}
                />
            </div>
        );
    },
});
