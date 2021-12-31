import { CHECK_STRATEGY } from './const';

const PROPS = {
    currentValue: [Number, String, Array, Object],
    options: {
        type: Array,
        default: () => [],
    },
    multiple: Boolean,
    nodeConfig: {
        type: Object,
        default: () => {},
    },
    renderLabel: Function,
    handleUpdateSelectedNodes: Function,
    showAllLevels: {
        type: Boolean,
        default: true,
    },
    separator: {
        type: String,
        default: ' / ',
    },
    checkStrictly: {
        type: String,
        default: CHECK_STRATEGY.CHILD,
        validator(value) {
            return Object.values(CHECK_STRATEGY).includes(value);
        },
    },
};

export default PROPS;
