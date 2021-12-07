import {
    computed, provide, defineComponent, ref,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import {
    PROVIDE_KEY, COMPONENT_NAME, STATUS, TYPE,
} from './const';

const prefixCls = getPrefixCls('steps');

export default defineComponent({
    name: COMPONENT_NAME.STEPS,
    props: {
        current: {
            type: Number,
        },
        status: {
            type: String,
            default: 'process',
            validator(value) {
                return Object.values(STATUS).includes(value);
            },
        },
        type: {
            type: String,
            default: 'default',
            validator(value) {
                return TYPE.includes(value);
            },
        },
        vertical: {
            type: Boolean,
            default: false,
        },
        initial: {
            type: Number,
            default: 1,
        },
    },
    setup(props, { slots, emit }) {
        const parentDomRef = ref(null);
        const [current, updateCurrent] = useNormalModel(props, emit, { prop: 'current' });
        const classList = computed(() => [prefixCls, `is-${props.type}`, props.vertical && 'is-vertical']
            .filter(Boolean)
            .join(' '));
        provide(PROVIDE_KEY, {
            current,
            updateCurrent,
            props,
            parentDomRef,
        });
        return () => <div ref={parentDomRef} className={classList.value}>{slots.default?.()}</div>;
    },
});
