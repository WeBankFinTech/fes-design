/**
 * props declaration for default, item and slot component
 */

import { PropType, VNode } from 'vue';

export const VirtualProps = {
    dataKey: {
        type: [String, Function] as PropType<
            | string
            | ((
                  dataSource: object | number | string,
              ) => number | string | object)
        >,
        required: true,
    },
    dataSources: {
        type: Array as PropType<(number | string | object)[]>,
        required: true,
    },

    keeps: {
        type: Number,
        default: 30,
    },
    extraProps: {
        type: Object,
    },
    estimateSize: {
        type: Number,
        default: 50,
    },

    direction: {
        type: String as PropType<'horizontal' | 'vertical'>,
        default: 'vertical', // the other value is horizontal
    },
    start: {
        type: Number,
        default: 0,
    },
    offset: {
        type: Number,
        default: 0,
    },
    topThreshold: {
        type: Number,
        default: 0,
    },
    bottomThreshold: {
        type: Number,
        default: 0,
    },
    pageMode: {
        type: Boolean,
        default: false,
    },
    rootTag: {
        type: String,
        default: 'div',
    },
    wrapTag: {
        type: String,
        default: 'div',
    },
    wrapClass: {
        type: String,
        default: '',
    },
    wrapStyle: {
        type: Object,
    },
    itemTag: {
        type: String,
        default: 'div',
    },
    itemClass: {
        type: String,
        default: '',
    },
    itemClassAdd: {
        type: Function,
    },
    itemStyle: {
        type: Object,
    },
    headerTag: {
        type: String,
        default: 'div',
    },
    headerClass: {
        type: String,
        default: '',
    },
    headerStyle: {
        type: Object,
    },
    footerTag: {
        type: String,
        default: 'div',
    },
    footerClass: {
        type: String,
        default: '',
    },
    footerStyle: {
        type: Object,
    },
    itemScopedSlots: {
        type: Object,
    },
} as const;

export const ItemProps = {
    index: {
        type: Number,
    },
    horizontal: {
        type: Boolean,
    },
    source: {
        type: [Object, String, Number] as PropType<object | string | number>,
    },
    slotComponent: {
        type: Function as PropType<(param: object) => VNode>,
    },
    uniqueKey: {
        type: [String, Number] as PropType<string | number>,
    },
} as const;
