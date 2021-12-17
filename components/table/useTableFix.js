import { computed } from 'vue';

export default ({ columns, layout, prefixCls }) => {
    const fixLeftColumn = computed(() => {
        const col = columns.value[0];
        if (col && col.fixLeft) {
            return col;
        }
        return null;
    });

    const fixRightColumn = computed(() => {
        const col = columns.value[columns.value.length - 1];
        if (col && col.fixRight) {
            return col;
        }
        return null;
    });

    const getFixClass = (column) => {
        if (column.fixLeft) {
            return `${prefixCls}-fixed`;
        }
        if (column.fixRight) {
            return `${prefixCls}-fixed-right`;
        }
        return '';
    };

    const getFixStyle = (column) => {
        const widthListValue = layout.widthList.value;
        let width = 0;
        if (column.fixLeft) {
            width = widthListValue[0]?.width;
        }
        if (column.fixRight) {
            width = widthListValue[widthListValue.length - 1]?.width;
        }
        return {
            width: width ? `${width}px` : 'auto',
            height: `${layout.wrapperHeight.value}px`,
        };
    };

    const getFixTrStyle = (fixedColumn, rowIndex) => {
        if (!fixedColumn) {
            return {};
        }
        const heightList = layout.heightList.value;
        return {
            height: `${heightList[rowIndex]}px`,
        };
    };

    // fixed列不显示滚动条，由js改变滚动高度
    const fixBodyWrapperStyle = computed(() => ({
        overflow: 'hidden',
    }));

    return {
        fixLeftColumn,
        fixRightColumn,
        getFixClass,
        getFixStyle,
        getFixTrStyle,
        fixBodyWrapperStyle,
    };
};
