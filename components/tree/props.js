const PROPS = {
    data: {
        type: Array,
        default() {
            return [];
        },
        required: true,
    },
    defaultExpandAll: {
        type: Boolean,
        default: false,
    },
    expandedKeys: {
        type: Array,
        default() {
            return [];
        },
    },
    accordion: {
        type: Boolean,
        default: false,
    },
    selectable: {
        type: Boolean,
        default: true,
    },
    selectedKeys: {
        type: Array,
        default() {
            return [];
        },
    },
    checkable: {
        type: Boolean,
        default: false,
    },
    checkStrictly: {
        type: Boolean,
        default: false,
    },
    checkedKeys: {
        type: Array,
        default() {
            return [];
        },
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    childrenField: {
        type: String,
        default: 'children',
    },
    valueField: {
        type: String,
        default: 'value',
    },
    labelField: {
        type: String,
        default: 'label',
    },
    remote: {
        type: Boolean,
        default: false,
    },
    loadData: {
        type: Function,
        default: null,
    },
    filterMethod: {
        type: Function,
        default: null,
    },
    inline: {
        type: Boolean,
        default: false,
    },
};

export default PROPS;
