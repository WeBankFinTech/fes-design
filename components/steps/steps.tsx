import {
    h,
    computed,
    provide,
    defineComponent,
    ref,
    PropType,
    ExtractPropTypes,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { useTheme } from '../_theme/useTheme';
import { PROVIDE_KEY, COMPONENT_NAME, STATUS, TYPE } from './const';

const prefixCls = getPrefixCls('steps');

const stepsProps = {
    current: {
        type: Number,
    },
    status: {
        type: String as PropType<typeof STATUS[keyof typeof STATUS]>,
        default: 'process',
    },
    type: {
        type: String as PropType<typeof TYPE[number]>,
        default: 'default',
    },
    vertical: {
        type: Boolean,
        default: false,
    },
    initial: {
        type: Number,
        default: 1,
    },
} as const;

export type StepsProps = Partial<ExtractPropTypes<typeof stepsProps>>;

export default defineComponent({
    name: COMPONENT_NAME.STEPS,
    props: stepsProps,
    setup(props, { slots, emit }) {
        useTheme();
        const parentDomRef = ref<HTMLElement>();
        const [current, updateCurrent] = useNormalModel(props, emit, {
            prop: 'current',
        });
        const classList = computed(() =>
            [prefixCls, `is-${props.type}`, props.vertical && 'is-vertical']
                .filter(Boolean)
                .join(' '),
        );
        provide(PROVIDE_KEY, {
            current,
            updateCurrent,
            props,
            parentDomRef,
        });
        return () => (
            <div ref={parentDomRef} class={classList.value}>
                {slots.default?.()}
            </div>
        );
    },
});
