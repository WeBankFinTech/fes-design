import {
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    provide,
    ref,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { useTheme } from '../_theme/useTheme';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { COMPONENT_NAME, PROVIDE_KEY, type STATUS, type TYPE } from './const';

const prefixCls = getPrefixCls('steps');

export const stepsProps = {
    current: {
        type: Number,
    },
    status: {
        type: String as PropType<(typeof STATUS)[keyof typeof STATUS]>,
        default: 'process',
    },
    type: {
        type: String as PropType<(typeof TYPE)[number]>,
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
} as const satisfies ComponentObjectPropsOptions;

export type StepsProps = ExtractPublicPropTypes<typeof stepsProps>;

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
        const count = ref(0);
        const onUpdate = () => {
            count.value += 1;
        };
        provide(PROVIDE_KEY, {
            current,
            updateCurrent,
            props,
            parentDomRef,
            count,
            onUpdate,
        });
        return () => (
            <div ref={parentDomRef} class={classList.value}>
                {slots.default?.()}
            </div>
        );
    },
});
