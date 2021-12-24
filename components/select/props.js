const PROPS = {
    modelValue: {
        type: [String, Number, Array, Boolean, Object],
        default: null,
    },
    placeholder: {
        type: String,
        default() {
            return '请选择';
        },
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    multipleLimit: {
        type: Number,
        default: 0,
    },
    emptyText: {
        type: String,
        default: '无数据',
    },
    appendToContainer: {
        type: Boolean,
        default: true,
    },
    getContainer: {
        type: Function,
    },
    filterable: {
        type: Boolean,
        default: false,
    },
    collapseTags: {
        type: Boolean,
        default: false,
    },
    collapseTagsLimit: {
        type: Number,
        default: 1,
    },
};

export default PROPS;
